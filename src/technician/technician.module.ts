import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaultReport } from './fault-report.entity';
import { MaintenanceTask } from './maintenance-task.entity';
import { SafetyCheck } from './safety-check.entity';
import { Specialisation } from './specialisation.entity';
import { TechnicianController } from './technician.controller';
import { Technician } from './technician.entity';
import { TechnicianService } from './technician.service';

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
  providers: [TechnicianService],
})
export class TechnicianModule {}
