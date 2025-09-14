import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { MeetingsModule } from './meetings/meetings.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    ScheduleModule.forRoot(),
    MeetingsModule,
    SchedulerModule,
  ],
})
export class AppModule {}
