import { BadRequestException } from '@nestjs/common';
import { StationService, StationFilter } from './station.service';
import { NotificationService } from './notification.service';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { DataSource, Repository, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from './user.entity';
import { BookingEntity } from './booking.entity';
import { PaymentEntity } from './payment.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';




import { MailService } from './mail.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,

    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,

    private readonly dataSource: DataSource,

    private readonly jwtService: JwtService,

    private readonly mailService: MailService,
    private readonly notifications: NotificationService,
    private readonly stations: StationService,
  ) {}

  private removePassword(user: UserEntity) {
    const result: Partial<UserEntity> = { ...user };
    delete result.password;
    return result;
  }

  private async findUser(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // =========================
  // USER
  // =========================

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const existingPhone = await this.userRepository.findOne({
      where: {
        phone: createUserDto.phone,
      },
    });

    if (existingPhone) {
      throw new ConflictException('Phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      status: 'active',
    });

    await this.userRepository.save(user);

    await this.mailService.sendWelcomeEmail(user.email, user.fullName);

    return {
      message: 'User registered successfully',
      user: this.removePassword(user),
    };
  }

  async login(body: LoginUserDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', {
        email: body.email,
      })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const matched = await bcrypt.compare(body.password, user.password);

    if (!matched) {
      throw new UnauthorizedException('Invalid password');
    }

    if (user.status !== 'active') throw new UnauthorizedException('Account is inactive');

    const access_token = this.jwtService.sign({
      role: 'user',
      sub: user.id,
      email: user.email,
    });

    return {
      message: 'Login successful',
      access_token,
      user: this.removePassword(user),
    };
  }

  async search(name: string) {
    let users: UserEntity[];

    if (!name) {
      users = await this.userRepository.find();
    } else {
      users = await this.userRepository.find({
        where: {
          fullName: ILike(`%${name}%`),
        },
      });
    }

    return users.map((user) => this.removePassword(user));
  }

  async getAllUsers() {
    const users = await this.userRepository.find();

    return users.map((user) => this.removePassword(user));
  }

  async getUser(id: number) {
    const user = await this.findUser(id);

    return this.removePassword(user);
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findUser(id);

    try {
      await this.userRepository.update(id, dto);
    } catch (error) {
      if (
        error && typeof error === 'object' &&
        'driverError' in error &&
        (error.driverError as { code?: string }).code === '23505'
      ) {
        throw new ConflictException('Email or phone number already exists');
      }
      throw error;
    }

    return this.getUser(id);
  }

  async updateStatus(id: number, body: UpdateUserStatusDto) {
    await this.findUser(id);

    await this.userRepository.update(id, {
      status: body.status,
    });

    return this.getUser(id);
  }

  async updatePassword(id: number, body: UpdatePasswordDto) {
    const user = await this.userRepository.createQueryBuilder('user')
      .addSelect('user.password').where('user.id = :id', { id }).getOne();
    if (!user || !(await bcrypt.compare(body.currentPassword, user.password))) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    await this.findUser(id);

    const hashedPassword = await bcrypt.hash(body.password, 10);

    await this.userRepository.update(id, {
      password: hashedPassword,
    });

    return {
      message: 'Password updated successfully',
    };
  }

  async remove(id: number) {
    const user = await this.findUser(id);

    await this.userRepository.delete(id);

    return {
      message: 'User deleted successfully',
      user: this.removePassword(user),
    };
  }
  // =========================
  // BOOKING
  // =========================

  async availableSlots(filter: StationFilter = {}) {
    const active = await this.bookingRepository.find({
      where: [{ status: 'pending_payment' }, { status: 'confirmed' }],
      select: { slotNumber: true },
    });
    const occupied = new Set(active.map((booking) => booking.slotNumber.trim().toUpperCase()));
    return this.stations.slots(occupied, filter);
  }

  async createBooking(dto: CreateBookingDto, userId: number) {
    const user = await this.findUser(userId);
    const slotNumber = dto.slotNumber.trim().toUpperCase();
    if (!(await this.stations.isBookable(slotNumber))) {
      throw new BadRequestException('This charging slot is unavailable or does not exist');
    }
    const created = await this.dataSource.transaction(async (manager) => {
      // Serialize reservations for this slot, including concurrent requests.
      await manager.query('SELECT pg_advisory_xact_lock(hashtext($1))', [slotNumber]);
      const existing = await manager.createQueryBuilder(BookingEntity, 'booking')
        .where('UPPER(TRIM(booking.slotNumber)) = :slotNumber', { slotNumber })
        .andWhere('booking.status IN (:...statuses)', {
          statuses: ['pending_payment', 'confirmed'],
        }).getOne();
      if (existing) {
        throw new ConflictException('This slot already has an active booking');
      }
      const booking = manager.create(BookingEntity, {
        slotNumber, status: 'pending_payment', user,
      });
      const saved = await manager.save(booking);
      return {
        id: saved.id, slotNumber: saved.slotNumber,
        status: saved.status, bookingTime: saved.bookingTime,
      };
    });
    await this.notifications.publish(userId, created.id, 'Booking created',
      'Your booking for slot ' + created.slotNumber + ' is awaiting payment.');
    return created;
  }
  async findAllBookings(userId: number) {
    return this.bookingRepository.find({
      where: { user: { id: userId } },
      order: { bookingTime: 'DESC', id: 'DESC' },
    });
  }

  async findOneBooking(id: number, userId: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async updateBooking(id: number, dto: UpdateBookingDto, userId: number) {
    await this.findOneBooking(id, userId);
    const result = await this.bookingRepository.update(
      { id, user: { id: userId }, status: 'pending_payment' },
      { status: dto.status },
    );
    if (!result.affected) {
      throw new ConflictException('Only pending payment bookings can be cancelled');
    }
    const booking = await this.findOneBooking(id, userId);
    await this.notifications.publish(userId, id, 'Booking cancelled',
      'Your booking for slot ' + booking.slotNumber + ' was cancelled.');
    return booking;
  }
  // =========================
  // PAYMENT
  // =========================

  private readonly demoAmount = 100;

  async paymentQuote(bookingId: number, userId: number) {
    const booking = await this.findOneBooking(bookingId, userId);
    return { booking, amount: this.demoAmount, currency: 'BDT', demo: true };
  }

  async demoPayment(bookingId: number, userId: number) {
    const result = await this.dataSource.transaction(async (manager) => {
      // Lock the booking so payment and cancellation cannot both succeed.
      const booking = await manager.findOne(BookingEntity, {
        where: { id: bookingId, user: { id: userId } },
        lock: { mode: 'pessimistic_write', tables: ['bookings'] },
      });
      if (!booking) throw new NotFoundException('Booking not found');
      const existing = await manager.findOne(PaymentEntity, {
        where: { booking: { id: bookingId } },
      });
      if (existing?.status === 'paid' && existing.paymentMethod === 'demo' && booking.status === 'confirmed') {
        return { payment: existing, booking, repeated: true };
      }
      if (booking.status !== 'pending_payment') {
        throw new ConflictException('Only pending payment bookings can be paid');
      }
      if (existing && existing.status !== 'pending') {
        throw new ConflictException('This booking already has a payment');
      }
      const payment = existing ?? manager.create(PaymentEntity, { booking });
      payment.amount = this.demoAmount;
      payment.paymentMethod = 'demo';
      payment.status = 'paid';
      payment.transactionId = 'DEMO-' + booking.id;
      payment.paidAt = new Date();
      await manager.save(payment);
      booking.status = 'confirmed';
      await manager.save(booking);
      return { payment, booking, repeated: false };
    });
    if (!result.repeated) {
      await this.notifications.publish(userId, bookingId, 'Booking confirmed',
        'Payment processed. Your booking for slot ' + result.booking.slotNumber + ' is confirmed.');
    }
    let emailStatus = result.repeated ? 'already_processed' : 'sent';
    if (!result.repeated) {
      try {
        const user = await this.findUser(userId);
        await this.mailService.sendBookingConfirmationEmail(
          user.email, user.fullName, result.booking.id,
          result.booking.slotNumber, this.demoAmount, true,
        );
      } catch (error) {
        emailStatus = 'failed';
        this.logger.error('Demo booking confirmed, but confirmation email failed',
          error instanceof Error ? error.stack : undefined);
      }
    }
    return { ...result.payment, booking: result.booking, demo: true, currency: 'BDT', emailStatus };
  }

  async findAllPayments(userId: number) {
    return this.paymentRepository.find({
      where: { booking: { user: { id: userId } } },
      relations: { booking: true },
      order: { paymentDate: 'DESC', id: 'DESC' },
    });
  }

  async findOnePayment(id: number, userId: number) {
    const payment = await this.paymentRepository.findOne({
      where: { id, booking: { user: { id: userId } } },
      relations: { booking: true },
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }
}







