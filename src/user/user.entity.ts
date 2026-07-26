import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    length: 100,
  })
  fullName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'int',
    unsigned: true,
  })
  age: number;

  @Column({
    default: 'male',
  })
  gender: string;

  @Column({
    default: 'active',
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
