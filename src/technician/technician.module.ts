import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaultReport } from './fault-report.entity';
import { MaintenanceTask } from './maintenance-task.entity';
import { SafetyCheck } from './safety-check.entity';
import { Specialisation } from './specialisation.entity';
import { TechnicianController } from './technician.controller';
import { Technician } from './technician.entity';
import { TechnicianService } from './technician.service';
import { TechnicianAuthGuard } from './guards/technician-auth.guard';
import { JwtAuthGuard as AdminAuthGuard } from '../admin/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Technician,
      MaintenanceTask,
      SafetyCheck,
      FaultReport,
      Specialisation,
    ]),
  ],
  controllers: [TechnicianController],
  providers: [TechnicianService, TechnicianAuthGuard, AdminAuthGuard],
})
export class TechnicianModule {}
