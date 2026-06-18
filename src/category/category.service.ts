import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// ConflictException و ایمپورت Prisma حذف شدند چون دیگر نیازی به آن‌ها نیست
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { PrismaService } from 'src/prisma/prisma.service.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    // خطای P2002 (تکراری بودن) توسط گلوبال فیلتر هندل می‌شود و 409 برمی‌گرداند
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

    // اینجا چون findUnique به جای خطا دادن null برمی‌گرداند، این if باید بماند
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    // خطاهای P2025 (پیدا نشدن) و P2002 توسط فیلتر به 404 و 409 تبدیل می‌شوند
    return await this.prisma.categories.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async safeRemove(id: number) {
    const count = await this.prisma.product_category.count({
      where: { category_id: id },
    });

    // این یک منطق بیزینسی و دستی است، بنابراین باید بماند
    if (count > 0) {
      throw new BadRequestException(
        'Cannot delete category with related products',
      );
    }

    // خطای P2025 در صورت پیدا نشدن آیدی توسط فیلتر به 404 تبدیل می‌شود
    return await this.prisma.categories.delete({
      where: { id },
    });
  }
}
