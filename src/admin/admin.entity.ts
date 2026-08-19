import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { Dispute } from './dispute.entity';
import { ManagedUser } from './managed-user.entity';

@Entity('admin')
export class AdminEntity {
  @PrimaryColumn()
  id: number;

  @BeforeInsert()
  generateId() {
    this.id = Math.floor(Math.random() * 1_000_000_000);
  }

  @Column({ nullable: true })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // stored as a bcrypt hash

  @Column()
  gender: string;

  @Column({ type: 'bigint', nullable: true })
  phone: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Dispute, (dispute) => dispute.admin)
  disputes: Dispute[];

  @OneToMany(() => ManagedUser, (user) => user.admin)
  managedUsers: ManagedUser[];
}
