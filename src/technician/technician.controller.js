"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnicianController = void 0;
const common_1 = require("@nestjs/common");
const technician_service_1 = require("./technician.service");
const create_charging_maintenance_dto_1 = require("./dto/create-charging-maintenance.dto");
const create_hardware_maintenance_dto_1 = require("./dto/create-hardware-maintenance.dto");
const create_safety_check_dto_1 = require("./dto/create-safety-check.dto");
const create_fault_report_dto_1 = require("./dto/create-fault-report.dto");
let TechnicianController = class TechnicianController {
    constructor(technicianService) {
        this.technicianService = technicianService;
    }
    // ── Route 1: POST /technician/charging-maintenance ──────────────────────────
    // Feature: Charging System Maintenance — log a new maintenance task
    // Demonstrates: @Body()
    logChargingMaintenance(dto) {
        return this.technicianService.logChargingMaintenance(dto);
    }
    // ── Route 2: GET /technician/charging-maintenance ───────────────────────────
    // Feature: Charging System Maintenance — view all records, filter by stationId
    // Demonstrates: @Query()
    getAllChargingMaintenance(stationId) {
        return this.technicianService.getAllChargingMaintenance(stationId);
    }
    // ── Route 3: POST /technician/hardware-maintenance ──────────────────────────
    // Feature: Hardware Maintenance — log a hardware maintenance task
    // Demonstrates: @Body()
    logHardwareMaintenance(dto) {
        return this.technicianService.logHardwareMaintenance(dto);
    }
    // ── Route 4: GET /technician/system-monitoring ──────────────────────────────
    // Feature: System Monitoring — get live status of all or one station
    // Demonstrates: @Query()
    getSystemMonitoring(stationId) {
        return this.technicianService.getSystemMonitoring(stationId);
    }
    // ── Route 5: POST /technician/safety-checks ─────────────────────────────────
    // Feature: Safety Checks — record a new safety check
    // Demonstrates: @Body()
    createSafetyCheck(dto) {
        return this.technicianService.createSafetyCheck(dto);
    }
    // ── Route 6: GET /technician/safety-checks/:id ──────────────────────────────
    // Feature: Safety Checks — get a specific safety check by ID
    // Demonstrates: @Param()
    getSafetyCheckById(id) {
        return this.technicianService.getSafetyCheckById(Number(id));
    }
    // ── Route 7: POST /technician/faults ────────────────────────────────────────
    // Feature: Fault Handling — report a new fault
    // Demonstrates: @Body()
    reportFault(dto) {
        return this.technicianService.reportFault(dto);
    }
    // ── Route 8: PATCH /technician/faults/:id ───────────────────────────────────
    // Feature: Fault Handling — update fault status (e.g. mark as Resolved)
    // Demonstrates: @Param() + @Body()
    updateFaultStatus(id, dto) {
        return this.technicianService.updateFaultStatus(Number(id), dto);
    }
};
exports.TechnicianController = TechnicianController;
__decorate([
    (0, common_1.Post)('charging-maintenance'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_charging_maintenance_dto_1.CreateChargingMaintenanceDto]),
    __metadata("design:returntype", void 0)
], TechnicianController.prototype, "logChargingMaintenance", null);
__decorate([
    (0, common_1.Get)('charging-maintenance'),
    __param(0, (0, common_1.Query)('stationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TechnicianController.prototype, "getAllChargingMaintenance", null);
__decorate([
    (0, common_1.Post)('hardware-maintenance'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hardware_maintenance_dto_1.CreateHardwareMaintenanceDto]),
    __metadata("design:returntype", void 0)
], TechnicianController.prototype, "logHardwareMaintenance", null);
__decorate([
    (0, common_1.Get)('system-monitoring'),
    __param(0, (0, common_1.Query)('stationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TechnicianController.prototype, "getSystemMonitoring", null);
__decorate([
    (0, common_1.Post)('safety-checks'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_safety_check_dto_1.CreateSafetyCheckDto]),
    __metadata("design:returntype", void 0)
], TechnicianController.prototype, "createSafetyCheck", null);
__decorate([
    (0, common_1.Get)('safety-checks/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TechnicianController.prototype, "getSafetyCheckById", null);
__decorate([
    (0, common_1.Post)('faults'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_fault_report_dto_1.CreateFaultReportDto]),
    __metadata("design:returntype", void 0)
], TechnicianController.prototype, "reportFault", null);
__decorate([
    (0, common_1.Patch)('faults/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_fault_report_dto_1.UpdateFaultStatusDto]),
    __metadata("design:returntype", void 0)
], TechnicianController.prototype, "updateFaultStatus", null);
exports.TechnicianController = TechnicianController = __decorate([
    (0, common_1.Controller)('technician'),
    __metadata("design:paramtypes", [technician_service_1.TechnicianService])
], TechnicianController);
