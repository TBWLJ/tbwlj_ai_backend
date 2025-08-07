import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class BotService {
  private logger = new Logger(BotService.name);

  async joinMeeting(meetingUrl: string, botName = 'Taiwo Ayomide AI'): Promise<void> {
    try {
      const browser = await puppeteer.launch({
        headless: false, // You can change to true if you don’t need a GUI
        args: [
          '--use-fake-ui-for-media-stream', // Automatically grant mic/cam
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
      });

      const page = await browser.newPage();
      await page.goto(meetingUrl, { waitUntil: 'networkidle2' });

      this.logger.log(`Navigated to ${meetingUrl}`);

      // Wait for the join button
      await page.waitForSelector('input[type="text"]', { timeout: 10000 });
      await page.type('input[type="text"]', botName); // Type name
      await page.keyboard.press('Enter');

      // Join the meeting
      await page.waitForTimeout(10000);

      // Periodically send message
      const sendMessage = async (msg: string) => {
        try {
          await page.click('[aria-label="Chat with everyone"]');
          await page.waitForSelector('textarea');
          await page.type('textarea', msg);
          await page.keyboard.press('Enter');
          this.logger.log(`Sent message: ${msg}`);
        } catch (e) {
          this.logger.error('Failed to send message', e);
        }
      };

      setInterval(() => {
        sendMessage("👋 Hi, I'm Taiwo Ayomide AI. I'm helping Ayomide take notes of this meeting.");
      }, 5 * 60 * 1000); // every 5 minutes

    } catch (err) {
      this.logger.error('Failed to join meeting', err);
    }
  }
}
