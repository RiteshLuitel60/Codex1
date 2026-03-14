import type { CountryDetail, CountrySummary } from "@/lib/types";

export const countries: CountrySummary[] = [
  {
    code: "fr",
    name: "France",
    flagEmoji: "🇫🇷",
    region: "Europe",
    primaryLeader: "Emmanuel Macron · President",
    confidenceScore: 96
  },
  {
    code: "jp",
    name: "Japan",
    flagEmoji: "🇯🇵",
    region: "Asia",
    primaryLeader: "Shigeru Ishiba · Prime Minister",
    confidenceScore: 91
  },
  {
    code: "za",
    name: "South Africa",
    flagEmoji: "🇿🇦",
    region: "Africa",
    primaryLeader: "Cyril Ramaphosa · President",
    confidenceScore: 89
  }
];

export const countryDetails: Record<string, CountryDetail> = {
  fr: {
    ...countries[0],
    governmentType: "Unitary semi-presidential republic",
    neutralProfile:
      "France is a sovereign state in Western Europe with a dual-executive system where the President and Prime Minister share executive responsibilities.",
    lastVerifiedAt: "2026-03-14T06:30:00Z",
    leaders: [
      {
        role: "Head of State",
        name: "Emmanuel Macron",
        officialTitle: "President of the French Republic",
        assumedOffice: "2017-05-14",
        predecessor: "François Hollande",
        affiliation: "Renaissance"
      },
      {
        role: "Head of Government",
        name: "François Bayrou",
        officialTitle: "Prime Minister of France",
        assumedOffice: "2025-12-13",
        predecessor: "Michel Barnier",
        affiliation: "MoDem"
      }
    ],
    citations: [
      {
        publisher: "Élysée",
        url: "https://www.elysee.fr/en/emmanuel-macron",
        trustScore: 99,
        verifiedAt: "2026-03-14T06:25:00Z"
      },
      {
        publisher: "Government of France",
        url: "https://www.gouvernement.fr/en/composition-of-the-government",
        trustScore: 97,
        verifiedAt: "2026-03-14T06:30:00Z"
      }
    ],
    timeline: [
      { role: "President", leaderName: "Emmanuel Macron", assumedOffice: "2017-05-14" },
      { role: "President", leaderName: "François Hollande", assumedOffice: "2012-05-15", endedOffice: "2017-05-14" }
    ]
  },
  jp: {
    ...countries[1],
    governmentType: "Unitary parliamentary constitutional monarchy",
    neutralProfile: "Japan operates as a parliamentary constitutional monarchy with executive authority exercised by the Cabinet led by the Prime Minister.",
    lastVerifiedAt: "2026-03-14T06:30:00Z",
    leaders: [
      {
        role: "Head of Government",
        name: "Shigeru Ishiba",
        officialTitle: "Prime Minister of Japan",
        assumedOffice: "2024-10-01",
        predecessor: "Fumio Kishida",
        affiliation: "Liberal Democratic Party"
      }
    ],
    citations: [
      {
        publisher: "Prime Minister's Office of Japan",
        url: "https://japan.kantei.go.jp/",
        trustScore: 99,
        verifiedAt: "2026-03-14T06:30:00Z"
      }
    ],
    timeline: [
      { role: "Prime Minister", leaderName: "Shigeru Ishiba", assumedOffice: "2024-10-01" }
    ]
  },
  za: {
    ...countries[2],
    governmentType: "Parliamentary republic",
    neutralProfile: "South Africa is a parliamentary republic where the President serves as both head of state and head of government.",
    lastVerifiedAt: "2026-03-14T06:30:00Z",
    leaders: [
      {
        role: "Head of State and Government",
        name: "Cyril Ramaphosa",
        officialTitle: "President of the Republic of South Africa",
        assumedOffice: "2018-02-15",
        predecessor: "Jacob Zuma",
        affiliation: "African National Congress"
      }
    ],
    citations: [
      {
        publisher: "The Presidency Republic of South Africa",
        url: "https://www.thepresidency.gov.za/",
        trustScore: 98,
        verifiedAt: "2026-03-14T06:28:00Z"
      }
    ],
    timeline: [
      { role: "President", leaderName: "Cyril Ramaphosa", assumedOffice: "2018-02-15" }
    ]
  }
};
