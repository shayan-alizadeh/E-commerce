import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';
import { PrismaService } from 'src/prisma/prisma.service.js';
import { Prisma } from 'generated/prisma/client.js';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAddressDto: CreateAddressDto) {
    try {
      const { userId, ...addressDto } = createAddressDto;
      return await this.prisma.addresses.create({
        data: {
          ...addressDto,
          user: {
            connect: { id: userId },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025' || error.code === 'P2003') {
          throw new NotFoundException('User not found');
        }
        throw error;
      }
    }
  }

  async findAll() {
    return await this.prisma.addresses.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: number) {
    const address = await this.prisma.addresses.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    if (address) {
      return address;
    } else {
      throw new NotFoundException('Address not Found .');
    }
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    try {
      return await this.prisma.addresses.update({
        where: { id },
        data: updateAddressDto,
      });
    } catch (error) {
      throw new NotFoundException('Address not found');
    }
  }

  async remove(id: number) {
    return await this.prisma.addresses.delete({
      where: { id },
    });
  }
}
