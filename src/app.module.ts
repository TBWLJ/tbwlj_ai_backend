import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { MeetingsModule } from './meetings/meetings.module';
import { BotModule } from './bot/bot.module';
import { NotesModule } from './notes/notes.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { SummaryModule } from './summary/summary.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    ScheduleModule.forRoot(),
    MeetingsModule,
    BotModule,
    NotesModule,
    SchedulerModule,
    SummaryModule,
  ],
})
export class AppModule {}
