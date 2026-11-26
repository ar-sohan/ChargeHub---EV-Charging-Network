import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

export class LoginTechnicianDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

const emptyToUndefined = ({ value }: { value: unknown }) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

export class UpdateTechnicianProfileDto {
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, { message: 'fullName must contain alphabets only' })
  fullName?: string;

  @IsOptional()
  @Matches(/^01\d{9}$/, { message: 'Phone number must start with 01 and be exactly 11 digits.' })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  country?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  experience?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  primarySpecialisation?: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @MaxLength(200)
  certification?: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @ValidateIf((_, v) => v !== undefined)
  @IsUrl()
  socialMediaLink?: string;
}

export class UpdateApprovalDto {
  @IsIn(['Approved', 'Rejected', 'Pending'])
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
}
