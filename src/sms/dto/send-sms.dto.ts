import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class SmsDto {
  @ApiProperty({ example: '09125806033' })
  // @IsString()
  @IsNotEmpty()
  // @Matches(/^.{11}$/)
  // @Transform(({ value }) => value.trim())
  @IsArray()
  mobile!: string[];

  @ApiProperty({
    example: 'سلام این یک پیام تست است',
    description: 'متن پیامک',
  })
  @IsString()
  @IsNotEmpty()
  message!: string;
}
