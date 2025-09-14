import { Controller, Post, Body } from '@nestjs/common';
import { BotService } from './bot.service';

@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('start')
  async startBot(@Body() body: { meetingUrl: string }) {
    return this.botService.startBot(body.meetingUrl);
  }
}
