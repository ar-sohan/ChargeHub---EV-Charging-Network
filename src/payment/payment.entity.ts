import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { BookingEntity } from '../booking/booking.entity';

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  amount: number;

  @Column({
    default: 'pending',
  })
  status: string;

  @CreateDateColumn()
  paymentDate: Date;

  @OneToOne(() => BookingEntity, (booking) => booking.payment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  booking: BookingEntity;
}
