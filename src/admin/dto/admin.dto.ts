import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class CreateAdminDto { @IsString() @IsNotEmpty() fullName: string; @IsEmail() email: string; @IsString() @MinLength(6) password: string; }
export class LoginAdminDto { @IsEmail() email: string; @IsString() @MinLength(6) password: string; }
export class UpdateAdminDto extends PartialType(CreateAdminDto) {}
