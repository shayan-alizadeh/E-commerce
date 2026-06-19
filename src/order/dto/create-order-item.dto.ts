import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt({ message: 'شناسه محصول (product_id) باید یک عدد صحیح باشد' })
  @IsNotEmpty({ message: 'ارسال شناسه محصول الزامی است' })
  productId!: number;

  @IsInt({ message: 'تعداد (quantity) باید یک عدد صحیح باشد' })
  @Min(1, { message: 'تعداد محصول نمی‌تواند کمتر از ۱ باشد' })
  @IsNotEmpty({ message: 'ارسال تعداد الزامی است' })
  quantity!: number;

  @IsString({ message: 'قیمت واحد باید به صورت متنی (String) باشد' })
  @IsNotEmpty({ message: 'ارسال قیمت واحد الزامی است' })
  unit_price!: string;
}
