import { aggregateConfidence } from "./sourceRanker";

export type CandidateLeader = {
  sourceUrl: string;
  role: string;
  name: string;
  assumedOffice: string;
  predecessor?: string;
  sourceTrust: number;
};

export function detectConflicts(candidates: CandidateLeader[]) {
  const grouped = new Map<string, CandidateLeader[]>();

  for (const candidate of candidates) {
    const key = candidate.role.toLowerCase();
    grouped.set(key, [...(grouped.get(key) ?? []), candidate]);
  }

  const conflicts = Array.from(grouped.entries())
    .map(([role, set]) => {
      const names = new Set(set.map((item) => item.name.toLowerCase()));
      const dates = new Set(set.map((item) => item.assumedOffice));
      const confidence = aggregateConfidence(set.map((item) => item.sourceTrust));

      return {
        role,
        hasConflict: names.size > 1 || dates.size > 1,
        confidence,
        candidates: set.sort((a, b) => b.sourceTrust - a.sourceTrust)
      };
    })
    .sort((a, b) => Number(b.hasConflict) - Number(a.hasConflict));

  return conflicts;
}
