import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterseptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const now = Date.now();
    console.log(`Befor : ${now}`);
    return next.handle().pipe(
      tap(() => {
        console.log(`After : ${Date.now() - now} ms`);
      }),
    );
  }
}
