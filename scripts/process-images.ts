// Turns source photos and screenshots into small WebP files in public/images.
// Run with: npm run images
import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const OLD = '/Users/kean.edwards/Desktop/Waas/sites/kean-site/public';
const P = `${OLD}/projects/projects`;

const shots: Record<string, string> = {
  'sustainable-marin': 'best-6/sustainable-marin.png',
  'geronimo-woodworks': 'best-6/geronimo-woodworks.png',
  'dark-sky': 'businesses-non-profits/dark-sky.png',
  venturepad: 'best-6/venturepad.png',
  marqueekit: 'best-6/marquee-kit.png',
  'golden-island': 'best-6/golden-island-massage.png',
  'emily-murotake': 'individuals/emily.png',
  'wisdom-trust': 'businesses-non-profits/wisdom-trust.png',
  'rock-steady-fest': 'businesses-non-profits/rock-steady-fest.png',
  'civic-knit': 'businesses-non-profits/civic-knit.png',
  'plain-terms': 'best-6/plain-terms.png',
  'sarah-spector': 'individuals/sarah-spector.png',
  'all-star-organics': 'businesses-non-profits/all-star.png',
  'painted-bins': 'businesses-non-profits/painted-bins.png',
  'life-is-change': 'individuals/life-is-change-updated.png',
  'denise-lussier': 'individuals/denise-lussier.png',
  'aninha-livingstone': 'individuals/aninha-livingstone.png',
  'dave-and-howie': 'individuals/dave-and-howie.png',
  'island-massage': 'businesses-non-profits/island-massage.png',
  'the-gentle-soul': 'businesses-non-profits/the-gentle-soul.png',
  'casa-savasana': 'individuals/casa.png',
  'wm-guillermo': 'businesses-non-profits/william.png',
  logominter: 'personal-proof-of-concept-projects/logominter.png',
};

async function out(file: string) { await mkdir(dirname(file), { recursive: true }); return file; }

for (const [name, src] of Object.entries(shots)) {
  const dest = await out(`public/images/projects/${name}.webp`);
  await sharp(join(P, src)).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 74 }).toFile(dest);
}

const K = '/Users/kean.edwards/Desktop/brain/kean';
const kean = async (src: string, name: string, width: number, crop?: { left: number; top: number; width: number; height: number }, quality = 78) => {
  let img = sharp(src).rotate();
  if (crop) img = sharp(await img.extract(crop).toBuffer());
  await img.resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(await out(`public/images/kean/${name}.webp`));
};

// sharp drops EXIF by default, so phone GPS data never reaches the site.
await kean(`${K}/IMG_0071.jpeg`, 'hero', 1100, { left: 120, top: 330, width: 2196, height: 2745 });
await kean(`${K}/IMG_0071.jpeg`, 'hero-1600', 1600, { left: 120, top: 330, width: 2196, height: 2745 }, 72);
await kean(`${K}/IMG_0071.jpeg`, 'hero-640', 640, { left: 120, top: 330, width: 2196, height: 2745 }, 72);
await kean(`${K}/IMG_0335.JPG`, 'smile', 700, { left: 0, top: 0, width: 700, height: 859 });
await kean(`${K}/IMG_0335.JPG`, 'avatar', 160, { left: 0, top: 20, width: 700, height: 700 }, 82);
await kean(`${K}/IMG_0666.jpeg`, 'beach', 1100, { left: 0, top: 500, width: 3024, height: 3532 });
await kean(`${K}/IMG_0525.JPEG`, 'lookout', 768);
await kean(`${OLD}/Kean.jpeg`, 'hillside', 1000, { left: 0, top: 500, width: 2316, height: 2588 });

// Social card and touch icon.
const avatar = await sharp(`${K}/IMG_0335.JPG`).rotate().extract({ left: 0, top: 20, width: 700, height: 700 }).resize(360, 360)
  .composite([{ input: Buffer.from('<svg width="360" height="360"><circle cx="180" cy="180" r="180" fill="#fff"/></svg>'), blend: 'dest-in' }]).png().toBuffer();
const card = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#fff"/>
<text x="80" y="250" font-family="Helvetica, Arial, sans-serif" font-size="72" font-weight="600" fill="#15171A" letter-spacing="-2">Kean Edwards</text>
<text x="80" y="330" font-family="Helvetica, Arial, sans-serif" font-size="36" fill="#5B6168">Websites, Google profiles, and email</text>
<text x="80" y="380" font-family="Helvetica, Arial, sans-serif" font-size="36" fill="#5B6168">for small businesses and nonprofits.</text>
<text x="80" y="470" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="#C2570C">West Marin, and remote</text></svg>`;
await sharp(Buffer.from(card)).composite([{ input: avatar, left: 770, top: 135 }]).png().toFile('public/og.png');
await sharp(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><rect width="180" height="180" fill="#15171A"/><circle cx="90" cy="90" r="38" fill="#fff"/></svg>')).resize(180, 180).png().toFile('public/apple-touch-icon.png');

const size = (await stat('public/images/kean/hero.webp')).size;
console.log('done', Object.keys(shots).length, 'screenshots, hero', Math.round(size / 1024), 'KB');
