import { chromium } from "playwright";
import * as cheerio from "cheerio";

export async function fetchRenderedHtml(url: string) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
  const html = await page.content();
  await browser.close();
  return html;
}

export function extractLeaderHints(html: string) {
  const $ = cheerio.load(html);
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const assumedOffice = bodyText.match(/(assumed office|appointed|in office since)\s*[:\-]?\s*([A-Za-z]+\s\d{1,2},\s\d{4}|\d{4}-\d{2}-\d{2})/i)?.[2];

  return {
    bodyPreview: bodyText.slice(0, 500),
    assumedOffice
  };
}
