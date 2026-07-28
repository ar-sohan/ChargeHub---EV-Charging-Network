import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Dispute } from './dispute.entity';

@Entity('resolution')
export class Resolution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  decision: string;

  @Column({ nullable: true })
  note: string;

  @OneToOne(() => Dispute, (dispute) => dispute.resolution) // inverse side
  dispute: Dispute;
}