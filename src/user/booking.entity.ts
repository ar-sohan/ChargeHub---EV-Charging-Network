import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
} from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { PaymentEntity } from './payment.entity';

@Entity('bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  slotNumber!: string;

  @Column({
    default: 'booked',
  })
  status!: string;

  @CreateDateColumn()
  bookingTime!: Date;

  // Many Bookings -> One User
  @ManyToOne(() => UserEntity, (user) => user.bookings, {
    onDelete: 'CASCADE',
  })
  user!: UserEntity;

  // One Booking -> One Payment
  @OneToOne(() => PaymentEntity, (payment) => payment.booking)
  payment!: PaymentEntity;
}
