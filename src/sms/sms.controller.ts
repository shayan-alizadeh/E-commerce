import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SmsService } from './sms.service.js';
import { SmsDto } from './dto/send-sms.dto.js';
import { Public } from 'src/auth/decorator/public.decorator.js';

@Public()
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send-sms')
  async sendSms(@Body() smsDto: SmsDto) {
    await this.smsService.sendMultiSms(smsDto.mobile, smsDto.message);
    return 'redis به درستی تست شد';
  }
}
