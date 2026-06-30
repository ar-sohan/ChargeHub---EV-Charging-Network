import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChargingMaintenanceDto } from './dto/create-charging-maintenance.dto';
import { CreateHardwareMaintenanceDto } from './dto/create-hardware-maintenance.dto';
import { CreateSafetyCheckDto } from './dto/create-safety-check.dto';
import {
  CreateFaultReportDto,
  UpdateFaultStatusDto,
} from './dto/create-fault-report.dto';

// ─── In-Memory Storage ───────────────────────────────────────────────────────
export interface ChargingMaintenanceRecord extends CreateChargingMaintenanceDto {
  id: number;
  status: string;
  createdAt: string;
}

export interface HardwareMaintenanceRecord extends CreateHardwareMaintenanceDto {
  id: number;
  status: string;
  createdAt: string;
}

export interface SystemMonitoringLog {
  id: number;
  checkedAt: string;
  stationsChecked: number;
}

export interface SystemMonitoringData {
  stationId: string;
  powerStatus: string;
  chargingLoad: string;
  temperature: string;
  networkStatus: string;
  lastChecked: string;
}

export interface SafetyCheckRecord extends CreateSafetyCheckDto {
  id: number;
  checkedAt: string;
}

export interface FaultReportRecord extends CreateFaultReportDto {
  id: number;
  status: string;
  reportedAt: string;
  resolvedAt: string | null;
  resolutionNote?: string;
}

const chargingMaintenanceRecords: ChargingMaintenanceRecord[] = [];
const hardwareMaintenanceRecords: HardwareMaintenanceRecord[] = [];
const systemMonitoringLogs: SystemMonitoringLog[] = [];
const safetyCheckRecords: SafetyCheckRecord[] = [];
const faultReports: FaultReportRecord[] = [];
let idCounter = 1;

@Injectable()
export class TechnicianService {
  // ── 1. Log Charging System Maintenance ─────────────────────────────────────
  logChargingMaintenance(dto: CreateChargingMaintenanceDto) {
    const record = {
      id: idCounter++,
      ...dto,
      status: 'In Progress',
      createdAt: new Date().toISOString(),
    };
    chargingMaintenanceRecords.push(record);
    return {
      message: 'Charging maintenance logged successfully',
      data: record,
    };
  }

  // ── 2. Get All Charging Maintenance Records ─────────────────────────────────
  getAllChargingMaintenance(stationId?: string) {
    if (stationId) {
      const filtered = chargingMaintenanceRecords.filter(
        (r) => r.stationId === stationId,
      );
      return { total: filtered.length, data: filtered };
    }
    return {
      total: chargingMaintenanceRecords.length,
      data: chargingMaintenanceRecords,
    };
  }

  // ── 3. Log Hardware Maintenance ─────────────────────────────────────────────
  logHardwareMaintenance(dto: CreateHardwareMaintenanceDto) {
    const record = {
      id: idCounter++,
      ...dto,
      status: 'Scheduled',
      createdAt: new Date().toISOString(),
    };
    hardwareMaintenanceRecords.push(record);
    return {
      message: 'Hardware maintenance logged successfully',
      data: record,
    };
  }

  // ── 4. Get System Monitoring Status ────────────────────────────────────────
  getSystemMonitoring(stationId?: string) {
    // Simulated live monitoring data
    const stations = ['ST-001', 'ST-002', 'ST-003', 'ST-004'];
    const targetStations = stationId ? [stationId] : stations;

    const monitoringData = targetStations.map((id) => ({
      stationId: id,
      powerStatus: 'ON',
      chargingLoad: `${Math.floor(Math.random() * 100)}%`,
      temperature: `${(20 + Math.random() * 15).toFixed(1)}°C`,
      networkStatus: 'Connected',
      lastChecked: new Date().toISOString(),
    }));

    const log = {
      id: idCounter++,
      checkedAt: new Date().toISOString(),
      stationsChecked: monitoringData.length,
    };
    systemMonitoringLogs.push(log);

    return { message: 'System monitoring data fetched', data: monitoringData };
  }

  // ── 5. Create Safety Check ──────────────────────────────────────────────────
  createSafetyCheck(dto: CreateSafetyCheckDto) {
    const record = {
      id: idCounter++,
      ...dto,
      checkedAt: new Date().toISOString(),
    };
    safetyCheckRecords.push(record);
    return { message: 'Safety check recorded successfully', data: record };
  }

  // ── 6. Get Safety Check by ID ───────────────────────────────────────────────
  getSafetyCheckById(id: number) {
    const record = safetyCheckRecords.find((r) => r.id === id);
    if (!record) {
      throw new NotFoundException(`Safety check with ID ${id} not found`);
    }
    return { data: record };
  }

  // ── 7. Report a Fault ───────────────────────────────────────────────────────
  reportFault(dto: CreateFaultReportDto) {
    const record = {
      id: idCounter++,
      ...dto,
      status: 'Open',
      reportedAt: new Date().toISOString(),
      resolvedAt: null,
    };
    faultReports.push(record);
    return { message: 'Fault reported successfully', data: record };
  }

  // ── 8. Update Fault Status ──────────────────────────────────────────────────
  updateFaultStatus(id: number, dto: UpdateFaultStatusDto) {
    const index = faultReports.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new NotFoundException(`Fault report with ID ${id} not found`);
    }
    faultReports[index] = {
      ...faultReports[index],
      status: dto.status,
      resolutionNote: dto.resolutionNote,
      resolvedAt: dto.status === 'Resolved' ? new Date().toISOString() : null,
    };
    return {
      message: 'Fault status updated successfully',
      data: faultReports[index],
    };
  }
}
