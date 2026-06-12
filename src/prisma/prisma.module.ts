// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Global() // گلوبال کردن باعث می‌شود نیاز نباشد همه‌جا ایمپورتش کنید
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
