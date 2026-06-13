import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { roleType } from 'generated/prisma/enums.js';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  display_name: string;

  @IsOptional()
  @IsEnum(roleType)
  role: roleType;
}
