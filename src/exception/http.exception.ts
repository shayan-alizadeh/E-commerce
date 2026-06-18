//(برای ارورهای 400, 404, 401 و ...)
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { sendErrorResponse } from '../util/error-response.util.js';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();
    const message = exceptionResponse.message || exceptionResponse;

    sendErrorResponse(response, request, status, message);
  }
}
