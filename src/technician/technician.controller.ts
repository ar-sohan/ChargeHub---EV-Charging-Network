import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { TechnicianService } from './technician.service';
import { CreateChargingMaintenanceDto } from './dto/create-charging-maintenance.dto';
import { CreateHardwareMaintenanceDto } from './dto/create-hardware-maintenance.dto';
import { CreateSafetyCheckDto } from './dto/create-safety-check.dto';
import { CreateFaultReportDto, UpdateFaultStatusDto } from './dto/create-fault-report.dto';

@Controller('technician')
export class TechnicianController {
  constructor(private readonly technicianService: TechnicianService) {}

  // ── Route 1: POST /technician/charging-maintenance ──────────────────────────
  // Feature: Charging System Maintenance — log a new maintenance task
  // Demonstrates: @Body()
  @Post('charging-maintenance')
  logChargingMaintenance(@Body() dto: CreateChargingMaintenanceDto) {
    return this.technicianService.logChargingMaintenance(dto);
  }

  // ── Route 2: GET /technician/charging-maintenance ───────────────────────────
  // Feature: Charging System Maintenance — view all records, filter by stationId
  // Demonstrates: @Query()
  @Get('charging-maintenance')
  getAllChargingMaintenance(@Query('stationId') stationId?: string) {
    return this.technicianService.getAllChargingMaintenance(stationId);
  }

  // ── Route 3: POST /technician/hardware-maintenance ──────────────────────────
  // Feature: Hardware Maintenance — log a hardware maintenance task
  // Demonstrates: @Body()
  @Post('hardware-maintenance')
  logHardwareMaintenance(@Body() dto: CreateHardwareMaintenanceDto) {
    return this.technicianService.logHardwareMaintenance(dto);
  }

  // ── Route 4: GET /technician/system-monitoring ──────────────────────────────
  // Feature: System Monitoring — get live status of all or one station
  // Demonstrates: @Query()
  @Get('system-monitoring')
  getSystemMonitoring(@Query('stationId') stationId?: string) {
    return this.technicianService.getSystemMonitoring(stationId);
  }

  // ── Route 5: POST /technician/safety-checks ─────────────────────────────────
  // Feature: Safety Checks — record a new safety check
  // Demonstrates: @Body()
  @Post('safety-checks')
  createSafetyCheck(@Body() dto: CreateSafetyCheckDto) {
    return this.technicianService.createSafetyCheck(dto);
  }

  // ── Route 6: GET /technician/safety-checks/:id ──────────────────────────────
  // Feature: Safety Checks — get a specific safety check by ID
  // Demonstrates: @Param()
  @Get('safety-checks/:id')
  getSafetyCheckById(@Param('id') id: string) {
    return this.technicianService.getSafetyCheckById(Number(id));
  }

  // ── Route 7: POST /technician/faults ────────────────────────────────────────
  // Feature: Fault Handling — report a new fault
  // Demonstrates: @Body()
  @Post('faults')
  reportFault(@Body() dto: CreateFaultReportDto) {
    return this.technicianService.reportFault(dto);
  }

  // ── Route 8: PATCH /technician/faults/:id ───────────────────────────────────
  // Feature: Fault Handling — update fault status (e.g. mark as Resolved)
  // Demonstrates: @Param() + @Body()
  @Patch('faults/:id')
  updateFaultStatus(
    @Param('id') id: string,
    @Body() dto: UpdateFaultStatusDto,
  ) {
    return this.technicianService.updateFaultStatus(Number(id), dto);
  }
}
