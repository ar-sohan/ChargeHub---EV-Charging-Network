import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AdminEntity } from './admin.entity';
import { Resolution } from './resolution.entity';
@Entity('disputes')
export class Dispute {
  @PrimaryGeneratedColumn() id: number;
  @Column() subject: string;
  @Column({ default: 'OPEN' }) status: string;
  @CreateDateColumn() createdAt: Date;
  @ManyToOne(() => AdminEntity, (admin) => admin.disputes, { onDelete: 'CASCADE' }) admin: AdminEntity;
  @OneToOne(() => Resolution, (resolution) => resolution.dispute, { cascade: true, nullable: true }) @JoinColumn() resolution: Resolution | null;
}
