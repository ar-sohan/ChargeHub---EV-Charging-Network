import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // THIS IS THE CRITICAL LINE NEEDED TO ACTIVATE VALIDATION:
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
