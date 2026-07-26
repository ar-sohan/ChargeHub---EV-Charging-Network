"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnicianService = void 0;
const common_1 = require("@nestjs/common");
const chargingMaintenanceRecords = [];
const hardwareMaintenanceRecords = [];
const systemMonitoringLogs = [];
const safetyCheckRecords = [];
const faultReports = [];
let idCounter = 1;
let TechnicianService = class TechnicianService {
    // ── 1. Log Charging System Maintenance ─────────────────────────────────────
    logChargingMaintenance(dto) {
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
    getAllChargingMaintenance(stationId) {
        if (stationId) {
            const filtered = chargingMaintenanceRecords.filter((r) => r.stationId === stationId);
            return { total: filtered.length, data: filtered };
        }
        return {
            total: chargingMaintenanceRecords.length,
            data: chargingMaintenanceRecords,
        };
    }
    // ── 3. Log Hardware Maintenance ─────────────────────────────────────────────
    logHardwareMaintenance(dto) {
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
    getSystemMonitoring(stationId) {
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
    createSafetyCheck(dto) {
        const record = {
            id: idCounter++,
            ...dto,
            checkedAt: new Date().toISOString(),
        };
        safetyCheckRecords.push(record);
        return { message: 'Safety check recorded successfully', data: record };
    }
    // ── 6. Get Safety Check by ID ───────────────────────────────────────────────
    getSafetyCheckById(id) {
        const record = safetyCheckRecords.find((r) => r.id === id);
        if (!record) {
            throw new common_1.NotFoundException(`Safety check with ID ${id} not found`);
        }
        return { data: record };
    }
    // ── 7. Report a Fault ───────────────────────────────────────────────────────
    reportFault(dto) {
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
    updateFaultStatus(id, dto) {
        const index = faultReports.findIndex((r) => r.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Fault report with ID ${id} not found`);
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
};
exports.TechnicianService = TechnicianService;
exports.TechnicianService = TechnicianService = __decorate([
    (0, common_1.Injectable)()
], TechnicianService);
