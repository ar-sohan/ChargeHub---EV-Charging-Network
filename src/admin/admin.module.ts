import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './admin.entity';
import { Dispute } from './dispute.entity';
import { Resolution } from './resolution.entity';
import { ManagedUser } from './managed-user.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

// JwtModule and MailerModule are set up once in AppModule.
@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity, Dispute, Resolution, ManagedUser])],
  controllers: [AdminController],
  providers: [AdminService, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AdminModule {}
