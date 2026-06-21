import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  HttpException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { PrismaService } from 'src/prisma/prisma.service.js';
// import { PaymentOrderDto } from './dto/payment-order.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { orderStatus } from '../../generated/prisma/enums.js';
// import { VerifyPaymentDto } from './dto/verify-payment.dto';
// import { EventEmitter2 } from '@nestjs/event-emitter';

export interface ZibalResponseData {
  trackId: number;
  result: number;
  message: string;
}

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    // private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { user_id, address_id } = createOrderDto;

    return this.prisma.$transaction(async (tx) => {
      const selectedAddress = await tx.addresses.findFirst({
        where: {
          id: address_id,
          user_id: user_id, // با اضافه کردن این شرط، همزمان امنیت هم چک می‌شود
        },
      });

      if (!selectedAddress) {
        throw new BadRequestException(
          'آدرس انتخاب شده یافت نشد یا متعلق به شما نیست.',
        );
      }

      // ۲. ساخت Snapshot از آدرس
      const fullAddressSnapshot = `استان: ${selectedAddress.province}، شهر: ${selectedAddress.city}، نشانی: ${selectedAddress.address}، کد پستی: ${selectedAddress.postal_code}، موبایل گیرنده: ${selectedAddress.reciver_mobile}`;

      const basketItems = await tx.basket_item.findMany({
        where: { user_id: user_id },
        include: {
          product: true,
        },
      });

      if (basketItems.length === 0) {
        throw new NotFoundException('سبد خرید شما خالی است.');
      }

      // ۴. محاسبه قیمت کل و ساختار اقلام
      let calculatedTotalPrice = 0;
      const orderItemsData = basketItems.map((item) => {
        const currentProductPrice = Number(item.product.price);

        calculatedTotalPrice += currentProductPrice * item.quantity;

        return {
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: currentProductPrice,
        };
      });

      // ۵. ثبت سفارش اصلی و اقلام به صورت تو در تو
      const newOrder = await tx.orders.create({
        data: {
          user_id: user_id,
          address_id: address_id,
          totalPrice: calculatedTotalPrice,
          status: 'pending',
          address: fullAddressSnapshot,
          item: {
            create: orderItemsData,
          },
        },
        include: {
          item: true,
        },
      });

      // ۶. خالی کردن سبد خرید کاربر با استفاده از tx
      await tx.basket_item.deleteMany({
        where: {
          user_id: user_id,
        },
      });

      return newOrder;
    });
  }

  findAll() {
    return this.prisma.orders.findMany({
      orderBy: {
        created_at: 'desc',
      },
      include: {
        item: true,
        user: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  async findOne(orderId: number) {
    const order = await this.prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        item: true,
        user: {
          select: { id: true }, // فقط آیدی کاربر رو برای چک کردن امنیت می‌گیریم
        },
      },
    });

    if (!order) {
      throw new NotFoundException('سفارش مورد نظر یافت نشد');
    }

    return order;
  }

  async updateOrderStatus(orderId: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.orders.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('سفارشی با این شناسه یافت نشد');
    }
    const orderUpdate = await this.prisma.orders.update({
      where: { id: orderId },
      data: {
        status: updateOrderDto.status,
      },
    });

    this.eventEmitter.emit('factor-create', orderUpdate);
    this.eventEmitter.emit('sms-send', {
      mobile: '09305806033',
      message: `سفارش شماره ${orderUpdate.id} با موفقیت انجام شد .`,
    });

    return orderUpdate;
  }

  async requestPayment(paymentOrderDto: PaymentOrderDto) {
    const { orderId } = paymentOrderDto;
    const order = await this.prisma.orders.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException('سفارش یافت نشد .');
    }
    if (order.status !== orderStatus.pending) {
      throw new BadRequestException(
        'این سفارش در انتظار پرداخت نیست و قابلیت پرداخت ندارد',
      );
    }
    const amountInRial = order.totalPrice * 10;

    try {
      const response: AxiosResponse<ZibalResponseData> = await firstValueFrom(
        this.httpService.post<ZibalResponseData>(
          'https://gateway.zibal.ir/v1/request',
          {
            merchant: 'zibal',
            amount: amountInRial,
            callbackUrl: 'http://localhost:3000/payment/verify',
            orderId: order.id.toString(),
          },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      );

      if (response.data.result !== 100) {
        throw new BadRequestException('خطا در ارتباط با درگاه پرداخت');
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async verifyPayment(trackId: number, verifyPaymentDto: VerifyPaymentDto) {
    const { orderId } = verifyPaymentDto;
    try {
      interface ZibalVerifyResponse {
        paidAt: string;
        amount: number;
        result: number;
        status: number;
        refNumber: number;
        description: string;
        cardNumber: string;
        orderId: string;
        message: string;
      }
      const response: AxiosResponse<ZibalVerifyResponse> = await firstValueFrom(
        this.httpService.post<ZibalVerifyResponse>(
          'https://gateway.zibal.ir/v1/verify',
          {
            merchant: 'zibal',
            trackId: trackId,
          },
        ),
      );

      const data = response.data;

      if (data.result !== 100 && data.result !== 201) {
        // اگر پرداخت ناموفق بود، می‌توانید وضعیت سفارش را در دیتابیس CANCELLED کنید

        await this.prisma.orders.update({
          where: { id: orderId },
          data: { status: orderStatus.cancelled },
        });

        throw new BadRequestException(`تراکنش ناموفق بود: ${data.message}`);
      }

      await this.prisma.orders.update({
        where: { id: orderId },
        data: {
          status: orderStatus.completed,
        },
      });

      return {
        success: true,
        message: 'پرداخت با موفقیت انجام شد.',
        refNumber: data.refNumber,
        cardNumber: data.cardNumber,
        paidAt: data.paidAt,
      };
    } catch (error) {
      console.error('Zibal Verify Error:', error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('مشکلی در تایید پرداخت پیش آمد.');
    }
  }
}
