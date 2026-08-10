import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Technician } from './technician.entity';

@Entity('maintenance_tasks')
export class MaintenanceTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  category: 'Charging' | 'Hardware';

  @Column({ length: 100 })
  stationId: string;

  @Column({ length: 100, nullable: true })
  deviceId?: string;

  @Column({ length: 100, nullable: true })
  deviceType?: string;

  @Column({ type: 'text' })
  issue: string;

  @Column({ type: 'text', nullable: true })
  action?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'date' })
  maintenanceDate: string;

  @Column({ length: 30, default: 'In Progress' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Technician, (technician) => technician.maintenanceTasks, {
    onDelete: 'CASCADE',
  })
  technician: Technician;
}
