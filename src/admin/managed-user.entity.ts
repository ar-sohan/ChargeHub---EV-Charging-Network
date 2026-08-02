import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AdminEntity } from './admin.entity';
@Entity('managed_users')
export class ManagedUser {
  @PrimaryGeneratedColumn() id: number;
  @Column() name: string;
  @Column({ unique: true }) email: string;
  @Column() role: string;
  @Column({ default: 'active' }) status: string;
  @ManyToOne(() => AdminEntity, (admin) => admin.managedUsers, { onDelete: 'CASCADE' }) admin: AdminEntity;
}
