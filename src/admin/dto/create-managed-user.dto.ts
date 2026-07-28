import { IsString, IsEmail, IsIn } from 'class-validator';

export class CreateManagedUserDto {
  @IsString()
  name: string | undefined;

  @IsEmail()
  email: string | undefined;

  @IsIn(['host', 'driver', 'technician'], {
    message: 'role must be host, driver, or technician',
  })
  role: string | undefined;
}
