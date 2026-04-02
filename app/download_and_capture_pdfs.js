// download_and_capture_pdfs.js
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// List of form IDs and their IRS PDF URLs
const forms = [
  { id: 'form8936', url: 'https://www.irs.gov/pub/irs-pdf/f8936.pdf' },
  { id: 'form990t', url: 'https://www.irs.gov/pub/irs-pdf/f990t.pdf' },
  { id: 'form4255', url: 'https://www.irs.gov/pub/irs-pdf/f4255.pdf' },
  { id: 'form3468', url: 'https://www.irs.gov/pub/irs-pdf/f3468.pdf' },
  { id: 'form1120', url: 'https://www.irs.gov/pub/irs-pdf/f1120.pdf' },
  { id: 'form7220', url: 'https://www.irs.gov/pub/irs-pdf/f7220.pdf' },
  { id: 'form5329', url: 'https://www.irs.gov/pub/irs-pdf/f5329.pdf' },
  { id: 'form8606', url: 'https://www.irs.gov/pub/irs-pdf/f8606.pdf' },
  { id: 'form1099r', url: 'https://www.irs.gov/pub/irs-pdf/f1099r.pdf' },
  { id: 'form8915f', url: 'https://www.irs.gov/pub/irs-pdf/f8915f.pdf' },
  { id: 'form8611', url: 'https://www.irs.gov/pub/irs-pdf/f8611.pdf' },
  { id: 'form8586', url: 'https://www.irs.gov/pub/irs-pdf/f8586.pdf' },
  { id: 'form8609', url: 'https://www.irs.gov/pub/irs-pdf/f8609.pdf' },
  { id: 'form8609a', url: 'https://www.irs.gov/pub/irs-pdf/f8609a.pdf' },
  { id: 'form8693', url: 'https://www.irs.gov/pub/irs-pdf/f8693.pdf' },
  { id: 'form8621', url: 'https://www.irs.gov/pub/irs-pdf/f8621.pdf' },
  { id: 'schedulej', url: 'https://www.irs.gov/pub/irs-pdf/f5471.pdf' }, // Schedule J (Form 5471)
  { id: 'form8621a', url: 'https://www.irs.gov/pub/irs-pdf/f8621a.pdf' },
  { id: 'form8697', url: 'https://www.irs.gov/pub/irs-pdf/f8697.pdf' },
  { id: 'form8919', url: 'https://www.irs.gov/pub/irs-pdf/f8919.pdf' },
  { id: 'form8960', url: 'https://www.irs.gov/pub/irs-pdf/f8960.pdf' },
  { id: 'form8833', url: 'https://www.irs.gov/pub/irs-pdf/f8833.pdf' },
  { id: 'form965a', url: 'https://www.irs.gov/pub/irs-pdf/f965a.pdf' },
  { id: 'form965c', url: 'https://www.irs.gov/pub/irs-pdf/f965c.pdf' },
  { id: 'form965d', url: 'https://www.irs.gov/pub/irs-pdf/f965d.pdf' },
  { id: 'form965e', url: 'https://www.irs.gov/pub/irs-pdf/f965e.pdf' }
];

const pdfDir = path.resolve(__dirname, 'src', 'assets', 'pdfs');
const shotDir = path.resolve(__dirname, 'src', 'assets', 'screenshots');
if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });
if (!fs.existsSync(shotDir)) fs.mkdirSync(shotDir, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => file.close(() => resolve()));
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

(async () => {
  console.log('Downloading PDFs...');
  for (const f of forms) {
    const pdfPath = path.join(pdfDir, `${f.id}.pdf`);
    if (!fs.existsSync(pdfPath)) {
      try {
        await download(f.url, pdfPath);
        console.log(`✔ ${f.id}.pdf downloaded`);
      } catch (e) {
        console.error(`✖ Error downloading ${f.id}:`, e.message);
      }
    } else {
      console.log(`↺ ${f.id}.pdf already exists`);
    }
  }

  // Install puppeteer if not present
  try {
    require('puppeteer');
  } catch (_) {
    console.log('Installing puppeteer...');
    execSync('npm install puppeteer', { stdio: 'inherit' });
  }

  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Capturing screenshots...');
  for (const f of forms) {
    const pdfPath = path.join(pdfDir, `${f.id}.pdf`);
    if (!fs.existsSync(pdfPath)) continue; // skip missing
    const fileUrl = `file://${pdfPath.replace(/\\/g, '/')}`;
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    const shotPath = path.join(shotDir, `${f.id}.png`);
    await page.screenshot({ path: shotPath, fullPage: true });
    console.log(`✔ Screenshot for ${f.id} saved`);
  }

  await browser.close();
  console.log('All done!');
})();
