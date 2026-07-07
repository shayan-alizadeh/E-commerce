import { Module } from '@nestjs/common';
import { TaskService } from './task.service.js';
import { CleanUpJob } from './job/cleanup.job.js';

@Module({
    providers:[TaskService,CleanUpJob]
})
export class TaskModule {}
