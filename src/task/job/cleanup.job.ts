import { Injectable } from '@nestjs/common';

@Injectable()
export class CleanUpJob {
  cleanOtp() {
    console.log('Cleaning');
  }
}
