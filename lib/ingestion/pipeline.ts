import { sourceCatalog } from "./sourceCatalog";
import { fetchRenderedHtml, extractLeaderHints } from "./scrapers";
import { rankSourceTrust } from "@/lib/scoring/sourceRanker";

export async function runSingleIngestionPass() {
  const reports = [] as Array<{ url: string; trustScore: number; preview: string }>;

  for (const source of sourceCatalog) {
    const html = await fetchRenderedHtml(source.url);
    const hints = extractLeaderHints(html);
    const ranked = rankSourceTrust({
      url: source.url,
      publisherType: source.type,
      updatedAt: new Date().toISOString(),
      historicalAccuracy: source.type === "official_gov" ? 0.98 : 0.7
    });

    reports.push({
      url: source.url,
      trustScore: ranked.trustScore,
      preview: hints.bodyPreview
    });
  }

  return reports;
}
