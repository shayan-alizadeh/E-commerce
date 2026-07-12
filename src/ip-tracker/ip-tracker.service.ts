import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service.js';

@Injectable()
export class IpTrackerService {
  private readonly MAX_REQUEST = 5;
  private readonly WINDOW_MINUTES = 1;
  private readonly BLOCK_MINUTES = 2;

  constructor(private readonly redisService: RedisService) {}

  async track(ip: string): Promise<void> {
    const key = `rate_limit:${ip}`;
    const blockKey = `blocked:${ip}`;

    const isBlocked = await this.redisService.get(blockKey);

    if (isBlocked) {
      throw new HttpException('شما مسدود هستید', HttpStatus.TOO_MANY_REQUESTS);
    }

    const currentCount = await this.redisService.incr(key);

    if (currentCount === 1) {
      await this.redisService.expire(key, this.WINDOW_MINUTES * 60);
    }

    if (currentCount > this.MAX_REQUEST) {
      await this.redisService.set(blockKey, 'true', this.BLOCK_MINUTES * 60);

      throw new HttpException(
        'به‌دلیل درخواست‌های بیش از حد، موقتاً مسدود شدید',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }
}
