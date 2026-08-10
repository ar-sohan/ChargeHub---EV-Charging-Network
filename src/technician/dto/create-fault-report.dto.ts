import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateFaultReportDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  stationId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  faultType: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  severity: string;

  @IsDateString()
  reportDate: string;
}

export class UpdateFaultStatusDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  status: string;

  @IsOptional()
  @IsString()
  resolutionNote?: string;
}
