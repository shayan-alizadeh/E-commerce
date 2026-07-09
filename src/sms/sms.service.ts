import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class SmsService {
  constructor(@InjectQueue('sms-queue') private smsQueue: Queue) {}

  sendMultiSms(mobiles: string[], message: string) {
    mobiles.forEach((mobile, index) => {
      this.smsQueue.add(
        //process name
        'send-sms',
        //data
        { mobile, message },
        //options
        {
          // attempts: 3,
          // backoff: 5000,
          delay: (index + 1) * 5000,
          removeOnComplete: true,
          removeOnFail: false,
        },
      );
    });
  }
}
