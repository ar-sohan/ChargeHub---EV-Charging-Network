import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CreateFaultReportDto, UpdateFaultStatusDto } from './dto/create-fault-report.dto';
import { CreateMaintenanceTaskDto, UpdateMaintenanceTaskDto } from './dto/create-maintenance-task.dto';
import { CreateSafetyCheckDto } from './dto/create-safety-check.dto';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { FaultReport } from './fault-report.entity';
import { MaintenanceTask } from './maintenance-task.entity';
import { SafetyCheck } from './safety-check.entity';
import { Specialisation } from './specialisation.entity';
import { Technician } from './technician.entity';

@Injectable()
export class TechnicianService {
  constructor(
    @InjectRepository(Technician)
    private readonly technicianRepository: Repository<Technician>,
    @InjectRepository(MaintenanceTask)
    private readonly maintenanceRepository: Repository<MaintenanceTask>,
    @InjectRepository(SafetyCheck)
    private readonly safetyCheckRepository: Repository<SafetyCheck>,
    @InjectRepository(FaultReport)
    private readonly faultReportRepository: Repository<FaultReport>,
    @InjectRepository(Specialisation)
    private readonly specialisationRepository: Repository<Specialisation>,
  ) {}

  async createProfile(dto: CreateTechnicianDto): Promise<Technician> {
    const existing = await this.technicianRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('A technician profile already uses this email');
    }

    const names = [...new Set([dto.primarySpecialisation, ...(dto.specialisations ?? [])])];
    const specialisations = await Promise.all(
      names.map((name) => this.findOrCreateSpecialisation(name)),
    );
    const technician = this.technicianRepository.create({
      ...dto,
      country: dto.country ?? 'Unknown',
      approvalStatus: 'Pending',
      specialisations,
    });
    return this.technicianRepository.save(technician);
  }

  async getProfile(id: number): Promise<Technician> {
    return this.findTechnician(id, {
      specialisations: true,
      maintenanceTasks: true,
      safetyChecks: true,
      faultReports: true,
    });
  }

  async updateCountry(id: number, dto: UpdateCountryDto): Promise<Technician> {
    const technician = await this.findTechnician(id);
    technician.country = dto.country;
    return this.technicianRepository.save(technician);
  }

  async findByJoiningDate(joiningDate: string): Promise<Technician[]> {
    const start = new Date(`${joiningDate}T00:00:00.000Z`);
    const end = new Date(`${joiningDate}T23:59:59.999Z`);
    return this.technicianRepository.find({ where: { joiningDate: Between(start, end) } });
  }

  async findUnknownCountry(): Promise<Technician[]> {
    return this.technicianRepository.find({ where: { country: 'Unknown' } });
  }

  async createMaintenanceTask(technicianId: number, dto: CreateMaintenanceTaskDto) {
    const technician = await this.findApprovedTechnician(technicianId);
    const task = this.maintenanceRepository.create({ ...dto, technician });
    return this.maintenanceRepository.save(task);
  }

  async getMaintenanceTasks(technicianId: number): Promise<MaintenanceTask[]> {
    await this.findTechnician(technicianId);
    return this.maintenanceRepository.find({
      where: { technician: { id: technicianId } },
      relations: { technician: true },
    });
  }

  async updateMaintenanceTask(id: number, dto: UpdateMaintenanceTaskDto) {
    const task = await this.maintenanceRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Maintenance task with ID ${id} not found`);
    Object.assign(task, dto);
    return this.maintenanceRepository.save(task);
  }

  async removeMaintenanceTask(id: number) {
    const result = await this.maintenanceRepository.delete(id);
    if (!result.affected) throw new NotFoundException(`Maintenance task with ID ${id} not found`);
    return { message: 'Maintenance task deleted successfully' };
  }

  async addSpecialisation(technicianId: number, name: string): Promise<Technician> {
    const technician = await this.findTechnician(technicianId, { specialisations: true });
    const specialisation = await this.findOrCreateSpecialisation(name);
    if (!technician.specialisations.some((item) => item.id === specialisation.id)) {
      technician.specialisations.push(specialisation);
    }
    return this.technicianRepository.save(technician);
  }

  async createSafetyCheck(technicianId: number, dto: CreateSafetyCheckDto) {
    const technician = await this.findApprovedTechnician(technicianId);
    return this.safetyCheckRepository.save(this.safetyCheckRepository.create({ ...dto, technician }));
  }

  async getSafetyCheckById(id: number): Promise<SafetyCheck> {
    const check = await this.safetyCheckRepository.findOne({
      where: { id },
      relations: { technician: true },
    });
    if (!check) throw new NotFoundException(`Safety check with ID ${id} not found`);
    return check;
  }

  async reportFault(technicianId: number, dto: CreateFaultReportDto) {
    const technician = await this.findApprovedTechnician(technicianId);
    return this.faultReportRepository.save(this.faultReportRepository.create({ ...dto, technician }));
  }

  async updateFaultStatus(id: number, dto: UpdateFaultStatusDto) {
    const fault = await this.faultReportRepository.findOne({ where: { id } });
    if (!fault) throw new NotFoundException(`Fault report with ID ${id} not found`);
    fault.status = dto.status;
    fault.resolutionNote = dto.resolutionNote;
    fault.resolvedAt = dto.status === 'Resolved' ? new Date() : undefined;
    return this.faultReportRepository.save(fault);
  }

  private async findTechnician(id: number, relations = {}): Promise<Technician> {
    const technician = await this.technicianRepository.findOne({ where: { id }, relations });
    if (!technician) throw new NotFoundException(`Technician profile with ID ${id} not found`);
    return technician;
  }

  private async findApprovedTechnician(id: number): Promise<Technician> {
    const technician = await this.findTechnician(id);
    if (technician.approvalStatus !== 'Approved') {
      throw new ForbiddenException('Technician profile must be approved before performing work');
    }
    return technician;
  }

  private async findOrCreateSpecialisation(name: string): Promise<Specialisation> {
    const normalizedName = name.trim();
    const existing = await this.specialisationRepository.findOne({ where: { name: normalizedName } });
    return existing ?? this.specialisationRepository.save(this.specialisationRepository.create({ name: normalizedName }));
  }
}
