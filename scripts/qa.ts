// Opens every page in Chrome at four widths. Reports overflow and console errors, and saves screenshots.
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const base = process.env.BASE ?? 'http://localhost:5290';
const widths = (process.env.WIDTHS ?? '375,768,1024,1440').split(',').map(Number);
const only = process.env.PAGES?.split(',');
const paths = only ?? (await (await fetch(`${base}/sitemap.xml`)).text()).match(/<loc>[^<]+/g)!.map((l) => new URL(l.slice(5)).pathname).concat('/thanks', '/nope-404');
await mkdir('qa-output', { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
const problems: string[] = [];
for (const width of widths) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, hasTouch: width < 800, isMobile: width < 800 });
  const page = await ctx.newPage();
  let at = '';
  page.on('console', (m) => { if (m.type() === 'error' && !/_vercel\/insights|net::ERR_ABORTED|Failed to load resource/.test(m.text())) problems.push(`[console ${width}] ${at}: ${m.text()}`); });
  page.on('pageerror', (e) => problems.push(`[error ${width}] ${at}: ${e.message}`));
  for (const path of paths) {
    at = path;
    await page.goto(base + path, { waitUntil: 'load' });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(650);
    const over = await page.evaluate(() => {
      const w = document.documentElement.clientWidth;
      const bad = [...document.querySelectorAll('body *')].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.right > w + 1 && !el.closest('.trap, .sr-only, .skip, .svc-preview') && getComputedStyle(el).position !== 'fixed';
      });
      return { scroll: document.documentElement.scrollWidth - w, sample: bad.slice(0, 3).map((e) => `${e.tagName}.${String((e as HTMLElement).className).slice(0, 30)}`) };
    });
    if (over.scroll > 0) problems.push(`[overflow ${width}] ${path}: ${over.scroll}px ${over.sample.join(', ')}`);
    const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-reveal]:not(.in)')].length);
    if (hidden) problems.push(`[reveal ${width}] ${path}: ${hidden} items never appeared`);
    const name = path === '/' ? 'home' : path.slice(1).replace(/\//g, '_');
    await page.screenshot({ path: `qa-output/${name}-${width}.jpg`, fullPage: true, type: 'jpeg', quality: 70 });
  }
  await ctx.close();
}
await browser.close();
console.log(`${paths.length} pages at ${widths.join(', ')}. Problems: ${problems.length}`);
problems.slice(0, 40).forEach((p) => console.log(p));
