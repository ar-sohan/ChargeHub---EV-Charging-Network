import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMaintenanceTaskDto {
  @IsIn(['Charging', 'Hardware'])
  category: 'Charging' | 'Hardware';

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  stationId: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  deviceId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  deviceType?: string;

  @IsString()
  @IsNotEmpty()
  issue: string;

  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsDateString()
  maintenanceDate: string;
}

export class UpdateMaintenanceTaskDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
