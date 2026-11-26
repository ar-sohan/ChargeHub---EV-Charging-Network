import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { BookingEntity } from './booking.entity';

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  amount!: number;

  @Column({
    default: 'pending',
  })
  status!: string;

  @Column({ nullable: true })
  transactionId?: string;

  @Column({ nullable: true })
  paymentMethod?: string;

  @CreateDateColumn()
  paymentDate!: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;

  @OneToOne(() => BookingEntity, (booking) => booking.payment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  booking!: BookingEntity;
}
