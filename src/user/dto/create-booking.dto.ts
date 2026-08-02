import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  slotNumber!: string;

  @IsString()
  @IsIn(['booked', 'confirmed', 'cancelled', 'completed'])
  status!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId!: number;
}
