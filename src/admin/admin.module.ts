import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminEntity } from './admin.entity';
import { AdminService } from './admin.service';
import { Dispute } from './dispute.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ManagedUser } from './managed-user.entity';
import { Resolution } from './resolution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity, ManagedUser, Dispute, Resolution]), JwtModule.register({ secret: process.env.JWT_SECRET || 'chargehub-secret', signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any } })],
  controllers: [AdminController],
  providers: [AdminService, JwtAuthGuard],
})
export class AdminModule {}
