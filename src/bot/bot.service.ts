import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BotService {
  async startBot(meetingUrl: string, options = { headless: true, saveCaptions: true }) {
    const { headless, saveCaptions } = options;

    const browser = await puppeteer.launch({
      headless,
      args: [
        '--use-fake-ui-for-media-stream',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });

    const page = await browser.newPage();

    try {
      await page.goto(meetingUrl, { waitUntil: 'networkidle2' });

      await page.waitForTimeout(3000);

      // Turn off camera/mic
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);

      // Turn on captions
      const captionsButton = await page.$('div[aria-label*="Turn on captions"]');
      if (captionsButton) {
        await captionsButton.click();
      }

      // Click join
      const joinButton = await page.$('button[jsname="Qx7uuf"]');
      if (joinButton) {
        await joinButton.click();
      } else {
        throw new Error('Join button not found');
      }

      console.log('✅ Joined the meeting.');

      if (saveCaptions) {
        const captions = [];
        const captionsPath = path.join(__dirname, 'captions.txt');

        await page.exposeFunction('onNewCaption', (text) => {
          captions.push(text);
          fs.appendFileSync(captionsPath, text + '\n');
        });

        await page.evaluate(() => {
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                  const text = node.innerText;
                  if (text) {
                    window.onNewCaption(text);
                  }
                });
              }
            });
          });

          const captionsContainer = document.querySelector('[class*="iTTPOb"]'); // Might need tweaking
          if (captionsContainer) {
            observer.observe(captionsContainer, { childList: true, subtree: true });
          }
        });

        console.log('📝 Capturing captions...');
      }

    } catch (error) {
      console.error('❌ Error in bot module:', error.message);
    } finally {
      // Leave the meeting after a duration or condition (you can add later)
      // await browser.close();
    }
  }
}
