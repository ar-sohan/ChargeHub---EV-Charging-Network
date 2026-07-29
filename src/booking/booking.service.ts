import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { BookingEntity } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
  ) {}

  async create(dto: CreateBookingDto): Promise<BookingEntity> {
    const booking = this.bookingRepository.create({
      slotNumber: dto.slotNumber,
      status: dto.status,
      user: {
        id: dto.userId,
      } as UserEntity,
    });

    return await this.bookingRepository.save(booking);
  }

  async findAll(): Promise<BookingEntity[]> {
    return await this.bookingRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async findOne(id: number): Promise<BookingEntity | null> {
    return await this.bookingRepository.findOne({
      where: {
        id,
      },

      relations: {
        user: true,
      },
    });
  }

  async update(
    id: number,
    dto: UpdateBookingDto,
  ): Promise<BookingEntity | null> {
    await this.bookingRepository.update(id, dto);

    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.bookingRepository.delete(id);
  }
}
