export type SourceSignals = {
  baseCredibility: number;
  recencyWeight: number;
  officialSignal: number;
  independentSignal: number;
  transparencySignal: number;
};

export type SourceScore = {
  score: number;
  tier: 'A' | 'B' | 'C' | 'D';
};

export function scoreSource(signal: SourceSignals): SourceScore {
  const weighted =
    signal.baseCredibility * 0.4 +
    signal.recencyWeight * 0.1 +
    signal.officialSignal * 0.2 +
    signal.independentSignal * 0.15 +
    signal.transparencySignal * 0.15;

  const score = Number(Math.min(Math.max(weighted, 0), 1).toFixed(3));

  if (score >= 0.9) return { score, tier: 'A' };
  if (score >= 0.8) return { score, tier: 'B' };
  if (score >= 0.65) return { score, tier: 'C' };
  return { score, tier: 'D' };
}

export function detectConflict(candidateNames: string[]) {
  const normalized = candidateNames.map((name) => name.trim().toLowerCase());
  const unique = new Set(normalized);
  return {
    conflicting: unique.size > 1,
    disagreementRatio: unique.size / Math.max(normalized.length, 1)
  };
}

export function calculateConfidence(sourceScores: number[], conflictPenalty = 0) {
  const baseline = sourceScores.reduce((sum, value) => sum + value, 0) / Math.max(sourceScores.length, 1);
  return Number(Math.max(0, Math.min(1, baseline - conflictPenalty)).toFixed(3));
}
