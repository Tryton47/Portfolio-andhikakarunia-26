// scripts/capture-screenshots.js
// Run: node scripts/capture-screenshots.js
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const sites = [
  { url: 'https://cinevix-works.vercel.app/', file: 'cinevix-works.png' },
  { url: 'https://e-commerce-recommendation-engine.vercel.app/', file: 'ecommerce-recommendation.png' },
  { url: 'https://sales-marketing-web-u5e1.vercel.app/', file: 'sales-marketing-web.png' },
  { url: 'https://event-ease-mauve.vercel.app/', file: 'event-ease.png' },
  { url: 'https://organik-pandanrejo.vercel.app/', file: 'organik-pandanrejo.png' },
  { url: 'https://hoaks-detector.vercel.app/', file: 'hoaks-detector.png' },
];

const outDir = path.join(__dirname, '../public/showcase/web-dev');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  for (const site of sites) {
    const outPath = path.join(outDir, site.file);
    if (fs.existsSync(outPath)) {
      console.log(`✓ Already exists: ${site.file}`);
      continue;
    }
    console.log(`📸 Capturing: ${site.url}`);
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 30000 });
      // Wait a bit for animations
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1440, height: 900 } });
      await page.close();
      console.log(`✅ Saved: ${site.file}`);
    } catch (err) {
      console.error(`❌ Failed: ${site.url} — ${err.message}`);
    }
  }

  await browser.close();
  console.log('\n🎉 Done!');
})();
