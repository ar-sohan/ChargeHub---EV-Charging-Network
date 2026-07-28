import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { AdminEntity } from './admin.entity';
import { Resolution } from './resolution.entity';

@Entity('dispute')
export class Dispute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subject: string;

  @Column({ default: 'OPEN' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => AdminEntity, (admin) => admin.disputes) // Many disputes -> one admin
  admin: AdminEntity;

  @OneToOne(() => Resolution, (resolution) => resolution.dispute, { cascade: true, nullable: true })
  @JoinColumn() // One-to-One (owns the FK)
  resolution: Resolution;
}
