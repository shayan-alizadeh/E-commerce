import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { roleType } from 'generated/prisma/enums.js';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const alreadyUser = await this.findByMobile(createUserDto.mobile, true);
      if (!alreadyUser) {
        return await this.prisma.users.create({
          data: createUserDto,
        });
      } else {
        throw new BadRequestException(
          'کاربری با این شماره موبایل در سیستم وجود دارد',
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async findAll(role?: roleType, limit: number = 10, page: number = 1) {
    try {
      return await this.prisma.users.findMany({
        where: { role: role },
        take: limit,
        skip: (page - 1) * limit,
      });
    } catch (error) {
      throw new NotFoundException(' Error Founding Users . ');
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.users.findUnique({
        where: { id: id },
      });
    } catch (error) {
      throw new NotFoundException(' Error Founding User . ');
    }
  }

  async findByMobile(mobile: string, checkExist: boolean = false) {
    const user = await this.prisma.users.findUnique({
      where: { mobile: mobile },
    });
    if (!checkExist) {
      if (!user) throw new NotFoundException(`'کاربر ${mobile} پیدا نشد .'`);
    }
    return user;
  }
  async findUserPermission(userId: number): Promise<string[]> {
    try {
      const permissions = await this.prisma.$queryRaw<{ name: string }[]>`
        -- بخش اول: گرفتن دسترسی‌هایی که از طریق نقش (Role) به کاربر داده شده
        SELECT p.name
        FROM permissions p
        INNER JOIN role_permissions rp ON p.id = rp.permission_id
        INNER JOIN user_roles ur ON rp.role_id = ur.role_id
        WHERE ur.user_id = ${userId}

        UNION

        -- بخش دوم: گرفتن دسترسی‌هایی که مستقیماً به خود کاربر داده شده
        SELECT p.name
        FROM permissions p
        INNER JOIN user_permissions up ON p.id = up.permission_id
        WHERE up.user_id = ${userId}
      `;

      // اگر کاربر وجود نداشته باشد یا دسترسی نداشته باشد، آرایه خالی برمی‌گردد که نیازی به خطا ندارد
      return permissions.map((p) => p.name);
    } catch (error) {
      // ۲. پرتاب یک خطای عمومی و امن برای کاربر نهایی (کد ۵۰۰)
      throw new InternalServerErrorException(
        'خطایی در پردازش سطح دسترسی‌های کاربر رخ داد. لطفاً با پشتیبانی تماس بگیرید.',
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.prisma.users.update({
        where: { id: id },
        data: {
          display_name: updateUserDto.display_name,
          role: updateUserDto.role,
        },
      });
    } catch (error) {
      throw new BadRequestException(' Error Updating User . ');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.users.delete({
        where: { id: id },
      });
    } catch (error) {
      throw new BadRequestException(' Error Deleting User . ');
    }
  }
}
