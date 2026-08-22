import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  slotNumber!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId!: number;
}
