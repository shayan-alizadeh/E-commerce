import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from './comment.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import type { Response } from 'express';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Res() res: Response,
  ) {
    const comment = await this.commentService.create(createCommentDto);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      body: comment,
      message: ` Comment Created `,
      status: HttpStatus.CREATED,
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const comment = await this.commentService.findAll();

    return res.status(HttpStatus.OK).json({
      success: true,
      body: comment,
      message: ` Comments Found `,
      status: HttpStatus.OK,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const comment = await this.commentService.findOne(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      body: comment,
      message: ` Comment Found `,
      status: HttpStatus.OK,
    });
  }

  @Patch(':id/score')
  async updateCommentScore(
    @Param('id', ParseIntPipe) id: number,
    @Body('score', ParseIntPipe) score: number,
    @Res() res: Response,
  ) {
    const updatedComment = await this.commentService.updateCommentScore(
      id,
      score,
    );

    return res.status(HttpStatus.OK).json({
      success: true,
      body: updatedComment,
      message: ` Comment Updated `,
      status: HttpStatus.OK,
    });
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.commentService.remove(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      body: null,
      message: ` Comment Deleted `,
      status: HttpStatus.OK,
    });
  }
}
