import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class SmsListener {
  @OnEvent('sms-send')
  handlerSms(payload: { mobile: string; message: string }) {
    console.log(`Sms send to : ${payload.mobile} Message : ${payload.message}`);
  }
}
