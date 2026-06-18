import { IsInt, IsNotEmpty } from 'class-validator';

export class BookmarkProductDto {
  @IsNotEmpty()
  @IsInt()
  user_id!: number;

  @IsNotEmpty()
  @IsInt()
  product_id!: number;
}
