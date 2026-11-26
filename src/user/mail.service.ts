import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to ChargeHub EV',
      text: `Hello ${name},

Welcome to ChargeHub EV!

Your account has been created successfully.

Thank you.`,
    });

    return true;
  }

  async sendBookingConfirmationEmail(
    email: string,
    name: string,
    bookingId: number,
    slotNumber: string,
    amount: number,
    demo = false,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: `${demo ? "[DEMO] " : ""}Booking #${bookingId} confirmed - ChargeHub EV`,
      text: `Hello ${name},

Your ChargeHub EV booking has been confirmed.

Booking ID: #${bookingId}
Slot: ${slotNumber}
${demo ? "Demo payment simulated (no money charged)" : "Payment received"}: BDT ${amount}

Thank you for choosing ChargeHub EV.`,
    });

    return true;
  }
}

