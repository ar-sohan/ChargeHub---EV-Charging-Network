import { Equals } from 'class-validator';

export class UpdateBookingDto {
  @Equals('cancelled', { message: 'Only cancellation is allowed' })
  status!: 'cancelled';
}
