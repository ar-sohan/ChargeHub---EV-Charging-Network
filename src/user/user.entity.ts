import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { BookingEntity } from './booking.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  id!: number;

  @Column({
    length: 100,
  })
  fullName!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column({
    unique: true,
    nullable: true,
    length: 11,
  })
  phone!: string;

  @Column({
    select: false,
  })
  password!: string;

  @Column({
    type: 'int',
    unsigned: true,
  })
  age!: number;

  @Column({
    default: 'male',
  })
  gender!: string;

  @Column({
    default: 'active',
  })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;

  // One User -> Many Bookings
  @OneToMany(() => BookingEntity, (booking) => booking.user)
  bookings!: BookingEntity[];
}
