import { IsString, IsNotEmpty, Matches, IsDateString } from 'class-validator';

export class CreateSafetyCheckDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'technicianName must not contain any numbers',
  })
  technicianName: string;

  @IsString()
  @IsNotEmpty()
  stationId: string;

  @IsString()
  @IsNotEmpty()
  checkType: string;

  @IsString()
  @IsNotEmpty()
  result: string;

  @IsString()
  @IsNotEmpty()
  remarks: string;

  @IsDateString({}, { message: 'reportDate must be a valid date' })
  reportDate: string;
}
