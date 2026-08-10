import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTechnicianDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, { message: 'fullName must contain alphabets only' })
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @Matches(/^01\d{9}$/, {
  message: 'Phone number must start with 01 and be exactly 11 digits.',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  location: string;

  @IsInt()
  @Min(0)
  experience: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  primarySpecialisation: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  certification?: string;

  @IsOptional()
  @IsUrl()
  socialMediaLink?: string;

  @IsOptional()
  @IsUrl()
  profilePhoto?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  country?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialisations?: string[];
}
