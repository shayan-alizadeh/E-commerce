import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service.js';
import { RedisService } from 'src/redis/redis.service.js';
@Injectable()
export class IpTrackerService {
  private readonly MAX_REQUEST = 5;
  private readonly WINDOW_MINUTES = 1;
  private readonly BLOCK_MINUTES = 2;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async track(ip: string) {
    const key = `rate_limit:${ip}`;
    const blockKey = `blocked:${ip}`;

    // بررسی مسدودی
    const isBlocked = await this.redisService.get(blockKey);
    if (isBlocked) {
      throw new HttpException('شما مسدود هستید', HttpStatus.TOO_MANY_REQUESTS);
    }

    // افزایش شمارنده (اتمیک و ضد همزمانی)
    const currentCount = await this.redisService.incr(key);

    // اگر اولین درخواست است، برایش زمان انقضا (مثلاً ۱ دقیقه) می‌گذاریم
    if (currentCount === 1) {
      await this.redisService.expire(key, 60); // 60 ثانیه
    }

    // اگر سقف را رد کرد، او را بلاک می‌کنیم
    if (currentCount > 10) {
      await this.redisService.set(blockKey, 'true', 'EX', 120); // بلاک برای 120 ثانیه
      throw new HttpException('بلاک شدید', HttpStatus.TOO_MANY_REQUESTS);
    }
  }
}
