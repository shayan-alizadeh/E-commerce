import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {

  @IsNotEmpty()
  @IsNumber()
  user_id!: number;

  @IsNotEmpty()
  @IsNumber()
  product_id!: number;

  @IsNotEmpty()
  @IsString()
  text!: string;

  @IsOptional()
  @IsNumber()
  score?: number;
  
}
