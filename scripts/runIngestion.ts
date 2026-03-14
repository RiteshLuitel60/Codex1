import { runSingleIngestionPass } from "@/lib/ingestion/pipeline";

async function main() {
  const reports = await runSingleIngestionPass();
  console.table(reports.map((entry) => ({ url: entry.url, trustScore: entry.trustScore })));
}

void main();
