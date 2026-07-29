import { Controller, Post, Get, Body, Param, Delete } from '@nestjs/common';

import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingEntity } from './booking.entity';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async create(@Body() dto: CreateBookingDto): Promise<BookingEntity> {
    return await this.bookingService.create(dto);
  }

  @Get()
  async findAll(): Promise<BookingEntity[]> {
    return await this.bookingService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BookingEntity | null> {
    return await this.bookingService.findOne(Number(id));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.bookingService.remove(Number(id));
  }
}
