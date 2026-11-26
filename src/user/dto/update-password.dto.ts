import { IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @Length(6, 20)
  currentPassword!: string;

  @IsString()
  @Length(6, 20)
  password!: string;
}

