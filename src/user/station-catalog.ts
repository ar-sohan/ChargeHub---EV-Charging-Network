type Station = {
  id: string; name: string; area: string; block: string; road: string;
  house: string; firstSlot: number; lastSlot: number;
};

// Preserve the original three stations' slot ranges for existing bookings.
const original = [
  { block: 'A', road: '1', position: 1, house: '10' },
  { block: 'B', road: '2', position: 1, house: '20' },
  { block: 'C', road: '3', position: 1, house: '30' },
];
const locations = [...original];
for (const block of ['A', 'B', 'C']) {
  for (let road = 1; road <= 5; road++) {
    for (let position = 1; position <= 5; position++) {
      if (original.some(item => item.block === block && item.road === String(road) && item.position === position)) continue;
      locations.push({ block, road: String(road), position, house: String(road * 10 + position - 1) });
    }
  }
}

export const STATIONS: Station[] = locations.map((location, index) => ({
  id: location.block.toLowerCase() + '-r' + location.road + '-s' + location.position,
  name: 'Station ' + location.block + '-' + location.road + '-' + location.position,
  area: 'Bashundhara Residential Area',
  block: location.block, road: location.road, house: String(100 + location.position),
  firstSlot: index * 10 + 1, lastSlot: (index + 1) * 10,
})).sort((a, b) => a.block.localeCompare(b.block) || Number(a.road) - Number(b.road) || a.name.localeCompare(b.name));

export type StationFilter = { block?: string; road?: string; stationId?: string };

export function matchingStations(filter: StationFilter = {}) {
  return STATIONS.filter(station =>
    (!filter.block || station.block === filter.block) &&
    (!filter.road || station.road === filter.road) &&
    (!filter.stationId || station.id === filter.stationId));
}

export function locationSlots(occupied: Set<string>, filter: StationFilter = {}) {
  return matchingStations(filter).flatMap(station =>
    Array.from({ length: station.lastSlot - station.firstSlot + 1 }, (_, index) => {
      const slotNumber = 'A-' + (station.firstSlot + index);
      return { slotNumber, available: !occupied.has(slotNumber), station };
    }));
}

