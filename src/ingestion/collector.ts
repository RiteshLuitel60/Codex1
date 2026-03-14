import * as cheerio from 'cheerio';
import { chromium } from 'playwright';

export type CollectedRecord = {
  role: string;
  leaderName: string;
  officialTitle: string;
  assumedOfficeAt?: string;
  sourceUrl: string;
};

export async function collectLeadersFromSource(url: string): Promise<CollectedRecord[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  const html = await page.content();
  await browser.close();

  const $ = cheerio.load(html);
  const rows: CollectedRecord[] = [];

  $('[data-leader-role]').each((_, element) => {
    const role = $(element).attr('data-leader-role')?.trim();
    const leaderName = $(element).find('[data-leader-name]').text().trim();

    if (!role || !leaderName) {
      return;
    }

    rows.push({
      role,
      leaderName,
      officialTitle: $(element).find('[data-leader-title]').text().trim() || role,
      assumedOfficeAt: $(element).find('[data-leader-assumed]').text().trim() || undefined,
      sourceUrl: url
    });
  });

  return rows;
}
