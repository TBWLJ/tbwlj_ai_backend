import { Controller, Post, Body } from '@nestjs/common';
import { BotService } from './bot.service';

@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('join')
  async joinMeeting(@Body() body: { url: string, meetingId: string }) {
    await this.botService.joinMeeting(body.url, body.meetingId);
    return { message: 'Bot joined the meeting' };
  }
}
