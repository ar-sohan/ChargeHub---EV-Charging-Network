import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginDto } from './dto/login.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  adminLogin(@Body() loginDto: LoginDto) {
    return this.adminService.adminLogin(loginDto);
  }
  @Get('/index')
  getDashboard(): string {
    return this.adminService.getDashboard();
  }
  @Get('users')
  getAllUsers(): object {
    return this.adminService.getAllUsers();
  }
  @Delete('users/ban/:id')
  removeUser(@Param('id') id: string): any {
    return this.adminService.removeUser(id);
  }
}
