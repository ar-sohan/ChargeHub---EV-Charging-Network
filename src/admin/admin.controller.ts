import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller()
export class AdminController {
  constructor(private readonly appService: AdminService) {}

  @Get()
  getHello(): string {
    return 'Hello';
  }
}
