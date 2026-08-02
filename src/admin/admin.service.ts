import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ILike, Repository } from 'typeorm';
import { AdminEntity } from './admin.entity';
import { ManagedUser } from './managed-user.entity';
import { Dispute } from './dispute.entity';
import { Resolution } from './resolution.entity';
import { CreateAdminDto, LoginAdminDto, UpdateAdminDto } from './dto/admin.dto';
import { CreateManagedUserDto, UpdateManagedUserDto } from './dto/managed-user.dto';
import { CreateDisputeDto, CreateResolutionDto } from './dto/dispute.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity) private readonly adminRepo: Repository<AdminEntity>,
    @InjectRepository(ManagedUser) private readonly managedUserRepo: Repository<ManagedUser>,
    @InjectRepository(Dispute) private readonly disputeRepo: Repository<Dispute>,
    @InjectRepository(Resolution) private readonly resolutionRepo: Repository<Resolution>,
    private readonly jwt: JwtService,
  ) {}

  private withoutPassword(admin: AdminEntity) { const { password, ...safeAdmin } = admin; return safeAdmin; }
  async findOne(id: number) { const admin = await this.adminRepo.findOneBy({ id }); if (!admin) throw new NotFoundException(`Admin ${id} was not found`); return this.withoutPassword(admin); }
  private async adminEntity(id: number) { const admin = await this.adminRepo.findOneBy({ id }); if (!admin) throw new NotFoundException(`Admin ${id} was not found`); return admin; }

  async register(dto: CreateAdminDto) {
    if (await this.adminRepo.findOneBy({ email: dto.email.toLowerCase() })) throw new ConflictException('Email already registered');
    const password = await bcrypt.hash(dto.password, 12);
    const admin = await this.adminRepo.save(this.adminRepo.create({ ...dto, email: dto.email.toLowerCase(), password }));
    return { message: 'Admin registered successfully', admin: this.withoutPassword(admin) };
  }

  async login(dto: LoginAdminDto) {
    const admin = await this.adminRepo.findOne({ where: { email: dto.email.toLowerCase() }, select: { id: true, email: true, password: true, isActive: true } });
    if (!admin || !(await bcrypt.compare(dto.password, admin.password))) throw new UnauthorizedException('Invalid email or password');
    if (!admin.isActive) throw new UnauthorizedException('Admin account is inactive');
    return { accessToken: await this.jwt.signAsync({ sub: admin.id, email: admin.email, role: 'admin' }) };
  }

  async findAll(email?: string) { const admins = await this.adminRepo.find({ where: email ? { email: ILike(`%${email}%`) } : {} }); return admins.map((admin) => this.withoutPassword(admin)); }
  async update(id: number, dto: UpdateAdminDto) { await this.adminEntity(id); if (dto.email) dto.email = dto.email.toLowerCase(); if (dto.password) dto.password = await bcrypt.hash(dto.password, 12); await this.adminRepo.update(id, dto); return this.findOne(id); }
  async setActive(id: number, isActive: boolean) { await this.adminEntity(id); await this.adminRepo.update(id, { isActive }); return this.findOne(id); }
  async remove(id: number) { await this.adminEntity(id); await this.adminRepo.delete(id); return { message: 'Admin deleted successfully' }; }

  async addUser(adminId: number, dto: CreateManagedUserDto) { const admin = await this.adminEntity(adminId); const exists = await this.managedUserRepo.findOneBy({ email: dto.email.toLowerCase() }); if (exists) throw new ConflictException('Managed user email already exists'); return this.managedUserRepo.save(this.managedUserRepo.create({ ...dto, email: dto.email.toLowerCase(), admin })); }
  async getUsers(adminId: number, role?: string) { await this.adminEntity(adminId); return this.managedUserRepo.find({ where: role ? { admin: { id: adminId }, role } : { admin: { id: adminId } }, relations: { admin: true } }); }
  async updateUser(id: number, dto: UpdateManagedUserDto) { const user = await this.managedUserRepo.findOneBy({ id }); if (!user) throw new NotFoundException('Managed user was not found'); await this.managedUserRepo.update(id, dto); return this.managedUserRepo.findOneBy({ id }); }
  async removeUser(id: number) { const result = await this.managedUserRepo.delete(id); if (!result.affected) throw new NotFoundException('Managed user was not found'); return { message: 'Managed user deleted successfully' }; }

  async createDispute(adminId: number, dto: CreateDisputeDto) { const admin = await this.adminEntity(adminId); return this.disputeRepo.save(this.disputeRepo.create({ ...dto, admin })); }
  async addResolution(disputeId: number, dto: CreateResolutionDto) { const dispute = await this.disputeRepo.findOne({ where: { id: disputeId }, relations: { resolution: true } }); if (!dispute) throw new NotFoundException('Dispute was not found'); if (dispute.resolution) throw new ConflictException('Dispute already has a resolution'); const resolution = await this.resolutionRepo.save(this.resolutionRepo.create(dto)); dispute.resolution = resolution; dispute.status = 'RESOLVED'; return this.disputeRepo.save(dispute); }
  async getDisputes(adminId: number) { await this.adminEntity(adminId); return this.disputeRepo.find({ where: { admin: { id: adminId } }, relations: { resolution: true, admin: true } }); }
}
