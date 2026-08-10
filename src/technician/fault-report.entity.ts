import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Technician } from './technician.entity';

@Entity('fault_reports')
export class FaultReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  stationId: string;

  @Column({ length: 100 })
  faultType: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 30 })
  severity: string;

  @Column({ type: 'date' })
  reportDate: string;

  @Column({ length: 30, default: 'Open' })
  status: string;

  @Column({ type: 'text', nullable: true })
  resolutionNote?: string;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt?: Date;

  @CreateDateColumn()
  reportedAt: Date;

  @ManyToOne(() => Technician, (technician) => technician.faultReports, {
    onDelete: 'CASCADE',
  })
  technician: Technician;
}
