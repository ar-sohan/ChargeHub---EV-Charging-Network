import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ChargingSlotEntity, StationEntity, StationSeedRun } from './station.entity';
import { STATIONS } from './station-catalog';
export type StationFilter = { block?: string; road?: string; stationId?: string };
@Injectable()
export class StationService implements OnModuleInit {
  constructor(private db: DataSource) {}
  async onModuleInit() {
    await this.db.transaction(async manager => {
      await manager.query("SELECT pg_advisory_xact_lock(hashtext($1))", ['chargehub-stations-v1']);
      if (await manager.findOneBy(StationSeedRun, { id: 'v1' })) return;
      await manager.createQueryBuilder().insert().into(StationEntity).values(
        STATIONS.map(({ id, name, area, block, road, house }) => ({ id, name, area, block, road, house })),
      ).orIgnore().execute();
      const slots = STATIONS.flatMap(station => Array.from({ length: station.lastSlot - station.firstSlot + 1 },
        (_, index) => ({ slotNumber: 'A-' + (station.firstSlot + index), stationId: station.id })));
      await manager.createQueryBuilder().insert().into(ChargingSlotEntity).values(slots).orIgnore().execute();
      await manager.save(StationSeedRun, { id: 'v1' });
    });
    await this.updateHouseNumbers();
  }
  async updateHouseNumbers() {
    await this.db.transaction(async manager => {
      await manager.query("SELECT pg_advisory_xact_lock(hashtext($1))", ['chargehub-stations-v1']);
      if (await manager.findOneBy(StationSeedRun, { id: 'house-numbers-101-v2' })) return;
      for (const station of STATIONS) {
        await manager.update(StationEntity, { id: station.id }, { house: station.house });
      }
      await manager.save(StationSeedRun, { id: 'house-numbers-101-v2' });
    });
  }

  list() {
    return this.db.getRepository(StationEntity).find({
      where: { active: true }, order: { block: 'ASC', road: 'ASC', name: 'ASC' },
    });
  }
  async slots(occupied: Set<string>, filter: StationFilter = {}) {
    const query = this.db.getRepository(ChargingSlotEntity).createQueryBuilder('slot')
      .innerJoinAndSelect('slot.station', 'station')
      .where('slot.active = :active AND station.active = :active', { active: true });
    if (filter.block) query.andWhere('station.block = :block', { block: filter.block });
    if (filter.road) query.andWhere('station.road = :road', { road: filter.road });
    if (filter.stationId) query.andWhere('station.id = :stationId', { stationId: filter.stationId });
    const slots = await query.getMany();
    return slots.sort((a, b) => a.slotNumber.localeCompare(b.slotNumber, undefined, { numeric: true }))
      .map(slot => ({ slotNumber: slot.slotNumber, available: !occupied.has(slot.slotNumber), station: slot.station }));
  }
  async isBookable(slotNumber: string) {
    return this.db.getRepository(ChargingSlotEntity).exists({
      where: { slotNumber, active: true, station: { active: true } },
    });
  }
}

