import { Injectable } from "@nestjs/common";
import { CleanUpJob } from "./job/cleanup.job.js";

@Injectable()
export class TaskService {
  constructor(private cleanUp: CleanUpJob) {}

  // @Cron("* * * * *")
  // @Cron(CronExpression.EVERY_11_HOURS)
  cleanOtpData() {
    this.cleanUp.cleanOtp();
  }
}