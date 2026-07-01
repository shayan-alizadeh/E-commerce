import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { roleType } from '../../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(mobile: string, display_name: string, password: string) {
    const existUser = await this.prisma.users.findFirst({
      where: { mobile },
    });
    if (existUser) throw new ForbiddenException('این شماره از قبل ثبت شده است');

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.create({
      mobile,
      display_name,
      password: hashedPassword,
      role: roleType.user,
    });
  }
  async login(mobile: string, password: string) {
    const user = await this.userService.findByMobile(mobile);

    if (!user) {
      throw new UnauthorizedException('شماره موبایل یا رمز عبور اشتباه است');
    }

    if (!(await bcrypt.compare(password, user?.password))) {
      throw new UnauthorizedException('شماره موبایل یا رمز عبور اشتباه است');
    }
    const payload = {
      sub: user?.id,
      mobile: user?.mobile,
      display_name: user?.display_name,
      role: user?.role,
    };
    const token = this.jwtService.sign(payload);
    return {
      accessToken: token,
    };
  }

  async getUserPermission(userId: number) {
    const userPermission = await this.userService.findOne(userId);
    if (!userPermission) {
      throw new NotFoundException('کاربر مد نظر یافت نشد ');
    }
    const permissions = await this.userService.findUserPermission(userId);

    // ۳. برگرداندن مستقیم نتیجه (دیگر نیازی به Set و map نیست)
    return permissions;
  }

  async createRole(name: string) {
    const role = await this.prisma.roles.create({
      data: { name: name },
    });
    return role;
  }

  async createPermission(name: string): Promise<{ name: string }> {
    const role = await this.prisma.permissions.create({
      data: { name: name },
      select: { name: true },
    });
    return role;
  }

  async addRoleToUser(userId: number, roleId: number) {
    const role = await this.prisma.roles.findUnique({
      where: { id: roleId },
    });
    if (!role) throw new NotFoundException('نقش وارد شده وجود ندارد .');

    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('کاربر مورد نظر یافت نشد .');

    const userRole = await this.prisma.user_role.findUnique({
      where: { user_id_role_id: { user_id: userId, role_id: roleId } },
    });

    if (userRole)
      throw new ConflictException('این نقش از قبل برای این کاربر ثبت شده است.');

    return this.prisma.user_role.create({
      data: {
        user_id: userId,
        role_id: roleId,
      },
    });
  }

  async addPermissionToRole(permissionId: number, roleId: number) {
    const foundPermission = await this.prisma.permissions.findUnique({
      where: { id: permissionId },
    });
    if (!foundPermission)
      throw new NotFoundException('سطح دسترسی مورد نظر یافت نشد .');

    const role = await this.prisma.roles.findUnique({
      where: { id: roleId },
    });
    if (!role) throw new NotFoundException('نقش مورد نظر یافت نشد .');

    const permissionRole = await this.prisma.role_permission.findUnique({
      where: {
        role_id_permission_id: { role_id: roleId, permission_id: permissionId },
      },
    });

    if (permissionRole)
      throw new ConflictException(
        'این سطح دسترسی از قبل برای این نقش ثبت شده است.',
      );

    return this.prisma.role_permission.create({
      data: {
        role_id: roleId,
        permission_id: permissionId,
      },
    });
  }

  async addPermissionToUser(permissionId: number, userId: number) {
    const foundPermission = await this.prisma.permissions.findUnique({
      where: { id: permissionId },
    });
    if (!foundPermission)
      throw new NotFoundException('سطح دسترسی مورد نظر یافت نشد .');

    const foundUser = await this.prisma.users.findUnique({
      where: { id: userId },
    });
    if (!foundUser) throw new NotFoundException('کاربر مورد نظر یافت نشد .');

    const permissionUser = await this.prisma.user_permission.findUnique({
      where: {
        user_id_permission_id: { user_id: userId, permission_id: permissionId },
      },
    });

    if (permissionUser)
      throw new ConflictException(
        'این سطح دسترسی از قبل برای این کاربر ثبت شده است.',
      );

    return this.prisma.user_permission.create({
      data: {
        user_id: userId,
        permission_id: permissionId,
      },
    });
  }
}
  