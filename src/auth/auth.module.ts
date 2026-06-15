import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller.js'
import { APP_GUARD } from '@nestjs/core';
// import { PermissionGuard } from './guard/permission.guard.js';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION') },
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    // { provide: APP_GUARD, useClass: PermissionGuard },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
