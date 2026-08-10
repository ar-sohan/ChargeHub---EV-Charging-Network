import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FaultReport } from './fault-report.entity';
import { MaintenanceTask } from './maintenance-task.entity';
import { SafetyCheck } from './safety-check.entity';
import { Specialisation } from './specialisation.entity';

@Entity('technician_profiles')
export class Technician {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  @Generated('uuid')
  uniqueId: string;

  @Column({ length: 150 })
  fullName: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 100 })
  location: string;

  @Column({ length: 30, default: 'Unknown' })
  country: string;

  @Column({ type: 'int' })
  experience: number;

  @Column({ length: 100 })
  primarySpecialisation: string;

  @Column({ length: 200, nullable: true })
  certification?: string;

  @Column({ length: 300, nullable: true })
  socialMediaLink?: string;

  @Column({ length: 300, nullable: true })
  profilePhoto?: string;

  @Column({ length: 20, default: 'Pending' })
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';

  @CreateDateColumn()
  joiningDate: Date;

  @OneToMany(() => MaintenanceTask, (task) => task.technician)
  maintenanceTasks: MaintenanceTask[];

  @OneToMany(() => SafetyCheck, (check) => check.technician)
  safetyChecks: SafetyCheck[];

  @OneToMany(() => FaultReport, (fault) => fault.technician)
  faultReports: FaultReport[];

  @ManyToMany(() => Specialisation, (specialisation) => specialisation.technicians, {
    cascade: ['insert'],
  })
  @JoinTable({ name: 'technician_profile_specialisations' })
  specialisations: Specialisation[];
}
