import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, LoginAdminDto, UpdateAdminDto } from './dto/admin.dto';
import { CreateManagedUserDto, UpdateManagedUserDto } from './dto/managed-user.dto';
import { CreateDisputeDto, CreateResolutionDto } from './dto/dispute.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  register(@Body() dto: CreateAdminDto) { return this.adminService.register(dto); }

  @Post('login')
  login(@Body() dto: LoginAdminDto) { return this.adminService.login(dto); }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('email') email?: string) { return this.adminService.findAll(email); }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.adminService.findOne(id); }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAdminDto) { return this.adminService.update(id, dto); }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/active')
  setActive(@Param('id', ParseIntPipe) id: number, @Body('isActive', ParseBoolPipe) isActive: boolean) { return this.adminService.setActive(id, isActive); }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.adminService.remove(id); }

  @UseGuards(JwtAuthGuard)
  @Post(':id/users')
  addUser(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateManagedUserDto) { return this.adminService.addUser(id, dto); }

  @UseGuards(JwtAuthGuard)
  @Get(':id/users')
  getUsers(@Param('id', ParseIntPipe) id: number, @Query('role') role?: string) { return this.adminService.getUsers(id, role); }

  @UseGuards(JwtAuthGuard)
  @Patch('users/:userId')
  updateUser(@Param('userId', ParseIntPipe) userId: number, @Body() dto: UpdateManagedUserDto) { return this.adminService.updateUser(userId, dto); }

  @UseGuards(JwtAuthGuard)
  @Delete('users/:userId')
  removeUser(@Param('userId', ParseIntPipe) userId: number) { return this.adminService.removeUser(userId); }

  @UseGuards(JwtAuthGuard)
  @Post(':id/disputes')
  createDispute(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateDisputeDto) { return this.adminService.createDispute(id, dto); }

  @UseGuards(JwtAuthGuard)
  @Post('disputes/:disputeId/resolution')
  addResolution(@Param('disputeId', ParseIntPipe) disputeId: number, @Body() dto: CreateResolutionDto) { return this.adminService.addResolution(disputeId, dto); }

  @UseGuards(JwtAuthGuard)
  @Get(':id/disputes')
  getDisputes(@Param('id', ParseIntPipe) id: number) { return this.adminService.getDisputes(id); }
}
