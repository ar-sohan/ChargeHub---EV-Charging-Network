import { IsString, IsOptional } from 'class-validator';

export class CreateResolutionDto {
  @IsString()
  decision: string;

  @IsOptional()
  @IsString()
  note?: string;
}
