import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // CORS_ORIGIN is a comma-separated list of allowed frontend URLs, for example
  // "http://localhost:5123,https://chargehub.vercel.app". Unset means allow all.
  const origins = process.env.CORS_ORIGIN?.split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({ origin: origins?.length ? origins : true });
  // Hosts such as Render pass the port to listen on in PORT.
  await app.listen(Number(process.env.PORT) || 3000);
}
void bootstrap();
