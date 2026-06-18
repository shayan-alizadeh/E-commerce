//(برای خطایی 500 و syntax error و ...)
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { sendErrorResponse } from '../util/error-response.util.js';

@Catch() // تمام خطاهایی که دو فیلتر قبلی نگرفتند به اینجا می‌رسند
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // ثبت خطای واقعی در کنسول سرور تا بتوانید باگ را پیدا کنید
    this.logger.error(
      `[Unhandled Exception] ${request.method} ${request.url}`,
      exception?.stack || exception,
    );

    const status = HttpStatus.INTERNAL_SERVER_ERROR; // 500
    const message = 'خطای پیش‌بینی نشده‌ای رخ داده، با پشتیبانی تماس بگیرید.';

    sendErrorResponse(response, request, status, message);
  }
}
