import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { CreateResolutionDto } from './dto/create-resolution.dto';
import { CreateManagedUserDto } from './dto/create-managed-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ---- Admin account routes (GET/POST/PUT/PATCH/DELETE) ----
  @Post()
  create(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto);
  }

  @Post('login')
  login(@Body() dto: LoginAdminDto) {
    return this.adminService.login(dto);
  }

  @Get()
  findAll(@Query('email') email?: string) {
    return this.adminService.findAll(email);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateAdminDto) {
    return this.adminService.update(id, dto);
  }

  @Patch(':id/activate')
  setActive(
    @Param('id', ParseIntPipe) id: number,
    @Query('value') value: string,
  ) {
    return this.adminService.setActive(id, value === 'true');
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.remove(id);
  }

  @Post(':id/user')
  @UseGuards(JwtAuthGuard)
  addUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateManagedUserDto,
  ) {
    return this.adminService.addUser(id, dto);
  }

  @Get(':id/users') // GET /admin/1/users?role=host
  getUsers(
    @Param('id', ParseIntPipe) id: number,
    @Query('role') role?: string,
  ) {
    return this.adminService.getUsers(id, role);
  }

  @Get('user/:userId') // GET /admin/user/5
  getUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.adminService.getUser(userId);
  }

  @Patch('user/:userId/approve') // PATCH /admin/user/5/approve  (emails the user)
  @UseGuards(JwtAuthGuard)
  approveUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.adminService.approveUser(userId);
  }

  @Patch('user/:userId/status') // PATCH /admin/user/5/status?value=suspended
  @UseGuards(JwtAuthGuard)
  setUserStatus(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('value') value: string,
  ) {
    return this.adminService.setUserStatus(userId, value);
  }

  @Delete('user/:userId') // DELETE /admin/user/5
  @UseGuards(JwtAuthGuard)
  removeUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.adminService.removeUser(userId);
  }

  // ---- Dispute routes (Admin -> Dispute 1:M, Dispute -> Resolution 1:1) [JWT] ----
  @Post(':id/dispute') // POST /admin/1/dispute
  @UseGuards(JwtAuthGuard)
  createDispute(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateDisputeDto,
  ) {
    return this.adminService.createDispute(id, dto);
  }

  @Post('dispute/:disputeId/resolution') // POST /admin/dispute/1/resolution
  @UseGuards(JwtAuthGuard)
  addResolution(
    @Param('disputeId', ParseIntPipe) disputeId: number,
    @Body() dto: CreateResolutionDto,
  ) {
    return this.adminService.addResolution(disputeId, dto);
  }

  @Get(':id/disputes') // GET /admin/1/disputes
  getDisputes(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getAdminDisputes(id);
  }

  @Delete('dispute/:disputeId') // DELETE /admin/dispute/1
  @UseGuards(JwtAuthGuard)
  deleteDispute(@Param('disputeId', ParseIntPipe) disputeId: number) {
    return this.adminService.deleteDispute(disputeId);
  }
}
