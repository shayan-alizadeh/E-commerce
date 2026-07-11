import {
  Global,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { error } from 'console';
import  {Redis} from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;

  onModuleInit() {
    this.client = new Redis({
      host: 'localhost',
      port: 6379,
    });
    this.client.on('connect', () => {
      console.log('Connected to Redis ...');
    });
    this.client.on('error', () => {
      console.log('Redis Error .', error);
    });
  }
  async set(key: string, value: string, ttl?: number) {
    if (ttl) await this.client.set(key, value, 'EX', ttl);
    await this.client.set(key, value);
  }
  async get(key: string) {
    return this.client.get(key);
  }
  async del(key: string) {
    await this.client.del(key);
  }
  onModuleDestroy() {
    this.client.quit();
  }
}
