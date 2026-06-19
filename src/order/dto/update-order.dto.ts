import { IsEnum, IsNotEmpty } from 'class-validator';
import { orderStatus } from '../../../generated/prisma/enums.js';

export class UpdateOrderDto {
  @IsNotEmpty({ message: 'وضعیت سفارش نباید خالی باشد' })
  @IsEnum(orderStatus, {
    message:
      'وضعیت سفارش نامعتبر است. مقادیر مجاز: PENDING, COMPLETED, CANCELLED',
  })
  status!: orderStatus;
}
