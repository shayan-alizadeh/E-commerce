import { IsInt, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsInt({ message: 'شناسه کاربر (userId) باید یک عدد صحیح باشد' })
  @IsNotEmpty({ message: 'ارسال شناسه کاربر الزامی است' })
  userId!: number;

  @IsInt({ message: 'شناسه آدرس (addressId) باید یک عدد صحیح باشد' })
  @IsNotEmpty({ message: 'ارسال شناسه آدرس الزامی است' })
  addressId!: number;

  @IsOptional()
  @IsString({ message: 'کد تخفیف باید از نوع متنی باشد' })
  discounte_code?: string;
}
