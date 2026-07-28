import { IsString, IsEmail, IsIn, MinLength, Matches } from 'class-validator';

// Category 2 validation rules
export class CreateAdminDto {
  @IsString()
  fullName: string | undefined;

  @IsEmail()
  @Matches(/aiub\.edu$/i, { message: 'email must be an aiub.edu address' })
  email: string | undefined;

  @IsString()
  @MinLength(6)
  @Matches(/[A-Z]/, { message: 'password must contain an uppercase letter' })
  password: string | undefined;

  @IsIn(['male', 'female'], { message: 'gender must be male or female' })
  gender: string | undefined;

  @Matches(/^[0-9]+$/, { message: 'phone must contain only numbers' })
  phone: string | undefined;
}
