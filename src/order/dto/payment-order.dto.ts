import { IsInt, IsNotEmpty } from 'class-validator';

export class PaymentOrderDto {
  @IsInt({ message: 'شناسه محصول (order_id) باید یک عدد صحیح باشد' })
  @IsNotEmpty({ message: 'ارسال شناسه محصول الزامی است' })
  order_id!: number;
}
