import { IsAlpha, IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class technicianDto {
  @IsAlpha()
  @IsNotEmpty()
  name: number | undefined;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must contain @ and a domain' })
  email: string | undefined;

  @Matches(/^\d{10}$/, { message: 'NID must be a 10-digit number' })
  @IsNotEmpty()
  nidNumber: number | undefined;
}
