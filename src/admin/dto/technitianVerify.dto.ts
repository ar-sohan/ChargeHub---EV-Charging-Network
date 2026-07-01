import { IsAlpha, IsEmail, IsNotEmpty, Length } from 'class-validator';

export class technicianDto {
  @IsAlpha()
  @IsNotEmpty()
  name: number | undefined;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must contain @ and a domain' })
  email: string | undefined;

  @IsNotEmpty()
  @Length(10)
  nidNumber: string | undefined;
}
