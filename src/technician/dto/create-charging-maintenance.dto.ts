import { IsString, IsNotEmpty, Matches, IsDateString } from 'class-validator';

export class CreateChargingMaintenanceDto {
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
  issue: string;

  @IsString()
  @IsNotEmpty()
  notes: string;

  @IsDateString({}, { message: 'maintenanceDate must be a valid date' })
  maintenanceDate: string;
}
