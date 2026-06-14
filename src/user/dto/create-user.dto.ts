// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import { roleType } from '../../../generated/prisma/enums.js';

export class CreateUserDto {
//   @ApiProperty({ example: '09125806033' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^.{11}$/)
  @Transform(({ value }) => value.trim())
  mobile!: string;

//   @ApiProperty({ example: 'Ali' })
  @IsString()
  @IsNotEmpty()
  display_name!: string;

//   @ApiPropertyOptional({ example: '123456' })
  @IsString()
  @IsOptional()
  @Length(8, 16)
  password?: string;

//   @ApiPropertyOptional({ enum: roleType, example: roleType.user })
  @IsOptional()
  @IsEnum(roleType)
  role?: roleType;
}
