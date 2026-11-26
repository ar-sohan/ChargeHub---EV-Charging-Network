import { IsString, IsNotEmpty, Matches, IsDateString } from 'class-validator';

export class CreateHardwareMaintenanceDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'technicianName must not contain any numbers',
  })
  technicianName: string;

  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsString()
  @IsNotEmpty()
  deviceType: string;

  @IsString()
  @IsNotEmpty()
  problem: string;

  @IsString()
  @IsNotEmpty()
  action: string;

  @IsDateString({}, { message: 'inspectionDate must be a valid date' })
  inspectionDate: string;
}
