import { IsString, IsEmail, IsIn, MinLength, Matches } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  fullName: string;

  @IsEmail()
  @Matches(/aiub\.edu$/i, { message: 'email must be an aiub.edu address' })
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/[A-Z]/, { message: 'password must contain an uppercase letter' })
  password: string;

  @IsIn(['male', 'female'], { message: 'gender must be male or female' })
  gender: string;

  @Matches(/^[0-9]+$/, { message: 'phone must contain only numbers' })
  phone: string;
}
