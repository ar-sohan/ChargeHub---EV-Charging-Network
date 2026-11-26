import { StationService } from './station.service';
import { StationEntity, ChargingSlotEntity, StationSeedRun } from './station.entity';
import { ChargingService } from './charging.service';
import { UserNotification } from './notification.entity';
import { NotificationService } from './notification.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MailService } from './mail.service';

import { UserEntity } from './user.entity';
import { BookingEntity } from './booking.entity';
import { PaymentEntity } from './payment.entity';

import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule,

    TypeOrmModule.forFeature([StationEntity, ChargingSlotEntity, StationSeedRun, UserEntity, BookingEntity, PaymentEntity, UserNotification]),

  ],

  controllers: [UserController],

  providers: [StationService, ChargingService, NotificationService, UserService, MailService, JwtAuthGuard],

  exports: [MailService],
})
export class UserModule {}



