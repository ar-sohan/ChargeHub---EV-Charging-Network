import { IsString, IsOptional } from 'class-validator';

export class CreateResolutionDto {
  @IsString()
  decision: string | undefined;

  @IsOptional()
  @IsString()
  note?: string;
}
