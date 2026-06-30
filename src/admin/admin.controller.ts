import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('adminLogin')
  adminLogin(): string {
    return this.adminService.adminLogin();
  }
  @Get('/index')
  getDashboard(): string {
    return this.adminService.getDashboard();
  }
  @Get('user/:id')
  searchOneUser(@Param('id') id: string) {
    return this.adminService.searchOneUser(id);
  }
  @Get('users')
  allUsers(@Query('status') status: string) {
    return this.adminService.allUsers(status);
  }
  @Patch('patch')
  patchHi(): string {
    return this.adminService.patchHi();
  }
  @Put('put')
  putHi(): string {
    return this.adminService.putHi();
  }
  @Delete('delete')
  deleteHi(): string {
    return this.adminService.deleteHi();
  }
}
