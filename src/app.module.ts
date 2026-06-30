import { Module } from '@nestjs/common';
import { TechnicianModule } from './technician/technician.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';


@Module({

  imports: [TechnicianModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
