import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTicketDto: CreateTicketDto) {
    const { userId, replyId, ...ticketDto } = createTicketDto;
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('وجود user id برای هر تیکت الزامی است .');
    }
    if (replyId) {
      const parentTicket = await this.prisma.tickets.findUnique({
        where: { id: replyId },
      });
      if (parentTicket?.reply_id !== null) {
        throw new BadRequestException(
          'شما نمیتوانید این تیکت را ریپلای کنید .',
        );
      }
    }
    return this.prisma.tickets.create({
      data: {
        ...ticketDto,
        user_id: userId,
        reply_id: replyId,
      },
    });
  }

  async findAll() {
    return this.prisma.tickets.findMany({
      where: { reply_id: null },
      include: {
        replies: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.tickets.findUnique({
      where: { id },
      include: {
        parent: true,
        replies: true,
      },
    });
  }

  // update(id: number, updateTicketDto: UpdateTicketDto) {
  //   return `This action updates a #${id} ticket`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} ticket`;
  // }
}
