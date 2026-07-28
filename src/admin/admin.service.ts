import {
  Injectable, NotFoundException, ConflictException, UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { AdminEntity } from './admin.entity';
import { Dispute } from './dispute.entity';
import { Resolution } from './resolution.entity';
import { ManagedUser } from './managed-user.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { CreateResolutionDto } from './dto/create-resolution.dto';
import { CreateManagedUserDto } from './dto/create-managed-user.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity) private adminRepo: Repository<AdminEntity>,
    @InjectRepository(Dispute) private disputeRepo: Repository<Dispute>,
    @InjectRepository(Resolution) private resolutionRepo: Repository<Resolution>,
    @InjectRepository(ManagedUser) private userRepo: Repository<ManagedUser>,
    private jwt: JwtService,
    private mailer: MailerService,
  ) {}

  // ---- Auth (BCrypt + JWT + HttpException) ----
  async create(dto: CreateAdminDto) {
    const exists = await this.adminRepo.findOneBy({ email: dto.email });
    if (exists) throw new ConflictException('Email already registered'); // 409
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(dto.password, salt);
    const saved = await this.adminRepo.save(this.adminRepo.create({ ...dto, password }));
    delete (saved as any).password;
    try {
      await this.mailer.sendMail({
        to: saved.email,
        subject: 'Admin account created',
        text: `Hi ${saved.fullName || 'Admin'}, your admin account is ready.`,
      });
    } catch (e) {
      console.error('Email failed:', e.message);
    }
    return saved;
  }

  async login(dto: LoginAdminDto) {
    const admin = await this.adminRepo.findOneBy({ email: dto.email });
    if (!admin) throw new UnauthorizedException('Invalid credentials'); // 401
    const ok = await bcrypt.compare(dto.password, admin.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const token = await this.jwt.signAsync({ sub: admin.id, email: admin.email, role: 'admin' });
    return { access_token: token };
  }

  // ---- Admin CRUD (TypeORM operations) ----
  findAll(email?: string) {
    const where: any = {};
    if (email) where.email = Like(`%${email}%`);
    return this.adminRepo.find({ where });
  }

  async findOne(id: number) {
    const admin = await this.adminRepo.findOneBy({ id });
    if (!admin) throw new NotFoundException(`Admin ${id} not found`); // 404
    return admin;
  }

  async update(id: number, dto: CreateAdminDto) {
    await this.findOne(id);
    await this.adminRepo.update(id, dto);
    return this.findOne(id);
  }

  async setActive(id: number, value: boolean) {
    await this.findOne(id);
    await this.adminRepo.update(id, { isActive: value });
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.adminRepo.delete(id);
    return { deleted: true, id };
  }

  // ---- USER MANAGEMENT: Admin -> ManagedUser (One-to-Many) ----
  async addUser(adminId: number, dto: CreateManagedUserDto) {
    const admin = await this.findOne(adminId);
    const user = this.userRepo.create({ ...dto, admin });
    return this.userRepo.save(user);
  }

  getUsers(adminId: number, role?: string) {
    const where: any = { admin: { id: adminId } };
    if (role) where.role = role;
    return this.userRepo.find({ where, relations: { admin: true } });
  }

  async getUser(userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException(`User ${userId} not found`);
    return user;
  }

  async approveUser(userId: number) {
    const user = await this.getUser(userId);
    await this.userRepo.update(userId, { isApproved: true });
    try {
      await this.mailer.sendMail({
        to: user.email,
        subject: 'Your account has been approved',
        text: `Hi ${user.name}, your ${user.role} account has been approved by an admin.`,
      });
    } catch (e) {
      console.error('Email failed:', e.message);
    }
    return this.getUser(userId);
  }

  async setUserStatus(userId: number, status: string) {
    await this.getUser(userId);
    await this.userRepo.update(userId, { status });
    return this.getUser(userId);
  }

  async removeUser(userId: number) {
    await this.getUser(userId);
    await this.userRepo.delete(userId);
    return { deleted: true, id: userId };
  }

  // ---- Disputes: Admin -> Dispute (1:M) and Dispute -> Resolution (1:1) ----
  async createDispute(adminId: number, dto: CreateDisputeDto) {
    const admin = await this.findOne(adminId);
    const dispute = this.disputeRepo.create({ subject: dto.subject, admin });
    return this.disputeRepo.save(dispute);
  }

  async addResolution(disputeId: number, dto: CreateResolutionDto) {
    const dispute = await this.disputeRepo.findOne({
      where: { id: disputeId }, relations: { resolution: true },
    });
    if (!dispute) throw new NotFoundException('Dispute not found');
    if (dispute.resolution) throw new ConflictException('Dispute already resolved');
    dispute.resolution = this.resolutionRepo.create({ ...dto });
    dispute.status = 'RESOLVED';
    await this.disputeRepo.save(dispute);
    return this.disputeRepo.findOne({ where: { id: disputeId }, relations: { resolution: true } });
  }

  getAdminDisputes(adminId: number) {
    return this.disputeRepo.find({
      where: { admin: { id: adminId } },
      relations: { resolution: true, admin: true },
    });
  }

  async deleteDispute(disputeId: number) {
    const dispute = await this.disputeRepo.findOneBy({ id: disputeId });
    if (!dispute) throw new NotFoundException('Dispute not found');
    await this.disputeRepo.delete(disputeId);
    return { deleted: true, id: disputeId };
  }
}
