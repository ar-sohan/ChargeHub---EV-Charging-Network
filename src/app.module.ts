import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
<<<<<<< HEAD
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule],
=======

@Module({
  imports: [],
>>>>>>> c94fadfbd1e64452eb32c90eb4db527053f3d7a0
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
