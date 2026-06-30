import { Matches, IsIn, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9._%+-]+@aiub\.edu$/, {
    message: 'Email must be AIUB email',
  })
  email!: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z]).{6,}$/, {
    message: 'Password must contain one uppercase letter',
  })
  password!: string;

  @IsNotEmpty()
  @IsIn(['male', 'female'])
  gender!: string;

  @IsNotEmpty()
  @Matches(/^[0-9]+$/, {
    message: 'Phone must contain only numbers',
  })
  phone!: string;
}
