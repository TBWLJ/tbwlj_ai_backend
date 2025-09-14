import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MeetingsService } from '../meetings/meetings.service';
import { MeetingDocument } from '../meetings/schemas/meeting.schema';
import { Types } from 'mongoose';


@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly meetingsService: MeetingsService) {}

  // Runs every minute
  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.log('Checking for scheduled meetings...');

    try {
      const upcomingMeetings: MeetingDocument[] =
        await this.meetingsService.findUpcoming();

      const now = new Date();

      for (const meeting of upcomingMeetings) {
        const scheduledTime = new Date(meeting.scheduledTime);

        // Check if it's time to trigger the bot
        if (scheduledTime <= now && !meeting.botStarted) {
            this.logger.log(`Triggering bot for meeting: ${meeting.title}`);

            // Trigger Puppeteer bot (placeholder)
            await this.triggerBot(meeting.meetLink);

            // Mark as triggered
            const meetingId = (meeting._id as Types.ObjectId).toString();
            await this.meetingsService.markBotStarted(meetingId);

            this.logger.log(`Bot marked as started for: ${meeting.title}`);
        }
      }
    } catch (error) {
      this.logger.error('Error in scheduler', error);
    }
  }

  async triggerBot(meetLink: string) {
    // Placeholder: Replace with actual Puppeteer logic or call
    this.logger.log(`🤖 (Simulated) Bot joining: ${meetLink}`);

    // In real implementation:
    // await this.httpService.post('http://localhost:4000/bot/run', { link: meetLink });
    // or spawn child process to run puppeteer script
  }
}
