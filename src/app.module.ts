import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { TechnicianModule } from './technician/technician.module';

const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'rahat15496',
  database: 'chargehubEV',
  autoLoadEntities: true,
  synchronize: true,
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot(databaseConfig),

    UserModule,
    AdminModule,
    TechnicianModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
