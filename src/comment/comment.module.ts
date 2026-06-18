import { Module } from '@nestjs/common';
import { CommentService } from './comment.service.js';
import { CommentController } from './comment.controller.js';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
