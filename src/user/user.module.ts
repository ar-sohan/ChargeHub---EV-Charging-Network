import { StationService } from './station.service';
import { StationEntity, ChargingSlotEntity, StationSeedRun } from './station.entity';
import { ChargingService } from './charging.service';
import { UserNotification } from './notification.entity';
import { NotificationService } from './notification.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

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

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'chargehub_secret_key',
      signOptions: {
        expiresIn: '1d',
      },
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST') || 'smtp.gmail.com',

          port: Number(configService.get('MAIL_PORT')) || 587,

          secure: false,

          auth: {
            user: configService.get('MAIL_USER'),

            pass: configService.get('MAIL_PASS'),
          },
        },
        defaults: {
          from:
            configService.get('MAIL_FROM') ||
            `ChargeHub EV <${configService.get('MAIL_USER')}>`,
        },
      }),
    }),
  ],

  controllers: [UserController],

  providers: [StationService, ChargingService, NotificationService, UserService, MailService, JwtAuthGuard],

  exports: [MailService],
})
export class UserModule {}



