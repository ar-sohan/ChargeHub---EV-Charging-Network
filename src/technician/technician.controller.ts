import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard as AdminAuthGuard } from '../admin/guards/jwt-auth.guard';
import { CreateFaultReportDto, UpdateFaultStatusDto } from './dto/create-fault-report.dto';
import { CreateMaintenanceTaskDto, UpdateMaintenanceTaskDto } from './dto/create-maintenance-task.dto';
import { CreateSafetyCheckDto } from './dto/create-safety-check.dto';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import {
  LoginTechnicianDto,
  UpdateApprovalDto,
  UpdateTechnicianProfileDto,
} from './dto/technician-auth.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { TechnicianAuthGuard } from './guards/technician-auth.guard';
import type { TechnicianTokenPayload } from './guards/technician-auth.guard';
import { TechnicianService } from './technician.service';

type AuthedRequest = { user: TechnicianTokenPayload };

function assertSelf(req: AuthedRequest, technicianId: number) {
  if (req.user.sub !== technicianId) {
    throw new ForbiddenException('You can only change your own records');
  }
}

// Static routes (register, login, me, search, maintenance/:id, faults/:id ...)
// are declared before ':id' so the numeric id route does not swallow them.
@Controller('technician')
export class TechnicianController {
  constructor(private readonly technicianService: TechnicianService) {}

  // ---- Auth ----
  @Post('register')
  register(@Body() dto: CreateTechnicianDto) {
    return this.technicianService.createProfile(dto);
  }

  @Post('login')
  login(@Body() dto: LoginTechnicianDto) {
    return this.technicianService.login(dto);
  }

  @Get('me')
  @UseGuards(TechnicianAuthGuard)
  me(@Req() req: AuthedRequest) {
    return this.technicianService.getProfile(req.user.sub);
  }

  // ---- Admin only ----
  @Get()
  @UseGuards(AdminAuthGuard)
  findAll() {
    return this.technicianService.findAll();
  }

  @Patch(':id/approval')
  @UseGuards(AdminAuthGuard)
  updateApproval(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateApprovalDto) {
    return this.technicianService.updateApproval(id, dto);
  }

  // ---- Reads (any signed-in technician) ----
  @Get('search/:stationId')
  @UseGuards(TechnicianAuthGuard)
  searchByStation(@Param('stationId') stationId: string) {
    return this.technicianService.searchByStation(stationId);
  }

  @Get('by-date/search')
  @UseGuards(TechnicianAuthGuard)
  findByJoiningDate(@Query('joiningDate') joiningDate: string) {
    return this.technicianService.findByJoiningDate(joiningDate);
  }

  @Get('country/unknown')
  @UseGuards(TechnicianAuthGuard)
  findUnknownCountry() {
    return this.technicianService.findUnknownCountry();
  }

  @Get('maintenance/:id')
  @UseGuards(TechnicianAuthGuard)
  getMaintenanceById(@Param('id', ParseIntPipe) id: number) {
    return this.technicianService.getMaintenanceById(id);
  }

  @Get('faults/:id')
  @UseGuards(TechnicianAuthGuard)
  getFaultById(@Param('id', ParseIntPipe) id: number) {
    return this.technicianService.getFaultById(id);
  }

  @Get('safety-checks/:id')
  @UseGuards(TechnicianAuthGuard)
  getSafetyCheckById(@Param('id', ParseIntPipe) id: number) {
    return this.technicianService.getSafetyCheckById(id);
  }

  @Get(':id')
  @UseGuards(TechnicianAuthGuard)
  getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.technicianService.getProfile(id);
  }

  @Get(':technicianId/maintenance')
  @UseGuards(TechnicianAuthGuard)
  getMaintenanceTasks(@Param('technicianId', ParseIntPipe) technicianId: number) {
    return this.technicianService.getMaintenanceTasks(technicianId);
  }

  // ---- Writes (only on your own records) ----
  @Patch(':id/country')
  @UseGuards(TechnicianAuthGuard)
  updateCountry(
    @Req() req: AuthedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCountryDto,
  ) {
    assertSelf(req, id);
    return this.technicianService.updateCountry(id, dto);
  }

  @Patch(':id/profile')
  @UseGuards(TechnicianAuthGuard)
  updateProfile(
    @Req() req: AuthedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTechnicianProfileDto,
  ) {
    assertSelf(req, id);
    return this.technicianService.updateProfile(id, dto);
  }

  @Post(':technicianId/maintenance')
  @UseGuards(TechnicianAuthGuard)
  createMaintenanceTask(
    @Req() req: AuthedRequest,
    @Param('technicianId', ParseIntPipe) technicianId: number,
    @Body() dto: CreateMaintenanceTaskDto,
  ) {
    assertSelf(req, technicianId);
    return this.technicianService.createMaintenanceTask(technicianId, dto);
  }

  @Patch('maintenance/:id')
  @UseGuards(TechnicianAuthGuard)
  async updateMaintenanceTask(
    @Req() req: AuthedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMaintenanceTaskDto,
  ) {
    await this.technicianService.assertOwnsMaintenance(id, req.user.sub);
    return this.technicianService.updateMaintenanceTask(id, dto);
  }

  @Delete('maintenance/:id')
  @UseGuards(TechnicianAuthGuard)
  async removeMaintenanceTask(@Req() req: AuthedRequest, @Param('id', ParseIntPipe) id: number) {
    await this.technicianService.assertOwnsMaintenance(id, req.user.sub);
    return this.technicianService.removeMaintenanceTask(id);
  }

  // Adds a many-to-many technician <-> specialisation relation.
  @Post(':technicianId/specialisations/:name')
  @UseGuards(TechnicianAuthGuard)
  addSpecialisation(
    @Req() req: AuthedRequest,
    @Param('technicianId', ParseIntPipe) technicianId: number,
    @Param('name') name: string,
  ) {
    assertSelf(req, technicianId);
    return this.technicianService.addSpecialisation(technicianId, name);
  }

  @Post(':technicianId/safety-checks')
  @UseGuards(TechnicianAuthGuard)
  createSafetyCheck(
    @Req() req: AuthedRequest,
    @Param('technicianId', ParseIntPipe) technicianId: number,
    @Body() dto: CreateSafetyCheckDto,
  ) {
    assertSelf(req, technicianId);
    return this.technicianService.createSafetyCheck(technicianId, dto);
  }

  @Post(':technicianId/faults')
  @UseGuards(TechnicianAuthGuard)
  reportFault(
    @Req() req: AuthedRequest,
    @Param('technicianId', ParseIntPipe) technicianId: number,
    @Body() dto: CreateFaultReportDto,
  ) {
    assertSelf(req, technicianId);
    return this.technicianService.reportFault(technicianId, dto);
  }

  @Patch('faults/:id')
  @UseGuards(TechnicianAuthGuard)
  async updateFaultStatus(
    @Req() req: AuthedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFaultStatusDto,
  ) {
    await this.technicianService.assertOwnsFault(id, req.user.sub);
    return this.technicianService.updateFaultStatus(id, dto);
  }
}
