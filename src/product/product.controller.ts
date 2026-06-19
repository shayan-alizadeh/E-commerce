import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { BookmarkProductDto } from './dto/bookmark-product.dto.js';
import { BasketItemDto } from './dto/basket-item.dto.js';
import type { Response } from 'express';


// import { ApiBearerAuth } from '@nestjs/swagger';

// @ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @Res() res: Response,
  ) {
    const product = await this.productService.create(createProductDto);
    return res.status(HttpStatus.CREATED).json({
      success: true,
      body: product,
      message: ` Product Created `,
      status: HttpStatus.CREATED,
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const product = await this.productService.findAll();
    return res.status(HttpStatus.OK).json({
      success: true,
      body: product,
      message: ` Products Found `,
      status: HttpStatus.OK,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const product = await this.productService.findOne(+id);
    return res.status(HttpStatus.OK).json({
      success: true,
      body: product,
      message: ` Product Found `,
      status: HttpStatus.OK,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Res() res: Response,
  ) {
    const product = await this.productService.update(+id, updateProductDto);
    return res.status(HttpStatus.OK).json({
      success: true,
      body: product,
      message: ` Product Found `,
      status: HttpStatus.OK,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const product = await this.productService.remove(+id);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: ` Product Deleted `,
      status: HttpStatus.OK,
    });
  }
  @Post('bookmark-product')
  async toggleBookmark(
    @Body() bookmarkProductDto: BookmarkProductDto,
    @Res() res: Response,
  ) {
    const bookmark =
      await this.productService.toggleBookmark(bookmarkProductDto);
    return res.status(HttpStatus.OK).json({
      success: true,
      body: bookmark,
      message: ` Bookmark Changed . `,
      status: HttpStatus.OK,
    });
  }
  @Post('add-basket')
  async addToBasket(
    @Body() basketItemDtoDto: BasketItemDto,
    @Res() res: Response,
  ) {
    const bascket = await this.productService.addToBasket(basketItemDtoDto);
    return res.status(HttpStatus.OK).json({
      success: true,
      body: bascket,
      message: ` Basket Added . `,
      status: HttpStatus.OK,
    });
  }
  @Delete('remove-basket')
  async removeFromBasket(
    @Body() basketItemDto: BasketItemDto,
    @Res() res: Response,
  ) {
    const product = await this.productService.removeFromBasket(basketItemDto);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: ` Product Deleted `,
      status: HttpStatus.OK,
    });
  }
}
