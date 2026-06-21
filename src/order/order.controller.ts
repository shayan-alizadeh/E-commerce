import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import type { Response } from 'express';
import { PaymentOrderDto } from './dto/payment-order.dto.js';
import { VerifyPaymentDto } from './dto/verify-payment.dto.js';
// import { ApiBearerAuth } from '@nestjs/swagger';

// @ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Res() res: Response) {
    const order = await this.orderService.create(createOrderDto);
    return res.status(HttpStatus.CREATED).json({
      success: true,
      body: order,
      message: ` Order Created `,
      status: HttpStatus.CREATED,
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const order = await this.orderService.findAll();
    return res.status(HttpStatus.OK).json({
      success: true,
      body: order,
      message: ` Orders Found `,
      status: HttpStatus.OK,
    });
  }

  @Get(':id')
  async findOne(@Param('id') orderId: string, @Res() res: Response) {
    const order = await this.orderService.findOne(+orderId);
    return res.status(HttpStatus.OK).json({
      success: true,
      body: order,
      message: ` Order Found `,
      status: HttpStatus.OK,
    });
  }

  @Patch(':id')
  async updateOrderStatus(
    @Param('id') orderId: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @Res() res: Response,
  ) {
    const order = await this.orderService.updateOrderStatus(
      +orderId,
      updateOrderDto,
    );
    return res.status(HttpStatus.OK).json({
      success: true,
      message: ` Order Status Updeted `,
      status: HttpStatus.OK,
    });
  }
  @Post('/request-payment')
  async requestPayment(
    @Body() paymentOrderDto: PaymentOrderDto,
    @Res() res: Response,
  ) {
    const paymentOrder =
      await this.orderService.requestPayment(paymentOrderDto);
    return res.status(HttpStatus.CREATED).json({
      success: true,
      body: {
        ...paymentOrder,
        payment_url: `https://gateway.zibal.ir/start/${paymentOrder.trackId}`,
      },
      message: ` لینک پرداخت با موفقیت ساخته شد . `,
      status: HttpStatus.CREATED,
    });
  }

  @Post('/verify-payment')
  async verifyPayment(
    @Body() verifyPaymentDto: VerifyPaymentDto,
    @Query('trackId') trackId: number,
    @Res() res: Response,
  ) {
    const verifypaymentOrder = await this.orderService.verifyPayment(
      +trackId,
      verifyPaymentDto,
    );
    return res.status(HttpStatus.CREATED).json({
      success: true,
      body: verifypaymentOrder,
      message: ` لینک پرداخت با موفقیت ساخته شد . `,
      status: HttpStatus.CREATED,
    });
  }
}
