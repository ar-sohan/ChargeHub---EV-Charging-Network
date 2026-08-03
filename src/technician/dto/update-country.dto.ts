import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateCountryDto {

  @IsString()
  @IsNotEmpty({ message: 'country must not be empty' })
  @MaxLength(30, { message: 'country must be 30 characters or fewer' })
  country: string;

}
