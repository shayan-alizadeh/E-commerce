import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  Res,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { TicketService } from './ticket.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
// import {
//   ApiBearerAuth,
//   ApiBody,
//   ApiConsumes,
//   ApiOperation,
// } from '@nestjs/swagger';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

// @ApiBearerAuth()
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {
    // برای آپلود فایل اگه دایرکتوری تعیین شده(فولدر تعیین شده) جهت ذخیره عکس وجود نداشته باشه دایرکتوری مد نظر رو ایجاد میکنه
    // if (!existsSync('./uploads')) {
    //   mkdirSync('./uploads', { recursive: true });
    // }
  }

  @Post()
  async create(@Body() createTicketDto: CreateTicketDto, @Res() res: Response) {
    const ticket = await this.ticketService.create(createTicketDto);
    return res.status(HttpStatus.CREATED).json({
      success: true,
      body: ticket,
      message: ` Ticket Created `,
      status: HttpStatus.CREATED,
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const ticket = await this.ticketService.findAll();
    return res.status(HttpStatus.OK).json({
      success: true,
      body: ticket,
      message: ` Tickets Found `,
      status: HttpStatus.OK,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const ticket = await this.ticketService.findOne(+id);
    return res.status(HttpStatus.OK).json({
      success: true,
      body: ticket,
      message: ` Ticket Found `,
      status: HttpStatus.OK,
    });
  }

  //آپلود فایل
  // @Post('uploads')
  // // تنظیمات swagger
  // // @ApiBearerAuth()
  // // @ApiOperation({ summary: 'آپلود فایل ...' })
  // // @ApiConsumes('multipart/form-data')
  // // @ApiBody({
  // //   schema: {
  // //     type: 'object',
  // //     properties: {
  // //       file: {
  // //         type: 'string',
  // //         format: 'binary',
  // //         description: 'فایل جهت آپلود',
  // //       },
  // //     },
  // //   },
  // // })
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, cb) => {
  //         const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1000)}${extname(file.originalname)}`;
  //         cb(null, uniqueName);
  //       },
  //     }),
  //     limits: {
  //       // سایز فایل نمی تواند از 10 مگ بیشتر باشد .
  //       fileSize: 10 * 1024 * 1024,
  //     },
  //     fileFilter: (req, file, cb) => {
  //       const allowMimes = [
  //         'image/jpeg',
  //         'image/jpg',
  //         'image/png',
  //         'image/gif',
  //         'application/pdf',
  //       ];
  //       if (allowMimes.includes(file.mimetype)) {
  //         cb(null, true);
  //       } else {
  //         cb(new BadRequestException('نوع فایل مجاز نیست .'), false);
  //       }
  //     },
  //   }),
  // )
  // async upload(@UploadedFile() file: any) {
  //   if (!file) throw new BadRequestException('فایلی آپلود نشده است .');

  //   return {
  //     filename: file.name,
  //     originalName: file.originalName,
  //     mimeType: file.mimeType,
  //     size: file.size,
  //     path: `./uploads/${file.name}`,
  //   };
  // }
}
