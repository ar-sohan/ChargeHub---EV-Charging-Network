import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { DataSource, IsNull, Not } from 'typeorm';
import { BookingEntity } from './booking.entity';
import { UserNotification } from './notification.entity';
import { NotificationService } from './notification.service';

export const CHARGING_DURATION_MS = 20000;
export function chargingPercent(start: Date, now = Date.now()) {
  return Math.min(
    100,
    Math.max(
      0,
      Math.floor(((now - start.getTime()) / CHARGING_DURATION_MS) * 100),
    ),
  );
}

@Injectable()
export class ChargingService implements OnModuleInit, OnModuleDestroy {
  private timer?: ReturnType<typeof setInterval>;
  private running = false;
  private logger = new Logger(ChargingService.name);
  constructor(
    private db: DataSource,
    private notifications: NotificationService,
  ) {}

  onModuleInit() {
    this.timer = setInterval(() => void this.completeDue(), 5000);
    void this.completeDue();
  }
  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  async start(id: number, userId: number) {
    const booking = await this.db.transaction(async (manager) => {
      const item = await manager.findOne(BookingEntity, {
        where: { id, user: { id: userId } },
        lock: { mode: 'pessimistic_write', tables: ['bookings'] },
      });
      if (!item) throw new NotFoundException('Booking not found');
      if (item.chargingStartedAt) return item;
      if (item.status !== 'confirmed')
        throw new ConflictException(
          'Payment must be confirmed before charging',
        );
      item.chargingStartedAt = new Date();
      return manager.save(item);
    });
    return this.view(booking);
  }

  async stop(id: number, userId: number) {
    const result = await this.db.transaction(async (manager) => {
      const item = await manager.findOne(BookingEntity, {
        where: { id, user: { id: userId } },
        lock: { mode: 'pessimistic_write', tables: ['bookings'] },
      });
      if (!item) throw new NotFoundException('Booking not found');
      if (!item.chargingStartedAt)
        throw new ConflictException('Charging has not started');
      if (item.chargingCompletedAt || item.chargingStoppedAt)
        return { item, notice: null };
      const now = new Date();
      const percentage = chargingPercent(item.chargingStartedAt, now.getTime());
      if (percentage === 100) {
        item.chargingCompletedAt = now;
        item.status = 'completed';
      } else {
        item.chargingStoppedAt = now;
        item.status = 'stopped';
      }
      await manager.save(item);
      const notice = await manager.save(
        UserNotification,
        manager.create(UserNotification, {
          user: { id: userId },
          bookingId: item.id,
          title: percentage === 100 ? 'Charging complete' : 'Charging stopped',
          message:
            'Charging for slot ' +
            item.slotNumber +
            (percentage === 100
              ? ' completed at 100%.'
              : ' stopped at ' + percentage + '%.'),
        }),
      );
      return { item, notice };
    });
    if (result.notice) await this.notifications.deliver(userId, result.notice);
    return this.view(result.item);
  }

  async list(userId: number) {
    const items = await this.db.getRepository(BookingEntity).find({
      where: { user: { id: userId }, chargingStartedAt: Not(IsNull()) },
      order: { chargingStartedAt: 'DESC' },
    });
    return items.map((item) => this.view(item));
  }

  private view(item: BookingEntity) {
    return {
      bookingId: item.id,
      slotNumber: item.slotNumber,
      simulated: true,
      startedAt: item.chargingStartedAt,
      completedAt: item.chargingCompletedAt,
      stoppedAt: item.chargingStoppedAt,
      status: item.chargingCompletedAt
        ? 'completed'
        : item.chargingStoppedAt
          ? 'stopped'
          : 'charging',
      percentage: item.chargingCompletedAt
        ? 100
        : chargingPercent(
            item.chargingStartedAt!,
            item.chargingStoppedAt?.getTime() ?? Date.now(),
          ),
      durationSeconds: CHARGING_DURATION_MS / 1000,
    };
  }

  async completeDue() {
    if (this.running) return;
    this.running = true;
    try {
      const candidates = await this.db.getRepository(BookingEntity).find({
        where: {
          chargingStartedAt: Not(IsNull()),
          chargingCompletedAt: IsNull(),
          status: 'confirmed',
        },
        select: { id: true, chargingStartedAt: true },
      });
      for (const candidate of candidates) {
        if (chargingPercent(candidate.chargingStartedAt!) < 100) continue;
        const result = await this.db.transaction(async (manager) => {
          const item = await manager.findOne(BookingEntity, {
            where: { id: candidate.id },
            relations: { user: true },
            lock: { mode: 'pessimistic_write', tables: ['bookings'] },
          });
          if (!item || item.chargingCompletedAt || item.status !== 'confirmed')
            return null;
          item.chargingCompletedAt = new Date();
          item.status = 'completed';
          await manager.save(item);
          const notice = await manager.save(
            UserNotification,
            manager.create(UserNotification, {
              user: { id: item.user.id },
              bookingId: item.id,
              title: 'Charging complete',
              message:
                'Simulated charging for slot ' +
                item.slotNumber +
                ' reached 100%. Your session is complete.',
            }),
          );
          return { notice, userId: item.user.id };
        });
        if (result)
          await this.notifications.deliver(result.userId, result.notice);
      }
    } catch {
      this.logger.warn('Charging update failed; retrying on the next interval');
    } finally {
      this.running = false;
    }
  }
}
