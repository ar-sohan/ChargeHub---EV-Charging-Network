import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';

import { TechnicianModule } from './technician/technician.module';

import { AuthModule } from './auth/auth.module';

import { BookingModule } from './booking/booking.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',

      host: 'localhost',

      port: 5432,

      username: 'postgres',

      password: 'rahat15496',

      database: 'chargehubEV',

      autoLoadEntities: true,

      synchronize: true,
    }),

    UserModule,

    TechnicianModule,

    AuthModule,

    BookingModule,

    PaymentModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
