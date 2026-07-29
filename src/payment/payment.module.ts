import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentEntity } from './payment.entity';
import { BookingEntity } from '../booking/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity, BookingEntity])],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
