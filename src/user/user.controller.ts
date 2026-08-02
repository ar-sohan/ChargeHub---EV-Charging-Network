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
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Route 1: Register User (Public)
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  // Route 2: Login User (Public)
  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.userService.login(dto);
  }

  // Route 3: Search User (Protected)
  @UseGuards(JwtAuthGuard)
  @Get('search')
  search(@Query('name') name: string) {
    return this.userService.search(name);
  }

  // Route 4: Get All Users (Protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  // User -> Booking (one-to-many) CRUD routes
  @UseGuards(JwtAuthGuard)
  @Post('bookings')
  createBooking(@Body() dto: CreateBookingDto) {
    return this.userService.createBooking(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('bookings')
  findAllBookings() {
    return this.userService.findAllBookings();
  }

  @UseGuards(JwtAuthGuard)
  @Get('bookings/:id')
  findOneBooking(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOneBooking(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('bookings/:id')
  updateBooking(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookingDto,
  ) {
    return this.userService.updateBooking(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('bookings/:id')
  removeBooking(@Param('id', ParseIntPipe) id: number) {
    return this.userService.removeBooking(id);
  }

  // Booking -> Payment (one-to-one) CRUD routes
  @UseGuards(JwtAuthGuard)
  @Post('payments')
  createPayment(@Body() dto: CreatePaymentDto) {
    return this.userService.createPayment(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('payments')
  findAllPayments() {
    return this.userService.findAllPayments();
  }

  @UseGuards(JwtAuthGuard)
  @Get('payments/:id')
  findOnePayment(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOnePayment(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('payments/:id')
  updatePayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePaymentDto,
  ) {
    return this.userService.updatePayment(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('payments/:id')
  removePayment(@Param('id', ParseIntPipe) id: number) {
    return this.userService.removePayment(id);
  }

  // Route 5: Get User By ID (Protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUser(id);
  }

  // Route 6: Update User (Protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  // Route 7: Update Status (Protected)
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserStatusDto,
  ) {
    return this.userService.updateStatus(id, body);
  }

  // Route 8: Update Password (Protected)
  @UseGuards(JwtAuthGuard)
  @Patch(':id/password')
  updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(id, body);
  }

  // Route 9: Delete User (Protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
