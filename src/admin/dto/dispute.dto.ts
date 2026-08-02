import { IsOptional, IsString } from 'class-validator';
export class CreateDisputeDto { @IsString() subject: string; }
export class CreateResolutionDto { @IsString() decision: string; @IsOptional() @IsString() note?: string; }
