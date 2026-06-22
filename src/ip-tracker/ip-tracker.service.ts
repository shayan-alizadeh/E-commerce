import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service.js';

@Injectable()
export class IpTrackerService {
  private readonly MAX_REQUEST = 5;
  private readonly WINDOW_MINUTES = 1;
  private readonly BLOCK_MINUTES = 2;

  constructor(private readonly prisma: PrismaService) {}

  async track(ip: string) {
    // گرفتن زمان حال (همیشه بر اساس UTC)
    const now = new Date();

    // جستجوی رکورد آی‌پی
    let record = await this.prisma.ipRecord.findUnique({ where: { ip } });

    // ۱. اگر آی‌پی اصلا وجود نداشت، می‌سازیم و خارج می‌شویم
    if (!record) {
      await this.prisma.ipRecord.create({
        data: {
          ip,
          windowStart: now,
          requestCount: 1,
          isBlocked: false,
        },
      });
      // برای نمایش به وقت تهران در کنسول، فقط از متد toLocaleString استفاده کنید
      console.log(
        `${ip} اولین درخواست را ارسال کرد در ${now.toLocaleString('fa-IR')}`,
      );
      return;
    }

    // ۲. بررسی مسدود بودن کاربر
    if (record.isBlocked && record.blockUntil) {
      if (now < record.blockUntil) {
        // محاسبه زمان باقی‌مانده مسدودی (اختیاری، برای نمایش بهتر به کاربر)
        const remainMs = record.blockUntil.getTime() - now.getTime();
        const remainMin = Math.ceil(remainMs / 60000);

        // پرتاب خطای استاندارد 429 در NestJS
        throw new HttpException(
          `درخواست‌های شما بیش از حد مجاز است. شما برای ${remainMin} دقیقه محدود شده‌اید.`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      } else {
        // اگر زمان مسدودی تمام شده بود، رکورد باید کاملا ریست شود
        await this.prisma.ipRecord.update({
          where: { ip },
          data: {
            isBlocked: false,
            blockUntil: null,
            windowStart: now,
            requestCount: 1,
          },
        });
        return; // درخواست را مجاز می‌دانیم و خارج می‌شویم
      }
    }

    // ۳. اگر مسدود نیست، وضعیت پنجره زمانی را چک می‌کنیم
    const windowEnd = new Date(
      record.windowStart.getTime() + this.WINDOW_MINUTES * 60 * 1000,
    );

    if (now > windowEnd) {
      // زمان پنجره گذشته است، شروع یک پنجره جدید و ریست کردن شمارنده
      await this.prisma.ipRecord.update({
        where: { ip },
        data: {
          requestCount: 1,
          windowStart: now,
        },
      });
    } else {
      // زمان پنجره نگذشته است، بررسی سقف درخواست‌ها
      if (record.requestCount >= this.MAX_REQUEST) {
        // کاربر به سقف مجاز رسیده، باید مسدود شود
        const blockUntilTime = new Date(
          now.getTime() + this.BLOCK_MINUTES * 60 * 1000,
        );

        await this.prisma.ipRecord.update({
          where: { ip },
          data: {
            isBlocked: true,
            blockUntil: blockUntilTime,
          },
        });

        throw new HttpException(
          `رفتار اسپم تشخیص داده شد. شما برای ${this.BLOCK_MINUTES} دقیقه محدود شدید.`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      } else {
        // سقف مجاز پر نشده، فقط شمارنده را یکی بالا می‌بریم
        await this.prisma.ipRecord.update({
          where: { ip },
          data: {
            requestCount: { increment: 1 },
          },
        });
      }
    }
  }
}
