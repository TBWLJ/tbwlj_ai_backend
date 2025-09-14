import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export async function startBot(meetingUrl: string, options = {}) {
  const { headless = true, saveCaptions = true } = options as {
    headless?: boolean;
    saveCaptions?: boolean;
  };

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

    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const captionsButton = await page.$('div[aria-label*="Turn on captions"]');
    if (captionsButton) {
      await captionsButton.click();
    }

    const joinButton = await page.$('button[jsname="Qx7uuf"]');
    if (joinButton) {
      await joinButton.click();
    } else {
      throw new Error("Join button not found");
    }

    console.log("✅ Joined the meeting.");

    if (saveCaptions) {
      const captions: string[] = [];
      const captionsPath = path.join(__dirname, 'captions.txt');

      await page.exposeFunction('onNewCaption', (text: string) => {
        captions.push(text);
        fs.appendFileSync(captionsPath, text + '\n');
      });

      await page.evaluate(() => {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              mutation.addedNodes.forEach((node) => {
                const text = (node as HTMLElement).innerText;
                if (text) {
                  window.onNewCaption(text);
                }
              });
            }
          });
        });

        const captionsContainer = document.querySelector('[class*="iTTPOb"]');
        if (captionsContainer) {
          observer.observe(captionsContainer, { childList: true, subtree: true });
        }
      });

      console.log("📝 Capturing captions...");
    }

  } catch (error) {
    console.error("❌ Error in bot module:", error.message);
    await browser.close();
  }
}
