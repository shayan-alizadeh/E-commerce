import { Transform } from 'class-transformer';
// import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

export class LoginDto {
//   @ApiProperty({ example: '09125806033' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^.{11}$/)
  @Transform(({ value }) => value.trim())
  mobile!: string;

//   @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 16)
  @MaxLength(16, { message: 'رمز عبور باید حاکثر 16 کاراکتر باشد .' })
  password!: string;
}
