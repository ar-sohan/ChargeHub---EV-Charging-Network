import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { technicianDto } from './dto/technitianVerify.dto';

@Injectable()
export class AdminService {
  private users = [
    { id: '1', name: 'Sohan', age: 21, gender: 'male' },
    { id: '2', name: 'Arif', age: 22, gender: 'male' },
    { id: '3', name: 'Shahriar', age: 23, gender: 'male' },
    { id: '4', name: 'Kabir', age: 24, gender: 'male' },
    { id: '5', name: 'Rahim', age: 25, gender: 'male' },
  ];
  adminLogin(loginDto: LoginDto) {
    if (loginDto.username === 'admin' && loginDto.password === 'admin') {
      return 'Login successful';
    }
    throw new UnauthorizedException('Invalid credentials');
  }
  getDashboard(): string {
    return 'Welcome to the admin dashboard';
  }
  getAllUsers(): object {
    return this.users;
  }
  getOneUser(id: string): any {
    return this.users.find((user) => user.id === id);
  }
  removeUser(id: string): any {
    const idx = this.users.find((user) => user.id === id);
    if (!idx) {
      return 'User not found';
    }
    const restUsers = this.users.filter((user) => user.id !== id);
    return restUsers;
  }
  getTechnician(td: technicianDto) {
    return { message: 'Technician verified', data: td };
  }
  getParking(): object {
    return { house: 21, area: 'dhaka', zone: 222122 };
  }
  getPayments(): any {
    return { payment_id: 1, amount: 200, time: null };
  }
  viewAdminSettings(): any {
    return 'This is the admin setting section';
  }
}
