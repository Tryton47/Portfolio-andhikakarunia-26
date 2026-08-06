// scripts/capture-projects.js
// Run: node scripts/capture-projects.js
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const sites = [
  // Wargaverse - ambil dari GitHub repo README
  { url: 'https://github.com/JustFarzz/wargaverse', file: 'wargaverse.png', selector: null },
  // Karirnex Data Analyst - tangkap landing page
  { url: 'https://karirnex.id/', file: 'karirnex-data-analyst.png', selector: null },
];

const outDir = path.join(__dirname, '../public/showcase/web-dev');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
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
      await new Promise(r => setTimeout(r, 2500));
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
