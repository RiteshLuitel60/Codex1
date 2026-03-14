const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const base = 'http://localhost:3003';
const routes = ['/', '/countries', '/tracker', '/methodology', '/admin/conflicts', '/countries/united-states'];
const themes = ['light', 'dark', 'aurora', 'sunset', 'forest'];
const outDir = path.resolve('.artifacts/qa-screenshots');
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const issues = [];

  for (const theme of themes) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.addInitScript((t) => {
      localStorage.setItem('theme', t);
    }, theme);

    const page = await context.newPage();
    const consoleErrors = [];
    page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(`console.error: ${msg.text()}`);
    });

    for (const route of routes) {
      const url = `${base}${route}`;
      try {
        const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
        const status = res ? res.status() : 0;
        if (status >= 400 || status === 0) {
          issues.push({ theme, route, type: 'http', detail: `status ${status}` });
          continue;
        }

        await page.waitForTimeout(400);
        const overflow = await page.evaluate(() => ({
          h: document.documentElement.scrollWidth > window.innerWidth + 1,
          sw: document.documentElement.scrollWidth,
          iw: window.innerWidth,
        }));

        if (overflow.h) {
          issues.push({ theme, route, type: 'layout', detail: `horizontal overflow ${overflow.sw}>${overflow.iw}` });
        }

        const fileSafe = route === '/' ? 'home' : route.replace(/\//g, '_').replace(/^_/, '');
        await page.screenshot({ path: path.join(outDir, `${theme}-${fileSafe}.png`), fullPage: true });
      } catch (error) {
        issues.push({ theme, route, type: 'exception', detail: error instanceof Error ? error.message : String(error) });
      }
    }

    if (consoleErrors.length) {
      issues.push({ theme, route: '*', type: 'console', detail: consoleErrors.slice(0, 10).join(' | ') });
    }

    await context.close();
  }

  await browser.close();

  const reportPath = path.join(outDir, 'qa-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({ base, routes, themes, issues }, null, 2));

  if (issues.length > 0) {
    console.log(`QA issues found: ${issues.length}`);
    for (const issue of issues.slice(0, 20)) {
      console.log(`[${issue.type}] ${issue.theme} ${issue.route} :: ${issue.detail}`);
    }
    process.exit(2);
  }

  console.log('QA passed with no issues.');
  console.log(`Report: ${reportPath}`);
})();
