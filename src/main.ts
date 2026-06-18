import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './exception/global.exception.js';
import { HttpExceptionFilter } from './exception/http.exception.js';
import { PrismaExceptionFilter } from './exception/prisma.exception.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(
    new GlobalExceptionFilter(),
    new HttpExceptionFilter(),
    new PrismaExceptionFilter(),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
