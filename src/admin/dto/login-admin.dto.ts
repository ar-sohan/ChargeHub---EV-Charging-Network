import { IsEmail, IsString } from 'class-validator';

export class LoginAdminDto {
  @IsEmail()
  email: string | undefined;

  @IsString()
  password: string | undefined;
}
