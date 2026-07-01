import { IsInt } from 'class-validator';

export class RoleToUserDto {
  @IsInt()
  userId!: number;

  @IsInt()
  roleId!: number;
}
