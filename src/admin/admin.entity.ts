import { Entity, PrimaryColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import { Dispute } from './dispute.entity';
import { ManagedUser } from './managed-user.entity';

@Entity('admin')
export class AdminEntity {
  @PrimaryColumn()
  id: number;

  // Category 2: custom id generation before insert
  @BeforeInsert()
  generateId() {
    this.id = Math.floor(Math.random() * 1_000_000_000);
  }

  @Column({ nullable: true })
  fullName: string | undefined;

  @Column({ unique: true })
  email: string | undefined;

  @Column()
  password: string | undefined; // stored as a bcrypt hash

  @Column()
  gender: string | undefined;

  @Column({ type: 'bigint', nullable: true })
  phone: string | undefined;

  @Column({ default: true })
  isActive: boolean | undefined;

  @OneToMany(() => Dispute, (dispute) => dispute.admin) // One-to-Many
  disputes: Dispute[];

  @OneToMany(() => ManagedUser, (user) => user.admin) // One-to-Many: users this admin manages
  managedUsers: ManagedUser[] | undefined;
}
