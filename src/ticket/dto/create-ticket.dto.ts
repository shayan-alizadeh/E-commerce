import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString({ message: 'توضیحات باید به صورت رشته باشد' })
  @IsNotEmpty({ message: 'توضیحات نباید خالی باشد' })
  title!: string;

  @IsString({ message: 'توضیحات باید به صورت رشته باشد' })
  @IsNotEmpty({ message: 'توضیحات نباید خالی باشد' })
  subject!: string;

  @IsString({ message: 'توضیحات باید به صورت رشته باشد' })
  @IsNotEmpty({ message: 'توضیحات نباید خالی باشد' })
  description!: string;

  @IsNotEmpty({ message: 'id کاربر نمی تواند خالی باشد .' })
  user_id!: number;

  @IsOptional()
  reply_id?: number;
}
