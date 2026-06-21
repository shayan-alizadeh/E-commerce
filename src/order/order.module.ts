import { Module } from '@nestjs/common';
import { OrderService } from './order.service.js';
import { OrderController } from './order.controller.js';
import { HttpModule } from '@nestjs/axios';
// import { FactorListener } from './listener/factor-create.listener';

@Module({
  imports: [HttpModule],
  controllers: [OrderController],
  providers: [OrderService, FactorListener],
})
export class OrderModule {}
