import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AddressModule } from './address/address.module.js';
import { TicketModule } from './ticket/ticket.module.js';
import { CommentModule } from './comment/comment.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, UserModule, AuthModule, AddressModule, TicketModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
