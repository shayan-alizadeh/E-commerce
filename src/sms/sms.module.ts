import { Module } from '@nestjs/common';
import { SmsService } from './sms.service.js';
import { SmsController } from './sms.controller.js';
import { BullModule } from '@nestjs/bull';
import { SmsProcessor } from './processor/send-sms.processor.js';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sms-queue',
    }),
  ],
  controllers: [SmsController],
  providers: [SmsService,SmsProcessor],
})
export class SmsModule {}
