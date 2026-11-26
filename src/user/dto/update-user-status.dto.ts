import { IsIn } from 'class-validator';

export class UpdateUserStatusDto {
  @IsIn(['active', 'inactive', 'suspended'])
  status!: string;
}
