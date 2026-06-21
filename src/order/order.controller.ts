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
  ParseIntPipe,
} from '@nestjs/common';
import { OrderService } from './order.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import type { Response } from 'express';
import { PaymentOrderDto } from './dto/payment-order.dto.js';
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
    // دریافت اطلاعات تراکنش از سرویس
    const paymentData = await this.orderService.requestPayment(paymentOrderDto);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      body: paymentData,
      message: 'لینک پرداخت با موفقیت ساخته شد.',
      status: HttpStatus.CREATED, // کد 201
    });
  }

  @Post('/verify-payment')
  async verifyPayment(
    @Query('trackId', ParseIntPipe) trackId: number,
    @Res() res: Response,
  ) {
    // ارسال trackId به سرویس برای پیدا کردن سفارش و تایید پرداخت
    const verifypaymentData = await this.orderService.verifyPayment(trackId);

    return res.status(HttpStatus.OK).json({
      success: true,
      body: verifypaymentData,
      message: 'پرداخت با موفقیت تایید شد.',
      status: HttpStatus.OK,
    });
  }
}
