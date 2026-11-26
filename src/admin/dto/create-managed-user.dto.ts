import { IsString, IsEmail, IsIn } from 'class-validator';

export class CreateManagedUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsIn(['host', 'driver', 'technician'], {
    message: 'role must be host, driver, or technician',
  })
  role: string;
}
