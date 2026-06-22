import { Module } from '@nestjs/common';
import { IpTrackerService } from './ip-tracker.service.js';

@Module({
  providers: [IpTrackerService],
  exports: [IpTrackerService],
})
export class IpTrackerModule {}
