import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permission';

export const Permissions = (...params: string[]) =>
  SetMetadata(PERMISSION_KEY, params);
