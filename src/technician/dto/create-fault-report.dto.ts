import {
  IsString,
  IsNotEmpty,
  Matches,
  IsDateString,
  IsUrl,
  IsOptional,
} from 'class-validator';

export class CreateFaultReportDto {
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
  faultType: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  severity: string;

  @IsDateString({}, { message: 'reportDate must be a valid date' })
  reportDate: string;

  @IsOptional()
  @IsUrl({}, { message: 'socialMediaLink must be a valid URL' })
  socialMediaLink?: string;
}

export class UpdateFaultStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  resolutionNote: string;
}
