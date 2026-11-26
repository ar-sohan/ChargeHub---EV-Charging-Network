import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Min,
  Max,
  IsIn,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Matches(/^01\d{9}$/, {
    message:
      'phone must be an 11-digit Bangladesh mobile number starting with 01',
  })
  phone!: string;

  @IsString()
  @Length(6, 20)
  password!: string;

  @Type(() => Number)
  @IsInt()
  @Min(18)
  @Max(100)
  age!: number;

  @IsString()
  @IsIn(['male', 'female'])
  gender!: string;
}
