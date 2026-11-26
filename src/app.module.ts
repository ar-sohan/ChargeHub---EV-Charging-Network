import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { TechnicianModule } from './technician/technician.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database settings come from the environment. DATABASE_URL (as given by
    // Neon, Supabase, Render, etc.) wins over the individual DB_* values.
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('DATABASE_URL');
        const ssl = config.get<string>('DB_SSL', url ? 'true' : 'false') === 'true';
        return {
          type: 'postgres' as const,
          ...(url
            ? { url }
            : {
                host: config.get<string>('DB_HOST', 'localhost'),
                port: Number(config.get<string>('DB_PORT', '5432')),
                username: config.get<string>('DB_USERNAME', 'postgres'),
                password: config.get<string>('DB_PASSWORD', ''),
                database: config.get<string>('DB_NAME', 'chargehubEV'),
              }),
          ssl: ssl ? { rejectUnauthorized: false } : false,
          autoLoadEntities: true,
          // Auto-creating tables is handy for this project; set DB_SYNCHRONIZE=false
          // once real data lives in the database.
          synchronize: config.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
        };
      },
    }),

    // One JWT setup for admin, user and technician tokens. Each token carries a
    // role, and each guard checks that role.
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret && config.get<string>('NODE_ENV') === 'production') {
          throw new Error('JWT_SECRET must be set in production');
        }
        return {
          secret: secret || 'dev-only-insecure-secret',
          signOptions: { expiresIn: (config.get<string>('JWT_EXPIRES_IN') || '1d') as any },
        };
      },
    }),

    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST') || 'smtp.gmail.com',
          port: Number(config.get<string>('MAIL_PORT')) || 587,
          secure: Number(config.get<string>('MAIL_PORT')) === 465,
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from:
            config.get<string>('MAIL_FROM') ||
            `ChargeHub EV <${config.get<string>('MAIL_USER')}>`,
        },
      }),
    }),

    UserModule,
    AdminModule,
    TechnicianModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
