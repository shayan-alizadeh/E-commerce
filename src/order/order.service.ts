import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  HttpException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { PrismaService } from 'src/prisma/prisma.service.js';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { orderStatus } from '../../generated/prisma/enums.js';
import { PaymentOrderDto } from './dto/payment-order.dto.js';
import { ConfigService } from '@nestjs/config';
// import { EventEmitter2 } from '@nestjs/event-emitter';

export interface ZibalResponseData {
  trackId: number;
  result: number;
  message: string;
}

export interface ZibalVerifyResponse {
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

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
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

  async updateOrderStatus(order_id: number, updateOrderDto: UpdateOrderDto) {
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
    const { order_id } = paymentOrderDto;

    const order = await this.prisma.orders.findUnique({
      where: { id: order_id },
    });

    if (!order) {
      throw new NotFoundException('سفارش یافت نشد.');
    }

    if (order.status !== 'pending') {
      throw new BadRequestException(
        'این سفارش در انتظار پرداخت نیست و قابلیت پرداخت ندارد.',
      );
    }

    const amountInRial = order.totalPrice * 10;

    // خواندن اطلاعات حساس و داینامیک از فایل .env
    const merchantId = this.configService.get<string>(
      'ZIBAL_MERCHANT',
      'zibal',
    );
    const callbackUrl = this.configService.get<string>('PAYMENT_CALLBACK_URL');

    // درخواست به درگاه زیبال
    const { data } = await firstValueFrom<AxiosResponse<ZibalResponseData>>(
      this.httpService
        .post<ZibalResponseData>(
          'https://gateway.zibal.ir/v1/request',
          {
            merchant: merchantId,
            amount: amountInRial,
            callbackUrl: callbackUrl,
            orderId: order.id.toString(),
          },
          { headers: { 'Content-Type': 'application/json' } },
        )
        .pipe(
          // مدیریت خطاهای احتمالی از سمت سرور زیبال (مثل تایم‌اوت یا قطعی اینترنت)
          catchError((error) => {
            this.logger.error(
              'خطا در ارتباط با سرور زیبال:',
              error.response?.data || error.message,
            );
            throw new InternalServerErrorException(
              'در حال حاضر امکان ارتباط با درگاه پرداخت وجود ندارد.',
            );
          }),
        ),
    );

    // اگر زیبال درخواست را قبول نکند
    if (data.result !== 100) {
      this.logger.error(`زیبال کد خطای ${data.result} را برگرداند.`);
      throw new BadRequestException(
        `خطا در ایجاد تراکنش. کد خطا: ${data.result}`,
      );
    }

    //  قدم بسیار مهم: ذخیره trackId در دیتابیس
    // فرض بر این است که یک فیلد track_id در جدول orders اضافه کرده‌اید
    await this.prisma.orders.update({
      where: { id: order.id },
      data: {
        track_id: data.trackId.toString(),
      },
    });

    // بازگرداندن اطلاعات به همراه لینک مستقیم پرداخت برای فرانت‌اند
    return {
      trackId: data.trackId,
      paymentUrl: `https://gateway.zibal.ir/start/${data.trackId}`,
    };
  }

  async verifyPayment(track_id: number) {
    // ۱. پیدا کردن سفارش با استفاده از شناسه پیگیری درگاه
    const order = await this.prisma.orders.findUnique({
      where: { track_id: track_id.toString() },
    });

    if (!order) {
      throw new NotFoundException('سفارشی با این شناسه پرداخت یافت نشد.');
    }

    // ۲. بررسی اینکه سفارش قبلاً تکمیل نشده باشد
    if (order.status === 'completed') {
      throw new BadRequestException(
        'این سفارش قبلاً با موفقیت پرداخت و تکمیل شده است.',
      );
    }

    const merchantId = this.configService.get<string>(
      'ZIBAL_MERCHANT',
      'zibal',
    );

    // ۳. ارسال درخواست به زیبال برای تایید تراکنش
    const { data } = await firstValueFrom(
      this.httpService
        .post<ZibalVerifyResponse>('https://gateway.zibal.ir/v1/verify', {
          merchant: merchantId,
          trackId: track_id,
        })
        .pipe(
          catchError((error) => {
            this.logger.error(
              'Zibal Verify Error:',
              error.response?.data || error.message,
            );
            throw new InternalServerErrorException(
              'مشکلی در برقراری ارتباط جهت تایید پرداخت پیش آمد.',
            );
          }),
        ),
    );

    // ۴. بررسی موفق بودن تراکنش از سمت بانک
    if (data.result !== 100 && data.result !== 201) {
      await this.prisma.orders.update({
        where: { id: order.id },
        data: { status: 'cancelled' },
      });
      throw new BadRequestException(`تراکنش ناموفق بود: ${data.message}`);
    }

    // ۵. بررسی امنیتی مبلغ: اطمینان از اینکه مبلغ دستکاری نشده باشد
    const expectedAmountInRial = order.totalPrice * 10;
    if (data.amount !== expectedAmountInRial) {
      this.logger.error(
        `تغییر مبلغ شناسایی شد! سفارش: ${order.id} | مورد انتظار: ${expectedAmountInRial} | دریافتی: ${data.amount}`,
      );
      throw new BadRequestException(
        'مبلغ پرداختی با مبلغ سفارش مطابقت ندارد. در صورت کسر وجه، به حساب شما بازخواهد گشت.',
      );
    }

    // ۶. آپدیت سفارش به وضعیت تکمیل شده و ثبت اطلاعات تراکنش
    await this.prisma.orders.update({
      where: { id: order.id },
      data: {
        status: 'completed',
        ref_id: data.refNumber.toString(),
        payed_time: new Date(),
      },
    });

    return {
      refNumber: data.refNumber,
      cardNumber: data.cardNumber,
      paidAt: data.paidAt,
    };
  }
}
