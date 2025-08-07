const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function startBot(meetingUrl, options = {}) {
  const { headless = true, saveCaptions = true } = options;

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
    // Go to Google Meet
    await page.goto(meetingUrl, { waitUntil: 'networkidle2' });

    // Accept permissions (if needed)
    await page.waitForTimeout(3000);

    // Click to turn off camera/mic (optional)
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Enable Captions
    const captionsButton = await page.$('div[aria-label*="Turn on captions"]');
    if (captionsButton) {
      await captionsButton.click();
    }

    // Join the meeting
    const joinButton = await page.$('button[jsname="Qx7uuf"]');
    if (joinButton) {
      await joinButton.click();
    } else {
      throw new Error("Join button not found");
    }

    console.log("✅ Joined the meeting.");

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
            if (
              mutation.type === 'childList' &&
              mutation.addedNodes.length > 0
            ) {
              mutation.addedNodes.forEach((node) => {
                const text = node.innerText;
                if (text) {
                  window.onNewCaption(text);
                }
              });
            }
          });
        });

        const captionsContainer = document.querySelector('[class*="iTTPOb"]'); // Might vary, needs testing
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

module.exports = { startBot };
