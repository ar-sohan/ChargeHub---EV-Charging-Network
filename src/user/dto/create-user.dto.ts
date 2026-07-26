import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Min,
  Max,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;

  @IsInt()
  @Min(18)
  @Max(100)
  age: number;

  @IsString()
  @IsIn(['male', 'female'])
  gender: string;
}
