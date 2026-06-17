import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { PrismaService } from 'src/prisma/prisma.service.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.prisma.categories.create({
      data: createCategoryDto,
    });
  }

  async findAll() {
    return await this.prisma.categories.findMany({
      include: {
        prod_cat: {
          include: {
            product: true,
          },
        },
      },
    });
  }
  async findOne(id: number) {
    const category = await this.prisma.categories.findUnique({
      where: { id },
      include: {
        prod_cat: {
          include: {
            product: true,
          },
        },
      },
    });
    if (category) {
      return category;
    } else {
      throw new NotFoundException('Categor not Found .');
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      return await this.prisma.categories.update({
        where: { id },
        data: updateCategoryDto,
      });
    } catch {
      throw new NotFoundException('Address not found');
    }
  }

  async removeOnlyCategory(id: number) {
    return this.prisma.$transaction([
      this.prisma.product_category.deleteMany({
        where: { category_id: id },
      }),
      this.prisma.categories.delete({
        where: { id },
      }),
    ]);
  }

  async safeRemove(id: number) {
    const count = await this.prisma.product_category.count({
      where: { category_id: id },
    });

    if (count > 0) {
      throw new BadRequestException(
        'Cannot delete category with related products',
      );
    }

    return this.prisma.categories.delete({
      where: { id },
    });
  }
}
