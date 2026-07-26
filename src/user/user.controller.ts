import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Route 1: Register User
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  // Route 2: Login User
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.userService.login(body);
  }

  // Route 3: Search User
  @Get('search')
  search(@Query('name') name: string) {
    return this.userService.search(name);
  }

  // Route 4: Get All Users
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  // Route 5: Get User By ID
  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUser(id);
  }

  // Route 6: Update User
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  // Route 7: Update Status
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: string },
  ) {
    return this.userService.updateStatus(id, body);
  }

  // Route 8: Update Password
  @Patch(':id/password')
  updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { password: string },
  ) {
    return this.userService.updatePassword(id, body);
  }

  // Route 9: Delete User
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
