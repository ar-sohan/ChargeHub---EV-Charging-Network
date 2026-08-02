import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Dispute } from './dispute.entity';
@Entity('resolutions')
export class Resolution {
  @PrimaryGeneratedColumn() id: number;
  @Column() decision: string;
  @Column({ nullable: true }) note?: string;
  @OneToOne(() => Dispute, (dispute) => dispute.resolution) dispute: Dispute;
}
