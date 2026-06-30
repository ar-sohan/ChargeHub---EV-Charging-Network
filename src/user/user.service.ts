import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface User extends CreateUserDto {
  id: string;
  status: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface StatusDto {
  status: string;
}

export interface PasswordDto {
  password: string;
}

@Injectable()
export class UserService {
  private users: User[] = [];

  // Logic for Route 1: Register
  register(dto: CreateUserDto) {
    const newUser = {
      id: Date.now().toString(),
      ...dto,
      status: 'active',
    };

    this.users.push(newUser);
    return {
      message: 'User registered successfully',
      user: newUser,
    };
  }

  // Logic for Route 2: Login
  login(body: LoginDto) {
    const user = this.users.find(
      (u) => u.email === body.email && u.password === body.password,
    );

    if (!user) {
      return { message: 'Invalid credentials' };
    }

    return {
      message: 'Login successful',
      user,
    };
  }

  // Logic for Route 3: Search via name
  search(name: string) {
    if (!name) return this.users;
    return this.users.filter((u) =>
      u.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  // Logic for Route 4: Get All
  getAllUsers() {
    return this.users;
  }

  // Logic for Route 5: Get One By ID
  getUser(id: string) {
    const user = this.users.find((u) => u.id === id);
    if (!user) return { message: 'User not found' };
    return user;
  }

  // Logic for Route 6: PUT Full Update
  update(id: string, dto: UpdateUserDto) {
    const user = this.users.find((u) => u.id === id);

    if (!user) return { message: 'User not found' };

    Object.assign(user, dto);

    return {
      message: 'User updated successfully',
      user,
    };
  }

  // Logic for Route 7: PATCH Update Status
  updateStatus(id: string, body: StatusDto) {
    const user = this.users.find((u) => u.id === id);

    if (!user) return { message: 'User not found' };

    user.status = body.status;

    return {
      message: 'Status updated',
      user,
    };
  }

  // Logic for Route 8: PATCH Update Password
  updatePassword(id: string, body: PasswordDto) {
    const user = this.users.find((u) => u.id === id);

    if (!user) return { message: 'User not found' };

    user.password = body.password;

    return {
      message: 'Password updated successfully',
    };
  }

  // Logic for Route 9: DELETE
  remove(id: string) {
    const index = this.users.findIndex((u) => u.id === id);

    if (index === -1) return { message: 'User not found' };

    const deleted = this.users.splice(index, 1);

    return {
      message: 'User deleted successfully',
      user: deleted[0],
    };
  }
}
