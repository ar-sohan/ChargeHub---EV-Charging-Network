import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // Remove password from response
  private removePassword(user: UserEntity) {
    const result = { ...user };

    delete result.password;

    return result;
  }

  // Register User
  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      status: 'active',
    });

    await this.userRepository.save(user);

    return {
      message: 'User registered successfully',
      user: this.removePassword(user),
    };
  }

  // Login User
  async login(body: { email: string; password: string }) {
    const user = await this.userRepository.findOne({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatched = await bcrypt.compare(
      body.password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      message: 'Login successful',
      user: this.removePassword(user),
    };
  }

  // Search User
  async search(name: string) {
    if (!name) {
      return this.userRepository.find();
    }

    return this.userRepository.find({
      where: {
        fullName: ILike(`%${name}%`),
      },
    });
  }

  // Get All Users
  async getAllUsers() {
    const users = await this.userRepository.find();

    return users.map((user) => this.removePassword(user));
  }

  // Get User By ID
  async getUser(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.removePassword(user);
  }

  // Update User
  async update(id: number, dto: UpdateUserDto) {
    await this.findUser(id);

    await this.userRepository.update(id, dto);

    return this.getUser(id);
  }

  // Update Status
  async updateStatus(
    id: number,
    body: {
      status: string;
    },
  ) {
    await this.findUser(id);

    await this.userRepository.update(id, {
      status: body.status,
    });

    return this.getUser(id);
  }

  // Update Password
  async updatePassword(
    id: number,
    body: {
      password: string;
    },
  ) {
    await this.findUser(id);

    const hashedPassword = await bcrypt.hash(body.password, 10);

    await this.userRepository.update(id, {
      password: hashedPassword,
    });

    return {
      message: 'Password updated successfully',
    };
  }

  // Delete User
  async remove(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(id);

    return {
      message: 'User deleted successfully',
      user: this.removePassword(user),
    };
  }

  // Internal user check
  private async findUser(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
