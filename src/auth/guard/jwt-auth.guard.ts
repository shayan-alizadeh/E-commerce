import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator.js';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) { //برای خواندن متادیتا از reflector استفاده میکنیم
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
  handleRequest(err: any, user: any, info: Error, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException('توکن شما نامعتبر است .');
    }

    console.log(user);
    console.log('--------------------------');
    console.log(info);
    console.log('--------------------------');
    console.log(context);
    console.log('--------------------------');
    return user;
  }
}
