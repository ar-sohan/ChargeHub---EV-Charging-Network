import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSafetyCheckDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  stationId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  checkType: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  result: string;

  @IsString()
  @IsNotEmpty()
  remarks: string;

  @IsDateString()
  reportDate: string;
}
