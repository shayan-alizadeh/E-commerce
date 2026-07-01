import { IsInt } from 'class-validator';

export class PermissionToRoleDto {
  @IsInt()
  roleId!: number;

  @IsInt()
  permissionId!: number;
}
