import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Technician } from './technician.entity';

@Entity('safety_checks')
export class SafetyCheck {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  stationId: string;

  @Column({ length: 100 })
  checkType: string;

  @Column({ length: 100 })
  result: string;

  @Column({ type: 'text' })
  remarks: string;

  @Column({ type: 'date' })
  reportDate: string;

  @CreateDateColumn()
  checkedAt: Date;

  @ManyToOne(() => Technician, (technician) => technician.safetyChecks, {
    onDelete: 'CASCADE',
  })
  technician: Technician;
}
