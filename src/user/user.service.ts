import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository, ILike } from 'typeorm';
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

import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

import { MailService } from './mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,

    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,

    private readonly jwtService: JwtService,

    private readonly mailService: MailService,
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

    const access_token = this.jwtService.sign({
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

    await this.userRepository.update(id, dto);

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

  async createBooking(dto: CreateBookingDto) {
    const user = await this.findUser(dto.userId);
    const booking = this.bookingRepository.create({
      slotNumber: dto.slotNumber,
      status: dto.status,
      user,
    });

    return await this.bookingRepository.save(booking);
  }

  async findAllBookings() {
    return await this.bookingRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async findOneBooking(id: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async updateBooking(id: number, dto: UpdateBookingDto) {
    await this.findOneBooking(id);

    await this.bookingRepository.update(id, dto);

    return this.findOneBooking(id);
  }

  async removeBooking(id: number) {
    await this.findOneBooking(id);

    return await this.bookingRepository.delete(id);
  }

  // =========================
  // PAYMENT
  // =========================

  async createPayment(dto: CreatePaymentDto) {
    const booking = await this.bookingRepository.findOne({
      where: {
        id: dto.bookingId,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const existingPayment = await this.paymentRepository.findOne({
      where: { booking: { id: booking.id } },
    });

    if (existingPayment) {
      throw new ConflictException('A payment already exists for this booking');
    }

    const payment = this.paymentRepository.create({
      amount: dto.amount,
      booking,
    });

    return await this.paymentRepository.save(payment);
  }

  async findAllPayments() {
    return await this.paymentRepository.find({
      relations: {
        booking: true,
      },
    });
  }

  async findOnePayment(id: number) {
    const payment = await this.paymentRepository.findOne({
      where: {
        id,
      },
      relations: {
        booking: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async updatePayment(id: number, dto: UpdatePaymentDto) {
    await this.findOnePayment(id);

    await this.paymentRepository.update(id, dto);

    return this.findOnePayment(id);
  }

  async removePayment(id: number) {
    await this.findOnePayment(id);

    return await this.paymentRepository.delete(id);
  }
}
