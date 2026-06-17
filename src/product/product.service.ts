import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { PrismaService } from 'src/prisma/prisma.service.js';
// import { BookmarkProductDto } from './dto/bookmark-product.dto';
// import { BasketItemDto } from './dto/basket-item.dto';
// import { RedisService } from 'src/redis/redis.service';

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
    return this.prisma.products.delete({
      where: { id },
    });
  }

  // async toggleBookmark(bookmarkProductDto: BookmarkProductDto) {
  //   const { userId, productId } = bookmarkProductDto;

  //   const user = await this.prisma.users.findFirst({ where: { id: userId } });
  //   const product = await this.prisma.products.findFirst({
  //     where: { id: productId },
  //   });

  //   if (!user || !product)
  //     throw new NotFoundException('کاربر یا محصول یافت نشد .');

  //   const existBookmark = await this.prisma.bookmark_product.findFirst({
  //     where: { user_id: user.id, product_id: product.id },
  //   });
  //   if (existBookmark) {
  //     return this.prisma.bookmark_product.delete({
  //       where: { id: existBookmark.id },
  //     });
  //   } else {
  //     return this.prisma.bookmark_product.create({
  //       data: {
  //         user_id: userId,
  //         product_id: productId,
  //       },
  //     });
  //   }
  // }

  // async addToBasket(basketItemDto: BasketItemDto) {
  //   const { userId, productId, quantity } = basketItemDto;
  //   const user = await this.prisma.users.findFirst({ where: { id: userId } });
  //   const product = await this.prisma.products.findFirst({
  //     where: { id: productId },
  //   });

  //   if (!user || !product)
  //     throw new NotFoundException('کاربر یا محصول یافت نشد .');

  //   const item = await this.prisma.basket_item.findFirst({
  //     where: {
  //       user_id: user.id,
  //       product_id: product.id,
  //     },
  //   });
  //   if (item) {
  //     throw new BadRequestException('Product already in basket');
  //   } else {
  //     return this.prisma.basket_item.create({
  //       data: {
  //         user_id: user.id,
  //         product_id: product.id,
  //         quantity,
  //       },
  //     });
  //   }
  // }

  // async removeFromBasket(basketItemDto: BasketItemDto) {
  //   const { userId, productId } = basketItemDto;
  //   const item = await this.prisma.basket_item.findFirst({
  //     where: {
  //       user_id: userId,
  //       product_id: productId,
  //     },
  //   });
  //   if (!item) {
  //     throw new NotFoundException('سبد مورد نظر یافت نشد .');
  //   }
  //   return this.prisma.basket_item.delete({
  //     where: {
  //       id: item.id,
  //     },
  //   });
  // }
}
