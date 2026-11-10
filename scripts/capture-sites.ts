// Takes full-page screenshots of live client sites, so the Work page can scroll through them.
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { projects } from '../src/data/projects';

const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const results: string[] = [];
const only = process.env.ONLY?.split(',');
for (const p of projects.filter((x) => !only || only.includes(x.slug))) {
  const page = await ctx.newPage();
  try {
    const res = await page.goto(p.url, { waitUntil: 'load', timeout: 25_000 });
    if (!res?.ok()) throw new Error(`status ${res?.status()}`);
    await page.waitForTimeout(2500);
    await page.keyboard.press('Escape');
    await page.evaluate(() => {
      // Popups cover the page in a screenshot, so remove anything floating over it.
      document.querySelectorAll<HTMLElement>('body *').forEach((el) => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        if (cs.position === 'fixed' && r.width > 200 && r.height > 120) el.remove();
      });
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(700);
    const shot = await page.screenshot({ fullPage: true, type: 'png' });
    const meta = await sharp(shot).metadata();
    const height = Math.min(meta.height, 3600);
    await sharp(shot).extract({ left: 0, top: 0, width: meta.width, height }).resize({ width: 1000 }).webp({ quality: 70 }).toFile(`public/images/projects/${p.image.split('/').pop()?.replace('.webp', '')}-full.webp`);
    results.push(`ok ${p.slug} ${meta.width}x${meta.height}`);
  } catch (e) {
    results.push(`FAIL ${p.slug}: ${(e as Error).message.split('\n')[0]}`);
  }
  await page.close();
}
await browser.close();
console.log(results.join('\n'));
