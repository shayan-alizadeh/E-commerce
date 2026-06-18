//(برای ارور های دیتابیس)
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '../../generated/prisma/client.js'; // یا آدرس ایمپورت مخصوص خودتان
import { sendErrorResponse } from '../util/error-response.util.js';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.BAD_REQUEST;
    let message = 'خطای پردازش دیتابیس';

    if (exception.code === 'P2002') {
      status = HttpStatus.CONFLICT;
      message = 'مقدار وارد شده تکراری است.';
    } else if (exception.code === 'P2025') {
      status = HttpStatus.NOT_FOUND;
      message = 'رکورد یافت نشد.';
    } else if (exception.code === 'P2003') {
      status = HttpStatus.BAD_REQUEST;
      message = 'اطلاعات مرتبط (مثل آیدی کاربر یا محصول) در سیستم وجود ندارد.';
    }
    sendErrorResponse(response, request, status, message);
  }
}
