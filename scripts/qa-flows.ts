// Drives the header, footer, and lead form in Chrome, the way a visitor would.
import { chromium, type Page } from 'playwright-core';

const base = process.env.BASE ?? 'http://localhost:5290';
const browser = await chromium.launch({ channel: 'chrome', args: ['--use-angle=metal', '--enable-gpu'] });
let pass = 0; const fails: string[] = [];
const ok = (name: string, cond: unknown) => { if (cond) pass++; else fails.push(name); };

/** Catches form sends so no real email goes out. */
const mockForm = async (page: Page, sent: Record<string, string>[]) => page.route('**/formsubmit.co/**', async (r) => {
  sent.push(JSON.parse(r.request().postData() ?? '{}'));
  await r.fulfill({ json: { success: 'true' }, headers: { 'access-control-allow-origin': '*' } });
});

{ // Desktop header and menus
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
  await page.goto(base); await page.waitForTimeout(400);
  const btn = page.getByRole('button', { name: 'Toggle Services menu', exact: true });
  await btn.click();
  ok('services opens', (await page.locator('#panel-Services .drop-group a').count()) === 9);
  await page.keyboard.press('Escape');
  ok('esc closes and returns focus', !(await page.locator('#panel-Services').isVisible()) && await btn.evaluate((el) => el === document.activeElement));
  await page.getByRole('button', { name: 'Toggle About menu', exact: true }).click();
  await page.locator('#panel-About a', { hasText: 'Reviews' }).click(); await page.waitForURL('**/reviews'); await page.waitForTimeout(300);
  ok('child page marks parent', await page.locator('.drop-trigger > a', { hasText: 'About' }).evaluate((e) => e.classList.contains('current')));
  ok('reviews page kept', (await page.locator('.quote').count()) >= 5);
  for (const path of ['/work', '/nonprofits', '/pricing', '/services/seo']) {
    const r = await page.goto(base + path);
    ok(`${path} loads`, r?.ok());
  }
  await ctx.close();
}

{ // The two-step form from the hero
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
  const sent: Record<string, string>[] = []; await mockForm(page, sent);
  await page.goto(base); await page.waitForTimeout(500);
  await page.click('.hero2 .email-start button');
  ok('empty email is caught', (await page.locator('.hero2 .email-start-error').innerText()).length > 0 && !(await page.locator('.lead').count()));
  await page.fill('#email-hero', 'ana@example.com');
  await page.click('.hero2 .email-start button'); await page.waitForTimeout(800);
  ok('panel opens at step two', (await page.locator('.lead-body h2').innerText()).includes('about you'));
  ok('email saved at step one', sent[0]?.email === 'ana@example.com' && sent[0]?.source === 'hero:email');
  ok('scroll locked', (await page.evaluate(() => document.body.style.overflow)) === 'hidden');
  await page.click('.lead-next');
  ok('asks for a name', (await page.locator('.lead-error').innerText()).includes('call you'));
  await page.fill('.lead-fields input[autocomplete=given-name]', 'Ana');
  await page.fill('.lead-fields input[autocomplete=family-name]', 'Ruiz');
  await page.fill('.lead-fields input[autocomplete=organization]', 'Ruiz Plumbing');
  await page.fill('.lead-fields input[autocomplete=tel]', '415-555-0100');
  await page.click('.lead-next'); await page.waitForTimeout(400);
  await page.click('.lead-next');
  ok('asks for a choice', (await page.locator('.lead-error').innerText()).length > 0);
  await page.click('.lead-tiles button:has-text("SEO")'); await page.click('.lead-tiles button:has-text("Website edits")');
  await page.click('.lead-budget button:has-text("Not sure yet")');
  await page.click('.lead-next'); await page.waitForTimeout(700);
  const full = sent[1];
  ok('full lead sent', full?.name === 'Ana Ruiz' && full?.business === 'Ruiz Plumbing' && full?.need === 'SEO, Website edits' && full?.budget === 'Not sure yet' && full?.source === 'hero');
  ok('thanks names them', (await page.locator('.lead-done h2').innerText()).includes('Ana'));
  await page.keyboard.press('Escape'); await page.waitForTimeout(200);
  ok('esc closes', !(await page.locator('.lead').count()));
  ok('scroll unlocked', (await page.evaluate(() => document.body.style.overflow)) === '');
  // Header button starts at step one, and focus stays inside the panel.
  await page.click('.header-cta'); await page.waitForTimeout(700);
  ok('header opens at email step', (await page.locator('.lead-body h2').innerText()).includes('hear from you'));
  for (let i = 0; i < 8; i++) await page.keyboard.press('Tab');
  ok('focus trapped', await page.evaluate(() => !!document.activeElement?.closest('.lead-panel')));
  await page.mouse.click(100, 450); await page.waitForTimeout(200);
  ok('click outside closes', !(await page.locator('.lead').count()));
  // A failed send offers the phone number.
  await page.unroute('**/formsubmit.co/**');
  await page.route('**/formsubmit.co/**', (r) => r.fulfill({ status: 500, body: '' }));
  await page.click('.header-cta'); await page.waitForTimeout(700);
  await page.fill('#lead-email', 'b@example.com'); await page.click('.lead-next'); await page.waitForTimeout(500);
  await page.fill('.lead-fields input[autocomplete=given-name]', 'B'); await page.fill('.lead-fields input[autocomplete=family-name]', 'C'); await page.fill('.lead-fields input[autocomplete=tel]', '415-555-0100'); await page.click('.lead-next'); await page.waitForTimeout(300);
  await page.click('.lead-tiles button:has-text("Small jobs")'); await page.click('.lead-budget button:has-text("Under $2,500")'); await page.click('.lead-next'); await page.waitForTimeout(600);
  ok('failure shows phone', (await page.locator('.lead-error').innerText()).includes('415-930-2468'));
  await ctx.close();
}

{ // Testimonials slow down on hover instead of stopping
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
  await page.goto(base); await page.locator('.ribbon').scrollIntoViewIfNeeded(); await page.waitForTimeout(400);
  await page.locator('.ribbon').hover(); await page.waitForTimeout(200);
  const rate = await page.evaluate(() => document.querySelector('.ribbon-track')!.getAnimations()[0]?.playbackRate);
  const x1 = await page.evaluate(() => document.querySelector('.ribbon-track')!.getBoundingClientRect().x);
  await page.waitForTimeout(800);
  const x2 = await page.evaluate(() => document.querySelector('.ribbon-track')!.getBoundingClientRect().x);
  ok('hover slows the ribbon', rate === 0.25 && x2 < x1);
  ok('heading says Testimonials', await page.locator('h2', { hasText: 'Testimonials' }).isVisible());
  await ctx.close();
}

{ // Phones
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }); const page = await ctx.newPage();
  const sent: Record<string, string>[] = []; await mockForm(page, sent);
  await page.goto(base); await page.waitForTimeout(400);
  await page.locator('.menu-btn').tap();
  ok('menu opens', await page.locator('.sheet').isVisible());
  await page.locator('.sheet-contact button', { hasText: 'Hire me' }).tap(); await page.waitForTimeout(700);
  ok('menu button opens form', await page.locator('.lead-panel').isVisible() && !(await page.locator('.sheet').count()));
  await page.locator('.lead-close').tap(); await page.waitForTimeout(200);
  await page.evaluate(() => window.scrollTo(0, 1400)); await page.waitForTimeout(400);
  ok('bar shows after hero', await page.locator('.mobile-bar.show').isVisible());
  await page.locator('.mobile-bar-main').tap(); await page.waitForTimeout(700);
  ok('bar opens form', await page.locator('.lead-panel').isVisible());
  const w = await page.evaluate(() => document.querySelector<HTMLElement>('.lead-panel')!.getBoundingClientRect().width);
  ok('panel fills the phone', w >= 389);
  await ctx.close();
}

{ // Banner
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
  await page.goto(base); await page.waitForTimeout(300);
  ok('no banner on home', !(await page.locator('.banner').count()));
  await page.goto(`${base}/work`); await page.waitForTimeout(300);
  ok('banner shows elsewhere', await page.locator('.banner').isVisible());
  await page.locator('.banner-close').click(); await page.goto(`${base}/reviews`); await page.waitForTimeout(300);
  ok('dismiss remembered', !(await page.locator('.banner').count()));
  await ctx.close();
}

await browser.close();
console.log(`Passed ${pass}, failed ${fails.length}`);
fails.forEach((f) => console.log('FAIL', f));
