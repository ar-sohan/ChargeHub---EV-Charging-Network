import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { AdminEntity } from './admin.entity';
import { Dispute } from './dispute.entity';
import { Resolution } from './resolution.entity';
import { ManagedUser } from './managed-user.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity, Dispute, Resolution, ManagedUser]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
        },
        defaults: { from: '"Admin Portal" <no-reply@admin.com>' },
      }),
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtAuthGuard],
})
export class AdminModule {}