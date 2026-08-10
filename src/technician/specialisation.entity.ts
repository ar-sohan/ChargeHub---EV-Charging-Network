import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Technician } from './technician.entity';

@Entity('specialisations')
export class Specialisation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @ManyToMany(() => Technician, (technician) => technician.specialisations)
  technicians: Technician[];
}
