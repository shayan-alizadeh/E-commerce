import { IsInt } from 'class-validator';

export class PermissionToUserDto {
  @IsInt()
  userId!: number;

  @IsInt()
  permissionId!: number;
}
