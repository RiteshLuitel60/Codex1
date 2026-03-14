export type SourceEvidence = {
  url: string;
  publisherType: "official_gov" | "igo" | "newswire" | "academic" | "other";
  updatedAt: string;
  historicalAccuracy: number;
};

const publisherWeights: Record<SourceEvidence["publisherType"], number> = {
  official_gov: 1,
  igo: 0.9,
  academic: 0.78,
  newswire: 0.74,
  other: 0.5
};

export function rankSourceTrust(evidence: SourceEvidence) {
  const daysOld = Math.max(1, (Date.now() - new Date(evidence.updatedAt).valueOf()) / (1000 * 60 * 60 * 24));
  const recencyFactor = Math.max(0.4, 1 - daysOld / 365);
  const score = Math.round((publisherWeights[evidence.publisherType] * 0.5 + evidence.historicalAccuracy * 0.35 + recencyFactor * 0.15) * 100);

  return {
    ...evidence,
    trustScore: Math.min(100, Math.max(0, score))
  };
}

export function aggregateConfidence(scores: number[]) {
  if (!scores.length) return 0;
  const weighted = scores.sort((a, b) => b - a).map((score, index) => score * (1 - index * 0.08));
  return Math.max(0, Math.min(100, Math.round(weighted.reduce((sum, value) => sum + value, 0) / weighted.length)));
}
