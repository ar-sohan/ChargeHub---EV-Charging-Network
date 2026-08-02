import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';
export class CreateManagedUserDto { @IsString() name: string; @IsEmail() email: string; @IsIn(['driver', 'host', 'technician']) role: string; }
export class UpdateManagedUserDto extends PartialType(CreateManagedUserDto) { @IsOptional() @IsIn(['active', 'suspended']) status?: string; }
