import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto) {
    return await this.prisma.comments.create({
      data: createCommentDto,
    });
    
  }

  async findAll() {
    return await this.prisma.comments.findMany({
      include: {
        product: true,

        user: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const comment = await this.prisma.comments.findUnique({
      where: { id },
      include: {
        product: true,
        user: {
          select: { id: true },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('کامنت مورد نظر یافت نشد.');
    }

    return comment;
  }

  async updateCommentScore(id: number, score: number) {
    return await this.prisma.comments.update({
      where: { id },
      data: { score },
    });
  }

  async remove(id: number) {
    return await this.prisma.comments.delete({
      where: { id },
    });
  }
}
