import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ✅ Register user (ValidationPipe handles DTO validation automatically)
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  // ✅ Login user
  @Post('login')
  login(@Body() body: any) {
    // Changed LoginDto to 'any' for now since you skipped it
    return this.userService.login(body);
  }

  // ✅ Search user by query
  @Get('search')
  search(@Query('name') name: string) {
    return this.userService.search(name);
  }

  // ✅ Get all users
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  // ✅ Get user by ID
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  // ✅ Update full user
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
}
