import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AddressModule } from './address/address.module.js';
import { TicketModule } from './ticket/ticket.module.js';
import { CommentModule } from './comment/comment.module.js';
import { ProductModule } from './product/product.module.js';
import { CategoryModule } from './category/category.module.js';
import { OrderModule } from './order/order.module.js';
import { IpTrackerModule } from './ip-tracker/ip-tracker.module.js';
import { IpTrackerMiddleware } from './ip-tracker/ip-tracker.middleware.js';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard.js';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule,
    AddressModule,
    TicketModule,
    CommentModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    IpTrackerModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpTrackerMiddleware).forRoutes('*');
  }
}
