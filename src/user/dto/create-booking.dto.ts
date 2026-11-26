import { Transform } from 'class-transformer';
import { IsString, Matches } from 'class-validator';

export class CreateBookingDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value)
  @IsString()
  @Matches(/^A-[1-9][0-9]*$/, {
    message: 'Select a valid charging slot',
  })
  slotNumber!: string;
}



