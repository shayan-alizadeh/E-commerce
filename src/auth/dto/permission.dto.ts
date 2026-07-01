import {  IsString } from 'class-validator';

export class createPermissionDto {
  @IsString()
  name!: string | string[];
}
