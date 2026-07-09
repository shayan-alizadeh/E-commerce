import { Module } from '@nestjs/common';
import { SmsService } from './sms.service.js';
import { SmsController } from './sms.controller.js';
import { BullModule } from '@nestjs/bull';
import { SmsProcessor } from './processor/send-sms.processor.js';
import { SmsListener } from './listener/send-sms.listener.js';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sms-queue',
    }),
  ],
  controllers: [SmsController],
  providers: [SmsService,SmsProcessor,SmsListener],
})
export class SmsModule {}
