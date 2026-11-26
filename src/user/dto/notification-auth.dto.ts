import { IsString, Matches } from 'class-validator';

export class NotificationAuthDto {
  @IsString()
  @Matches(/^[0-9]+[.][0-9]+$/)
  socket_id!: string;

  @IsString()
  @Matches(/^private-user-[1-9][0-9]*$/)
  channel_name!: string;
}
