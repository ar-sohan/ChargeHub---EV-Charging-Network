import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateFaultReportDto, UpdateFaultStatusDto } from './dto/create-fault-report.dto';
import { CreateMaintenanceTaskDto, UpdateMaintenanceTaskDto } from './dto/create-maintenance-task.dto';
import { CreateSafetyCheckDto } from './dto/create-safety-check.dto';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { TechnicianService } from './technician.service';

@Controller('technician')
export class TechnicianController {
  constructor(private readonly technicianService: TechnicianService) {}

  @Post()
  createProfile(@Body() dto: CreateTechnicianDto) {
    return this.technicianService.createProfile(dto);
  }

  @Get(':id')
  getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.technicianService.getProfile(id);
  }

  @Patch(':id/country')
  updateCountry(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCountryDto,
  ) {
    return this.technicianService.updateCountry(id, dto);
  }

  @Get('by-date/search')
  findByJoiningDate(@Query('joiningDate') joiningDate: string) {
    return this.technicianService.findByJoiningDate(joiningDate);
  }

  @Get('country/unknown')
  findUnknownCountry() {
    return this.technicianService.findUnknownCountry();
  }

  // One technician can own many maintenance tasks.
  @Post(':technicianId/maintenance')
  createMaintenanceTask(
    @Param('technicianId', ParseIntPipe) technicianId: number,
    @Body() dto: CreateMaintenanceTaskDto,
  ) {
    return this.technicianService.createMaintenanceTask(technicianId, dto);
  }

  @Get(':technicianId/maintenance')
  getMaintenanceTasks(@Param('technicianId', ParseIntPipe) technicianId: number) {
    return this.technicianService.getMaintenanceTasks(technicianId);
  }

  @Patch('maintenance/:id')
  updateMaintenanceTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMaintenanceTaskDto,
  ) {
    return this.technicianService.updateMaintenanceTask(id, dto);
  }

  @Delete('maintenance/:id')
  removeMaintenanceTask(@Param('id', ParseIntPipe) id: number) {
    return this.technicianService.removeMaintenanceTask(id);
  }

  // Adds a many-to-many technician <-> specialisation relation.
  @Post(':technicianId/specialisations/:name')
  addSpecialisation(
    @Param('technicianId', ParseIntPipe) technicianId: number,
    @Param('name') name: string,
  ) {
    return this.technicianService.addSpecialisation(technicianId, name);
  }

  @Post(':technicianId/safety-checks')
  createSafetyCheck(
    @Param('technicianId', ParseIntPipe) technicianId: number,
    @Body() dto: CreateSafetyCheckDto,
  ) {
    return this.technicianService.createSafetyCheck(technicianId, dto);
  }

  @Get('safety-checks/:id')
  getSafetyCheckById(@Param('id', ParseIntPipe) id: number) {
    return this.technicianService.getSafetyCheckById(id);
  }

  @Post(':technicianId/faults')
  reportFault(
    @Param('technicianId', ParseIntPipe) technicianId: number,
    @Body() dto: CreateFaultReportDto,
  ) {
    return this.technicianService.reportFault(technicianId, dto);
  }

  @Patch('faults/:id')
  updateFaultStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFaultStatusDto,
  ) {
    return this.technicianService.updateFaultStatus(id, dto);
  }
}
