import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaymentEntity } from './payment.entity';
import { BookingEntity } from '../booking/booking.entity';

import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,

    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
  ) {}

  async create(dto: CreatePaymentDto): Promise<PaymentEntity> {
    const booking = await this.bookingRepository.findOne({
      where: { id: dto.bookingId },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    const payment = this.paymentRepository.create({
      amount: dto.amount,
      booking,
    });

    return await this.paymentRepository.save(payment);
  }

  async findAll(): Promise<PaymentEntity[]> {
    return await this.paymentRepository.find({
      relations: {
        booking: true,
      },
    });
  }

  async findOne(id: number): Promise<PaymentEntity | null> {
    return await this.paymentRepository.findOne({
      where: { id },
      relations: {
        booking: true,
      },
    });
  }

  async update(
    id: number,
    dto: UpdatePaymentDto,
  ): Promise<PaymentEntity | null> {
    await this.paymentRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.paymentRepository.delete(id);
  }
}
