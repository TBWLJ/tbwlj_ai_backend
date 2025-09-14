import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MeetingsModule } from '../meetings/meetings.module';

@Module({
  imports: [ScheduleModule.forRoot(), MeetingsModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
