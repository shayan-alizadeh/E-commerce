import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateAddressDto {
  @IsString({ message: 'استان باید یک رشته باشد .' })
  @IsNotEmpty({ message: 'بخش استان نمی تواند خالی باشد .' })
  province!: string;

  @IsString({ message: 'شهر باید یک رشته باشد' })
  @IsNotEmpty({ message: 'بخش شهر نمی تواند خالی باشد' })
  city!: string;

  @IsString({ message: 'کد پستی باید به صورت رشته وارد شود .' })
  @Length(10, 10, { message: 'کد پستی باید 10 رقم باشد' })
  postal_code!: string;

  @IsString({ message: 'آدرس باید یک رشته باشد' })
  @IsNotEmpty({ message: 'بخش آدرس نمی تواند خالی باشد' })
  address!: string;

  @IsString({ message: 'استان باید یک رشته باشد .' })
  @IsNotEmpty({ message: 'بخش شماره موبایل گیرنده نمی تواند خالی باشد' })
  @Length(10, 10, { message: 'شماره موبایل باید 11 رقم باشد .' })
  reciver_mobile!: string;

  @IsOptional()
  @IsString({ message: 'توضیحات باید به صورت رشته وارد شود .' })
  description?: string;
}
