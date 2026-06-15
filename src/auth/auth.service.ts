import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { roleType } from '../../generated/prisma/enums.js';
import { PrismaService } from 'src/prisma/prisma.service.js';

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
}
  