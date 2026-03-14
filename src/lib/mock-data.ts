export const mockCountries = [
  {
    id: 'country-fr',
    iso2: 'FR',
    iso3: 'FRA',
    name: 'France',
    slug: 'france',
    region: 'Europe',
    governmentType: 'Semi-presidential republic',
    flagEmoji: '🇫🇷',
    profile:
      'France is a sovereign nation in Western Europe with a semi-presidential system that divides power between a president and prime minister.',
    leaderAssignments: [
      {
        id: 'assign-fr-1',
        role: 'Head of State',
        officialTitle: 'President of the French Republic',
        assumedOfficeAt: new Date('2017-05-14'),
        predecessor: 'François Hollande',
        isCurrent: true,
        sourceConfidence: 0.95,
        updatedAt: new Date(),
        leader: {
          id: 'leader-fr-1',
          fullName: 'Emmanuel Macron',
          party: 'Renaissance',
          profile:
            'French statesman serving as President since 2017. This profile is neutral and citation-backed in production mode.'
        },
        citations: [
          {
            id: 'cit-fr-1',
            url: 'https://www.elysee.fr/en/emmanuel-macron',
            trustScore: 0.97,
            retrievedAt: new Date(),
            source: { id: 'src-elysee', name: 'Élysée Palace' }
          }
        ]
      }
    ],
    verificationSnapshots: [
      {
        id: 'snap-fr-1',
        confidenceScore: 0.95,
        conflictDetected: false,
        capturedAt: new Date(),
        country: { name: 'France' }
      }
    ]
  },
  {
    id: 'country-jp',
    iso2: 'JP',
    iso3: 'JPN',
    name: 'Japan',
    slug: 'japan',
    region: 'Asia',
    governmentType: 'Constitutional monarchy with parliamentary government',
    flagEmoji: '🇯🇵',
    profile:
      'Japan is a sovereign island nation in East Asia with a parliamentary constitutional monarchy.',
    leaderAssignments: [
      {
        id: 'assign-jp-1',
        role: 'Head of Government',
        officialTitle: 'Prime Minister of Japan',
        assumedOfficeAt: new Date('2024-10-01'),
        predecessor: 'Fumio Kishida',
        isCurrent: true,
        sourceConfidence: 0.92,
        updatedAt: new Date(),
        leader: {
          id: 'leader-jp-1',
          fullName: 'Shigeru Ishiba',
          party: 'Liberal Democratic Party',
          profile: 'Japanese politician serving as Prime Minister.'
        },
        citations: [
          {
            id: 'cit-jp-1',
            url: 'https://japan.kantei.go.jp/',
            trustScore: 0.95,
            retrievedAt: new Date(),
            source: { id: 'src-kantei', name: 'Prime Minister’s Office of Japan' }
          }
        ]
      }
    ],
    verificationSnapshots: [
      {
        id: 'snap-jp-1',
        confidenceScore: 0.92,
        conflictDetected: false,
        capturedAt: new Date(),
        country: { name: 'Japan' }
      }
    ]
  }
] as const;

export const mockSources = [
  {
    id: 'src-elysee',
    domain: 'elysee.fr',
    name: 'Élysée Palace',
    type: 'OFFICIAL_GOVERNMENT',
    baseCredibility: 0.96,
    recencyWeight: 0.91,
    officialSignal: 1,
    independentSignal: 0.82,
    transparencySignal: 0.95
  },
  {
    id: 'src-kantei',
    domain: 'japan.kantei.go.jp',
    name: 'Prime Minister’s Office of Japan',
    type: 'OFFICIAL_GOVERNMENT',
    baseCredibility: 0.95,
    recencyWeight: 0.9,
    officialSignal: 1,
    independentSignal: 0.8,
    transparencySignal: 0.93
  }
] as const;

export const mockConflicts = [] as Array<{
  id: string;
  role: string;
  summary: string;
  confidenceDelta: number;
  createdAt: Date;
}>;
