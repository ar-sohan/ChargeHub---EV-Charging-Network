import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Dispute } from './dispute.entity';
import { ManagedUser } from './managed-user.entity';
@Entity('admins')
export class AdminEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ length: 100 }) fullName: string;
  @Column({ unique: true }) email: string;
  @Column({ select: false }) password: string;
  @Column({ default: true }) isActive: boolean;
  @OneToMany(() => ManagedUser, (user) => user.admin) managedUsers: ManagedUser[];
  @OneToMany(() => Dispute, (dispute) => dispute.admin) disputes: Dispute[];
}
