import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  Param,
  Put,
  Delete,
  Patch,
} from '@nestjs/common';
import { CategoryService } from './category.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import type { Response } from 'express';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
// import { ApiBearerAuth } from '@nestjs/swagger';

// @ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
  ) {
    const category = await this.categoryService.create(createCategoryDto);
    return res.status(HttpStatus.CREATED).json({
      success: true,
      body: category,
      message: ` Category Created `,
      status: HttpStatus.CREATED,
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const category = await this.categoryService.findAll();
    return res.status(HttpStatus.OK).json({
      success: true,
      body: category,
      message: ` Categories Founded `,
      status: HttpStatus.OK,
    });
  }
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const category = await this.categoryService.findOne(+id);
    return res.status(HttpStatus.OK).json({
      success: true,
      body: category,
      message: ` category ${id} Founded `,
      status: HttpStatus.OK,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Res() res: Response,
  ) {
    const result = await this.categoryService.update(+id, updateCategoryDto);
    return res.status(HttpStatus.OK).json({
      success: true,
      body: result,
      message: ` category ${id} Updated `,
      status: HttpStatus.OK,
    });
  }

  @Delete('remove-only-category/:id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.categoryService.removeOnlyCategory(+id);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: ` category ${id} Deleted `,
      status: HttpStatus.OK,
    });
  }

  @Delete('safe-remove/:id')
  async safeRemove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.categoryService.safeRemove(+id);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: ` category ${id} Deleted `,
      status: HttpStatus.OK,
    });
  }
}
