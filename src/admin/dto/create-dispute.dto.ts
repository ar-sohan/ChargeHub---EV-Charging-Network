import { IsString } from 'class-validator';

export class CreateDisputeDto {
  @IsString()
  subject: string;
}
