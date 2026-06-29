import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../Decorator/role.decorator';
import { roleType } from '@my-prisma/client';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<roleType[]>(
      ROLES_KEY,
      [context.getClass(), context.getHandler()],
    );
    if (!requiredRole) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const hasRole = requiredRole.includes(user.role);

    if (!hasRole)
      throw new ForbiddenException('شما اجازه دسترسی به این مسیر را ندارید .');

    return true;
  }
}
