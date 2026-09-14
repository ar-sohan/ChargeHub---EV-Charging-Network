import { Injectable, ForbiddenException, ServiceUnavailableException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Pusher = require('pusher');
import { UserNotification } from './notification.entity';

@Injectable()
export class NotificationService {
  private readonly client: Pusher | null;
  private readonly logger = new Logger(NotificationService.name);

  constructor(config: ConfigService, @InjectRepository(UserNotification) private readonly repo: Repository<UserNotification>) {
    const appId = config.get<string>('PUSHER_APP_ID');
    const key = config.get<string>('PUSHER_KEY');
    const secret = config.get<string>('PUSHER_SECRET');
    const cluster = config.get<string>('PUSHER_CLUSTER');
    this.client = appId && key && secret && cluster
      ? new Pusher({ appId, key, secret, cluster, useTLS: true, timeout: 5000 }) : null;
  }

  authorize(userId: number, socketId: string, channel: string) {
    if (channel !== 'private-user-' + userId) throw new ForbiddenException('This notification channel is not yours');
    if (!this.client) throw new ServiceUnavailableException('Notifications are not configured');
    return this.client.authorizeChannel(socketId, channel);
  }

  list(userId: number) {
    return this.repo.find({ where: { user: { id: userId } }, order: { createdAt: 'DESC', id: 'DESC' }, take: 50 });
  }

  async markRead(userId: number, id: number) {
    await this.repo.update({ id, user: { id: userId } }, { read: true });
    return { success: true };
  }

  async deliver(userId: number, notice: UserNotification) {
    try {
      if (this.client) await this.client.trigger('private-user-' + userId, 'notification', {
        id: notice.id, bookingId: notice.bookingId, title: notice.title,
        message: notice.message, read: notice.read, createdAt: notice.createdAt,
      });
    } catch { this.logger.warn('Realtime delivery failed; notification is saved in history'); }
  }

  async publish(userId: number, bookingId: number, title: string, message: string) {
    // Notification outages must not turn an already-saved booking/payment into a failed request.
    try {
      const saved = await this.repo.save(this.repo.create({
        user: { id: userId }, bookingId, title, message,
      }));
      const event = { id: saved.id, bookingId, title, message, read: saved.read, createdAt: saved.createdAt };
      await this.deliver(userId, saved);
      return event;
    } catch {
      this.logger.warn('Notification delivery failed; booking/payment remains saved');
    }
  }
}


