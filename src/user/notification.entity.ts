import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_notifications')
export class UserNotification {
  @PrimaryGeneratedColumn() id!: number;
  @Column() title!: string;
  @Column() message!: string;
  @Column() bookingId!: number;
  @Column({ default: false }) read!: boolean;
  @CreateDateColumn() createdAt!: Date;
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' }) user!: UserEntity;
}
