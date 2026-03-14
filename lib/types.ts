export type CountrySummary = {
  code: string;
  name: string;
  flagEmoji: string;
  region: string;
  primaryLeader: string;
  confidenceScore: number;
};

export type LeaderRole = {
  role: string;
  name: string;
  officialTitle: string;
  assumedOffice: string;
  predecessor: string;
  affiliation?: string;
};

export type SourceRecord = {
  publisher: string;
  url: string;
  trustScore: number;
  verifiedAt: string;
};

export type TimelineEntry = {
  role: string;
  leaderName: string;
  assumedOffice: string;
  endedOffice?: string;
};

export type CountryDetail = CountrySummary & {
  governmentType: string;
  neutralProfile: string;
  lastVerifiedAt: string;
  leaders: LeaderRole[];
  citations: SourceRecord[];
  timeline: TimelineEntry[];
};
