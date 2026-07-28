import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AdminEntity } from './admin.entity';

// A platform user that the admin oversees (host / driver / technician).
@Entity('managed_user')
export class ManagedUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  role: string; // 'host' | 'driver' | 'technician'

  @Column({ default: 'active' })
  status: string; // 'active' | 'suspended'

  @Column({ default: false })
  isApproved: boolean;

  @ManyToOne(() => AdminEntity, (admin) => admin.managedUsers) // many users -> one admin
  admin: AdminEntity;
}