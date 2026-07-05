import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service.js';
import { PERMISSION_KEY } from '../decorator/permission.decorator.js';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<string[]>(
      PERMISSION_KEY,
      [context.getClass(), context.getHandler()],
    );
    if (!requiredPermission) return true;

    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;

    const userPermission = await this.authService.getUserPermission(userId);

    const hasPermission = requiredPermission.every((permission) =>
      userPermission.includes(permission),
    );
    if (!hasPermission) throw new ForbiddenException('شما اجازه ورود ندارید .');

    return true;
    // این کد طبق بخش بعدا اضافه شد ownership Guard
    //   for (const permission of requiredPermission) {
    //     if (permission.endsWith(':own')) {
    //       const [resource, action] = permission.split(':');
    //       const paramId = request.params['id'];
    //       const isOwner = await this.checkOwnership(resource, paramId, userId);
    //       if (isOwner) return true;
    //       else
    //         throw new ForbiddenException(
    //           'شما دسترسی این عملیات را رو این منبع ندارید .',
    //         );
    //     }
    //   }

    //   return true;
    // }
    // // این کد طبق بخش بعدا اضافه شد ownership Guard
    // private cleanOwn(str: string) {
    //   if (str.endsWith(':own')) {
    //     return str.slice(0, -4);
    //   }
    //   return str;
    // }
    // // این کد طبق بخش بعدا اضافه شد ownership Guard
    // private async checkOwnership(
    //   resource: string,
    //   resourceId: number,
    //   userId: number,
    // ) {
    //   //در اینجا ریسورس آدرس در نظر گرفته شده که می توان ریسورس های دیگه ایی که مورد نیاز
    //   //هست هم اضافه شود
    //   if (resource === 'address') {
    //     const address = await this.prisma.addresses.findUnique({
    //       where: { id: resourceId },
    //       include: {
    //         user: true,
    //       },
    //     });
    //     if (!address) return false;
    //     return address.user.id === userId;
    //   } else {
    //     return false;
    //   }
  }
}
