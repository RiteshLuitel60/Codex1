import { calculateConfidence } from '@/lib/source-ranking';

type RestCountry = {
  cca2?: string;
  cca3?: string;
  name?: { common?: string };
  region?: string;
  subregion?: string;
  flag?: string;
};

type SparqlValue = {
  type: string;
  value: string;
};

type SparqlBinding = {
  iso2?: SparqlValue;
  headOfState?: SparqlValue;
  headOfStateLabel?: SparqlValue;
  headOfStateStart?: SparqlValue;
  headOfGovernment?: SparqlValue;
  headOfGovernmentLabel?: SparqlValue;
  headOfGovernmentStart?: SparqlValue;
};

type SparqlResponse = {
  results?: {
    bindings?: SparqlBinding[];
  };
};

type LeaderCandidate = {
  qid?: string;
  name: string;
  startDate?: string;
};

type LeadersByIso2 = {
  headOfState?: LeaderCandidate;
  headOfGovernment?: LeaderCandidate;
};

type LiveCitation = {
  id: string;
  url: string;
  excerpt: string;
  trustScore: number;
  retrievedAt: Date;
  source: {
    id: string;
    name: string;
  };
};

type LiveAssignment = {
  id: string;
  role: string;
  officialTitle: string;
  assumedOfficeAt: Date;
  predecessor: string | null;
  isCurrent: boolean;
  sourceConfidence: number;
  updatedAt: Date;
  leader: {
    id: string;
    fullName: string;
    party: string | null;
    profile: string;
  };
  citations: LiveCitation[];
};

type LiveSnapshot = {
  id: string;
  confidenceScore: number;
  conflictDetected: boolean;
  capturedAt: Date;
  country: { name: string };
};

export type LiveCountry = {
  id: string;
  iso2: string;
  iso3: string;
  name: string;
  slug: string;
  region: string;
  governmentType: string;
  flagEmoji: string;
  profile: string;
  leaderAssignments: LiveAssignment[];
  verificationSnapshots: LiveSnapshot[];
};

export type LiveConflict = {
  id: string;
  countryId: string;
  role: string;
  summary: string;
  evidence: {
    missingRoles: string[];
  };
  status: 'OPEN';
  confidenceDelta: number;
  createdAt: Date;
  resolvedAt: Date | null;
};

type LiveSource = {
  id: string;
  domain: string;
  name: string;
  type: 'OFFICIAL_GOVERNMENT' | 'INTERGOVERNMENTAL' | 'TRUSTED_MEDIA' | 'ACADEMIC';
  baseCredibility: number;
  recencyWeight: number;
  officialSignal: number;
  independentSignal: number;
  transparencySignal: number;
};

const LIVE_REVALIDATE_SECONDS = 60 * 30;
const FETCH_TIMEOUT_MS = 20_000;

const liveSources: LiveSource[] = [
  {
    id: 'src-wikidata',
    domain: 'wikidata.org',
    name: 'Wikidata',
    type: 'INTERGOVERNMENTAL',
    baseCredibility: 0.9,
    recencyWeight: 0.86,
    officialSignal: 0.78,
    independentSignal: 0.94,
    transparencySignal: 0.96
  },
  {
    id: 'src-restcountries',
    domain: 'restcountries.com',
    name: 'REST Countries',
    type: 'INTERGOVERNMENTAL',
    baseCredibility: 0.84,
    recencyWeight: 0.86,
    officialSignal: 0.68,
    independentSignal: 0.88,
    transparencySignal: 0.86
  }
];

let datasetPromise: Promise<LiveCountry[]> | null = null;

function toSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseIso2FromEntityUri(uri?: string) {
  if (!uri) {
    return undefined;
  }

  const match = uri.match(/\/entity\/(Q\d+)$/);
  return match?.[1];
}

function normalizeIso2(value?: string) {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim().toUpperCase();
  return trimmed.length === 2 ? trimmed : undefined;
}

function parseDate(value?: string) {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? undefined : parsed;
}

async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'world-leaders-atlas/1.0'
      },
      next: { revalidate: LIVE_REVALIDATE_SECONDS },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Failed request ${response.status} for ${url}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchRestCountries() {
  const url =
    'https://restcountries.com/v3.1/all?fields=cca2,cca3,name,region,subregion,flag';
  const rows = await fetchJson<RestCountry[]>(url);

  return rows
    .map((row) => {
      const iso2 = normalizeIso2(row.cca2);
      const iso3 = (row.cca3 ?? '').trim().toUpperCase();
      const name = row.name?.common?.trim() ?? '';

      if (!iso2 || !iso3 || name.length === 0) {
        return null;
      }

      return {
        iso2,
        iso3,
        name,
        region: row.region?.trim() || 'Other',
        subregion: row.subregion?.trim() || undefined,
        flagEmoji: row.flag?.trim() || '🏳️'
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function fetchWikidataLeadersByCountry() {
  const query = `
SELECT ?iso2 ?headOfState ?headOfStateLabel ?headOfStateStart ?headOfGovernment ?headOfGovernmentLabel ?headOfGovernmentStart WHERE {
  ?country wdt:P297 ?iso2.

  OPTIONAL {
    ?country p:P35 ?headOfStateStatement.
    ?headOfStateStatement ps:P35 ?headOfState.
    FILTER NOT EXISTS { ?headOfStateStatement pq:P582 ?headOfStateEnd. }
    OPTIONAL { ?headOfStateStatement pq:P580 ?headOfStateStart. }
  }

  OPTIONAL {
    ?country p:P6 ?headOfGovernmentStatement.
    ?headOfGovernmentStatement ps:P6 ?headOfGovernment.
    FILTER NOT EXISTS { ?headOfGovernmentStatement pq:P582 ?headOfGovernmentEnd. }
    OPTIONAL { ?headOfGovernmentStatement pq:P580 ?headOfGovernmentStart. }
  }

  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}`;

  const encoded = encodeURIComponent(query.trim());
  const endpoint = `https://query.wikidata.org/sparql?format=json&query=${encoded}`;
  const payload = await fetchJson<SparqlResponse>(endpoint);

  const map = new Map<string, LeadersByIso2>();

  for (const row of payload.results?.bindings ?? []) {
    const iso2 = normalizeIso2(row.iso2?.value);
    if (!iso2) {
      continue;
    }

    const existing = map.get(iso2) ?? {};

    const headOfStateLabel = row.headOfStateLabel?.value?.trim();
    if (headOfStateLabel && !existing.headOfState) {
      existing.headOfState = {
        name: headOfStateLabel,
        qid: parseIso2FromEntityUri(row.headOfState?.value),
        startDate: row.headOfStateStart?.value
      };
    }

    const headOfGovernmentLabel = row.headOfGovernmentLabel?.value?.trim();
    if (headOfGovernmentLabel && !existing.headOfGovernment) {
      existing.headOfGovernment = {
        name: headOfGovernmentLabel,
        qid: parseIso2FromEntityUri(row.headOfGovernment?.value),
        startDate: row.headOfGovernmentStart?.value
      };
    }

    map.set(iso2, existing);
  }

  return map;
}

function buildCitation(role: string, iso2: string, person: LeaderCandidate, retrievedAt: Date): LiveCitation {
  const qid = person.qid;
  return {
    id: `citation-${iso2}-${role.toLowerCase().replace(/\s+/g, '-')}`,
    url: qid ? `https://www.wikidata.org/wiki/${qid}` : 'https://www.wikidata.org/',
    excerpt: `Live verification record for ${person.name} (${role}) from Wikidata current-office statements.`,
    trustScore: 0.9,
    retrievedAt,
    source: {
      id: 'src-wikidata',
      name: 'Wikidata'
    }
  };
}

function buildAssignments(iso2: string, leaders: LeadersByIso2 | undefined, retrievedAt: Date) {
  const roles: Array<
    [
      role: string,
      officialTitle: string,
      candidate: LeaderCandidate | undefined,
      confidence: number
    ]
  > = [
    ['Head of State', 'Head of State', leaders?.headOfState, 0.9],
    ['Head of Government', 'Head of Government', leaders?.headOfGovernment, 0.88]
  ];

  return roles
    .filter(([, , candidate]) => Boolean(candidate?.name))
    .map(([role, officialTitle, candidate, confidence]) => {
      const person = candidate as LeaderCandidate;

      return {
        id: `assignment-${iso2}-${role.toLowerCase().replace(/\s+/g, '-')}`,
        role,
        officialTitle,
        assumedOfficeAt: parseDate(person.startDate) ?? retrievedAt,
        predecessor: null,
        isCurrent: true,
        sourceConfidence: confidence,
        updatedAt: retrievedAt,
        leader: {
          id: `leader-${iso2}-${person.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          fullName: person.name,
          party: null,
          profile: `${person.name} currently holds the role of ${role.toLowerCase()} based on live Wikidata office records.`
        },
        citations: [buildCitation(role, iso2, person, retrievedAt)]
      };
    });
}

async function buildLiveDataset() {
  const retrievedAt = new Date();
  const [countryRows, leaderRows] = await Promise.all([fetchRestCountries(), fetchWikidataLeadersByCountry()]);

  return countryRows.map((country) => {
    const leaders = leaderRows.get(country.iso2);
    const assignments = buildAssignments(country.iso2, leaders, retrievedAt);
    const confidence = calculateConfidence(assignments.map((assignment) => assignment.sourceConfidence));

    return {
      id: `country-${country.iso2.toLowerCase()}`,
      iso2: country.iso2,
      iso3: country.iso3,
      name: country.name,
      slug: toSlug(country.name),
      region: country.region,
      governmentType: country.subregion
        ? `Government system varies (${country.subregion})`
        : 'Government system varies by constitution',
      flagEmoji: country.flagEmoji,
      profile: `${country.name} is listed in REST Countries and leadership roles are validated from live Wikidata records.`,
      leaderAssignments: assignments,
      verificationSnapshots: [
        {
          id: `snapshot-${country.iso2.toLowerCase()}`,
          confidenceScore: confidence,
          conflictDetected: false,
          capturedAt: retrievedAt,
          country: { name: country.name }
        }
      ]
    } satisfies LiveCountry;
  });
}

async function getDataset() {
  datasetPromise ??= buildLiveDataset().catch((error) => {
    datasetPromise = null;
    throw error;
  });

  return datasetPromise;
}

export async function getLiveCountries(search?: string, region?: string) {
  const rows = await getDataset();

  const searchTerm = search?.trim().toLowerCase();
  const regionTerm = region?.trim().toLowerCase();

  return rows.filter((country) => {
    const bySearch = !searchTerm || country.name.toLowerCase().includes(searchTerm);
    const byRegion = !regionTerm || country.region.toLowerCase().includes(regionTerm);
    return bySearch && byRegion;
  });
}

export async function getLiveCountryBySlug(slug: string) {
  const rows = await getDataset();
  return rows.find((country) => country.slug === slug) ?? null;
}

export async function getLiveOpenConflicts() {
  const rows = await getDataset();

  return rows
    .filter((country) => country.leaderAssignments.length === 0)
    .map((country) => ({
      id: `conflict-${country.iso2.toLowerCase()}`,
      countryId: country.id,
      role: 'Leader verification gap',
      summary: 'No current head of state or head of government was resolved from live source statements.',
      evidence: { missingRoles: ['Head of State', 'Head of Government'] },
      status: 'OPEN' as const,
      confidenceDelta: 0.35,
      createdAt: new Date(),
      resolvedAt: null
    }))
    .slice(0, 50);
}

export async function getLiveRecentSnapshots() {
  const rows = await getDataset();

  return rows
    .flatMap((country) =>
      country.verificationSnapshots.map((snapshot) => ({
        ...snapshot,
        country: { name: country.name }
      }))
    )
    .sort((a, b) => b.capturedAt.getTime() - a.capturedAt.getTime())
    .slice(0, 50);
}

export function getLiveSources() {
  return liveSources;
}
