import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);

  // دریافت HttpAdapter برای پاس دادن به فیلتر
  const { httpAdapter } = app.get(HttpAdapterHost);

  // ثبت فیلتر گلوبال برای خطاهای پریسما
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
}
bootstrap();
