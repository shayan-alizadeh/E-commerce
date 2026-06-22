import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { IpTrackerService } from './ip-tracker.service.js';

@Injectable()
export class IpTrackerMiddleware implements NestMiddleware {
  constructor(private readonly ipTrackerService: IpTrackerService) {}
  async use(req: Request, res: Response, next: () => void) {
    const clientIp = req.ip || 'Unknown IP';
    await this.ipTrackerService.track(clientIp);
    next();
  }
}
