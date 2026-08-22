import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateBookingDto {
  @IsOptional()
  @IsString()
  slotNumber?: string;

  @IsOptional()
  @IsString()
  @IsIn(['pending_payment', 'cancelled', 'completed'])
  status?: string;
}
