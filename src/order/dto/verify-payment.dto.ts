import { IsInt, IsNotEmpty } from 'class-validator';

export class VerifyPaymentDto {
  @IsInt({ message: 'شناسه سفارش باید یک عدد صحیح باشد .' })
  @IsNotEmpty({ message: 'ارسال شناسه سفارش الزامی است' })
  order_id!: number;
}
