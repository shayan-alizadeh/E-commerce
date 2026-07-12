import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { BookmarkProductDto } from './dto/bookmark-product.dto.js';
import { BasketItemDto } from './dto/basket-item.dto.js';
import { RedisService } from '../redis/redis.service.js';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { categoryIds, ...productDto } = createProductDto;

    return this.prisma.products.create({
      data: {
        ...productDto,

        ...(categoryIds && {
          prod_cat: {
            create: categoryIds.map((id) => ({
              category: {
                connect: { id },
              },
            })),
          },
        }),
      },
    });
  }

  async findAll() {
    const cachedProduct = await this.redisService.get('getList:products');
    const products = [];
    if (cachedProduct) {
      const products = JSON.parse(cachedProduct);
      console.log('Get products from Redis cache ...');
      return products;
    } else {
      const dbProducts = await this.prisma.products.findMany({
        include: {
          prod_cat: {
            include: {
              category: true,
            },
          },
        },
      });
      await this.redisService.set('getList:products', JSON.stringify(products));
      console.log('Get products from Database ...');
      return dbProducts;
    }
  }

  async findOne(id: number) {
    const product = await this.prisma.products.findUnique({
      where: { id },
      include: {
        prod_cat: {
          include: {
            category: true,
          },
        },
      },
    });
    if (!product) throw new NotFoundException('Product Not Found .');
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { categoryIds, ...productDto } = updateProductDto;

    return this.prisma.products.update({
      where: { id },
      data: {
        ...productDto,

        ...(categoryIds && {
          prod_cat: {
            deleteMany: {},
            create: categoryIds.map((id) => ({
              category: {
                connect: { id },
              },
            })),
          },
        }),
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.products.delete({
      where: { id },
    });
  }

  async toggleBookmark(bookmarkProductDto: BookmarkProductDto) {
    const { user_id, product_id } = bookmarkProductDto;
    const existBookmark = await this.prisma.bookmark_product.findUnique({
      where: {
        user_id_product_id: {
          user_id,
          product_id,
        },
      },
    });

    if (existBookmark) {
      return await this.prisma.bookmark_product.delete({
        where: { id: existBookmark.id },
      });
    } else {
      return await this.prisma.bookmark_product.create({
        data: {
          user_id,
          product_id,
        },
      });
    }
  }

  async addToBasket(basketItemDto: BasketItemDto) {
    const { user_id, product_id, quantity } = basketItemDto;

    return await this.prisma.basket_item.create({
      data: {
        user_id,
        product_id,
        quantity,
      },
    });
  }

  async removeFromBasket(basketItemDto: BasketItemDto) {
    const { user_id, product_id } = basketItemDto;

    return await this.prisma.basket_item.delete({
      where: {
        user_id_product_id: {
          user_id,
          product_id,
        },
      },
    });
  }
}
