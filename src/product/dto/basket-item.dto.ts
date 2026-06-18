import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class BasketItemDto {
  @IsNotEmpty()
  @IsInt()
  user_id!: number;

  @IsNotEmpty()
  @IsInt()
  product_id!: number;

  @IsInt({ message: 'تعداد (quantity) باید یک عدد صحیح باشد' })
  @Min(1, { message: 'تعداد محصول نمی‌تواند کمتر از ۱ باشد' })
  @IsNotEmpty({ message: 'ارسال تعداد الزامی است' })
  quantity!: number;
}
