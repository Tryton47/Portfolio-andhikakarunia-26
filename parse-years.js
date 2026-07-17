const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

const dir = 'public/E-Sertif';

async function extractYears() {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.pdf'));
  for (const file of files) {
    const dataBuffer = fs.readFileSync(path.join(dir, file));
    try {
      const data = await pdf(dataBuffer);
      const text = data.text;
      
      // Look for 4 digit years
      const years = text.match(/\b(2019|2020|2021|2022|2023|2024|2025|2026)\b/g);
      const uniqueYears = [...new Set(years)];
      console.log(`${file}: ${uniqueYears.join(', ')}`);
    } catch (e) {
      console.log(`${file}: Error parsing PDF`);
    }
  }
}

extractYears();
