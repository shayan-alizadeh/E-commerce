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
  Put,
} from '@nestjs/common';
import { AddressService } from './address.service.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';
import type { Response } from 'express';
// import { Permission } from 'src/auth/Decorator/permission.decorator';
// import { ApiBearerAuth } from '@nestjs/swagger';

// @ApiBearerAuth()
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(
    @Body() createAddressDto: CreateAddressDto,
    @Res() res: Response,
  ) {
    const result = await this.addressService.create(createAddressDto);
    return res.status(HttpStatus.CREATED).json({
      success: true,
      body: result,
      message: ` Address Created `,
      status: HttpStatus.CREATED,
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.addressService.findAll();
    return res.status(HttpStatus.OK).json({
      success: true,
      body: result,
      message: ` Addresses Founded `,
      status: HttpStatus.OK,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.addressService.findOne(+id);
    return res.status(HttpStatus.OK).json({
      success: true,
      body: result,
      message: ` Address ${id} Founded `,
      status: HttpStatus.OK,
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @Res() res: Response,
  ) {
    const result = await this.addressService.update(+id, updateAddressDto);
    return res.status(HttpStatus.OK).json({
      success: true,
      body: result,
      message: ` Address ${id} Updated `,
      status: HttpStatus.OK,
    });
  }

  //این دکوراتور مربوط به بخش است که بعدا اضافه شده (ownership Guard)
  // @Permission('address:delete:own')
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.addressService.remove(+id);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: ` Address ${id} Deleted `,
      status: HttpStatus.OK,
    });
  }
}
