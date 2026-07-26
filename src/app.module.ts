import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
import { TechnicianModule } from './technician/technician.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',

      host: 'localhost',
      port: 5432,

      username: 'postgres',
      password: 'rahat15496', // এখানে তোমার PostgreSQL password দাও

      database: 'chargehubEV', // এখানে তোমার database name দাও

      autoLoadEntities: true,

      // Development এর জন্য
      synchronize: true,
    }),

    UserModule,
    TechnicianModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
