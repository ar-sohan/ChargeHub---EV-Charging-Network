import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateBookingDto {
  @IsOptional()
  @IsString()
  slotNumber?: string;

  @IsOptional()
  @IsString()
  @IsIn(['booked', 'confirmed', 'cancelled', 'completed'])
  status?: string;
}
