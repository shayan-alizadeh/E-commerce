import { Module } from '@nestjs/common';
import { SmsService } from './sms.service.js';
import { SmsController } from './sms.controller.js';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [BullModule.registerQueue({
    name : 'sms-queue'
  })],
  controllers: [SmsController],
  providers: [SmsService],
})
export class SmsModule {}
