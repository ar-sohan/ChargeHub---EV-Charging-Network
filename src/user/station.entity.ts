import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
@Entity('stations')
export class StationEntity {
  @PrimaryColumn() id!: string;
  @Column() name!: string;
  @Column() area!: string;
  @Column() block!: string;
  @Column() road!: string;
  @Column() house!: string;
  @Column({ default: true }) active!: boolean;
}
@Entity('charging_slots')
export class ChargingSlotEntity {
  @PrimaryColumn() slotNumber!: string;
  @Column() stationId!: string;
  @ManyToOne(() => StationEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'stationId' }) station!: StationEntity;
  @Column({ default: true }) active!: boolean;
}
@Entity('station_seed_runs')
export class StationSeedRun {
  @PrimaryColumn() id!: string;
}
