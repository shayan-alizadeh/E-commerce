// import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  //   @ApiProperty({ example: '09125806033' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^.{11}$/)
  @Transform(({ value }) => value.trim())
  mobile!: string;

  //   @ApiProperty({ example: 'Ali' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(16, { message: 'نام کاربری باید حاکثر 16 کاراکتر باشد .' })
  display_name!: string;

  //   @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(16, { message: 'رمز عبور باید حاکثر 16 کاراکتر باشد .' })
  password!: string;
}
