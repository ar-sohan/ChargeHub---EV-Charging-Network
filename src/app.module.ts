import { Module } from '@nestjs/common';
import { TechnicianModule } from './technician/technician.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TechnicianModule, UserModule, 
    TypeOrmModule.forRoot(
      { type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'EV_Charging_Network',
      autoLoadEntities: true,
      synchronize: true,
      } ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
