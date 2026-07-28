import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Column } from 'typeorm';
import { AdminUser } from './admin.entity';
import { CreateAdminUserDto, UpdateAdminUserDto } from './admin-user.dto';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(AdminUser)
    private userRepo: Repository<AdminUser>,
  ) {}

  async create(dto: CreateAdminUserDto): Promise<AdminUser> {
    const user = this.userRepo.create(dto);
    return await this.userRepo.save(user);
  }

  async updatePhone(id: string, dto: UpdateAdminUserDto): Promise<AdminUser> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`ID ${id} not found`);
    }
    user.phone = dto.phone;
    return await this.userRepo.save(user.id, user.phone);
  }

  async findNullFullName(): Promise<AdminUser[]> {
    return await this.userRepo.find({
      where: { fullName: IsNull() },
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`ID ${id} not found`);
    }
  }
}
