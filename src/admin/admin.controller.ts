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

  @Get(':id/users')
  getUsers(
    @Param('id', ParseIntPipe) id: number,
    @Query('role') role?: string,
  ) {
    return this.adminService.getUsers(id, role);
  }

  @Get('user/:userId')
  getUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.adminService.getUser(userId);
  }

  @Patch('user/:userId/approve')
  @UseGuards(JwtAuthGuard)
  approveUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.adminService.approveUser(userId);
  }

  @Patch('user/:userId/status')
  @UseGuards(JwtAuthGuard)
  setUserStatus(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('value') value: string,
  ) {
    return this.adminService.setUserStatus(userId, value);
  }

  @Delete('user/:userId')
  @UseGuards(JwtAuthGuard)
  removeUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.adminService.removeUser(userId);
  }

  @Post(':id/dispute')
  @UseGuards(JwtAuthGuard)
  createDispute(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateDisputeDto,
  ) {
    return this.adminService.createDispute(id, dto);
  }

  @Post('dispute/:disputeId/resolution')
  @UseGuards(JwtAuthGuard)
  addResolution(
    @Param('disputeId', ParseIntPipe) disputeId: number,
    @Body() dto: CreateResolutionDto,
  ) {
    return this.adminService.addResolution(disputeId, dto);
  }

  @Get(':id/disputes')
  getDisputes(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getAdminDisputes(id);
  }

  @Delete('dispute/:disputeId')
  @UseGuards(JwtAuthGuard)
  deleteDispute(@Param('disputeId', ParseIntPipe) disputeId: number) {
    return this.adminService.deleteDispute(disputeId);
  }
}
