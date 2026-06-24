import { Module } from '@nestjs/common';
import { TechnicianModule } from './technician/technician.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TechnicianModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
