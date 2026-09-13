import { ChargingService } from './charging.service';
import { StationService } from './station.service';
import { NotificationService } from './notification.service';
import { NotificationAuthDto } from './dto/notification-auth.dto';
import {
  Body,
  ForbiddenException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
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

import { JwtAuthGuard } from './guards/jwt-auth.guard';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly notifications: NotificationService, private readonly charging: ChargingService, private readonly stationService: StationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('charging')
  chargingSessions(@Req() request: { user: { sub: number } }) {
    return this.charging.list(request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('charging/:id/start')
  startCharging(@Param('id', ParseIntPipe) id: number, @Req() request: { user: { sub: number } }) {
    return this.charging.start(id, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('charging/:id/stop')
  stopCharging(@Param('id', ParseIntPipe) id: number, @Req() request: { user: { sub: number } }) {
    return this.charging.stop(id, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('notifications/auth')
  notificationAuth(@Body() dto: NotificationAuthDto, @Req() req: { user: { sub: number } }) {
    return this.notifications.authorize(req.user.sub, dto.socket_id, dto.channel_name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('notifications')
  notificationsList(@Req() req: { user: { sub: number } }) {
    return this.notifications.list(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('notifications/:id/read')
  readNotification(@Param('id', ParseIntPipe) id: number, @Req() req: { user: { sub: number } }) {
    return this.notifications.markRead(req.user.sub, id);
  }

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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() request: { user: { sub: number } }) {
    return this.userService.getUser(request.user.sub);
  }

  // Route 3: Search User (Protected)
  @UseGuards(JwtAuthGuard)
  @Get('search')
  search(@Query('name') name: string) {
    throw new ForbiddenException('User directory access is not allowed');
  }

  // Route 4: Get All Users (Protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  getAllUsers() {
    throw new ForbiddenException('User directory access is not allowed');
  }

  @UseGuards(JwtAuthGuard)
  @Get('slots')
  availableSlots(@Query('block') block?: string, @Query('road') road?: string, @Query('stationId') stationId?: string) {
    return this.userService.availableSlots({ block, road, stationId });
  }

  @UseGuards(JwtAuthGuard)
  @Get('stations')
  stations() {
    return this.stationService.list();
  }

  // User -> Booking (one-to-many) CRUD routes
  @UseGuards(JwtAuthGuard)
  @Post('bookings')
  createBooking(@Body() dto: CreateBookingDto, @Req() request: { user: { sub: number } }) {
    return this.userService.createBooking(dto, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('bookings')
  findAllBookings(@Req() request: { user: { sub: number } }) {
    return this.userService.findAllBookings(request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('bookings/:id')
  findOneBooking(@Param('id', ParseIntPipe) id: number, @Req() request: { user: { sub: number } }) {
    return this.userService.findOneBooking(id, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('bookings/:id')
  updateBooking(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookingDto,
    @Req() request: { user: { sub: number } },
  ) {
    return this.userService.updateBooking(id, dto, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('bookings/:id')
  removeBooking(@Param('id', ParseIntPipe) id: number, @Req() request: { user: { sub: number } }) {
    return this.userService.updateBooking(id, { status: 'cancelled' }, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('payments/quote/:bookingId')
  paymentQuote(@Param('bookingId', ParseIntPipe) id: number, @Req() req: { user: { sub: number } }) {
    return this.userService.paymentQuote(id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('payments/demo')
  demoPayment(@Body() dto: CreatePaymentDto, @Req() req: { user: { sub: number } }) {
    return this.userService.demoPayment(dto.bookingId, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('payments')
  findAllPayments(@Req() req: { user: { sub: number } }) {
    return this.userService.findAllPayments(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('payments/:id')
  findOnePayment(@Param('id', ParseIntPipe) id: number, @Req() req: { user: { sub: number } }) {
    return this.userService.findOnePayment(id, req.user.sub);
  }
  // Route 5: Get User By ID (Protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number, @Req() req: { user: { sub: number } }) {
    if (req.user.sub !== id) throw new ForbiddenException('You can only view your own profile');
    return this.userService.getUser(id);
  }

  // Route 6: Update User (Protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: { user: { sub: number } },
  ) {
    if (request.user.sub !== id) {
      throw new ForbiddenException('You can only edit your own profile');
    }
    return this.userService.update(id, updateUserDto);
  }

  // Route 7: Update Status (Protected)
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserStatusDto,
  ) {
    throw new ForbiddenException('Users cannot change account status');
  }

  // Route 8: Update Password (Protected)
  @UseGuards(JwtAuthGuard)
  @Patch(':id/password')
  updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePasswordDto,
    @Req() req: { user: { sub: number } },
  ) {
    if (req.user.sub !== id) throw new ForbiddenException('You can only change your own password');
    return this.userService.updatePassword(id, body);
  }

  // Route 9: Delete User (Protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: { user: { sub: number } }) {
    if (req.user.sub !== id) throw new ForbiddenException('You can only delete your own account');
    return this.userService.remove(id);
  }
}











