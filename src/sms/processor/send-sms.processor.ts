import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';

// ('queue name')
@Processor('sms-queue')
export class SmsProcessor {
  // ('process name')
  @Process('send-sms')
  async handleSend(job: Job<{ mobile: string; message: string }>) {
    console.log(
      `Sending sms to ${job.data.mobile} with messsage : ${job.data.message}`,
    );
    let number = Math.random();
    if (number < 0.5) {
      console.log('sms sending failed . will retry ...');
      throw new Error('sms sending error .');
    } else {
      console.log('sms sending succesfully');
      return true;
    }
  }
}
