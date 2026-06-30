import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { LoginDto, PasswordDto, StatusDto, UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Route 1: POST /user/register (Uses @Body)
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  // Route 2: POST /user/login (Uses @Body)
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.userService.login(body);
  }

  // Route 3: GET /user/search (Uses @Query)
  @Get('search')
  search(@Query('name') name: string) {
    return this.userService.search(name);
  }

  // Route 4: GET /user
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  // Route 5: GET /user/:id (Uses @Param)
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  // Route 6: PUT /user/:id (Uses @Param and @Body)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  // Route 7: PATCH /user/:id/status (Uses @Param and @Body)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: StatusDto) {
    return this.userService.updateStatus(id, body);
  }

  // Route 8: PATCH /user/:id/password (Uses @Param and @Body)
  @Patch(':id/password')
  updatePassword(@Param('id') id: string, @Body() body: PasswordDto) {
    return this.userService.updatePassword(id, body);
  }

  // Route 9 (Bonus/Backup): DELETE /user/:id (Uses @Param)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
