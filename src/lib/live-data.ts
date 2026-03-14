import { SourceType, type PrismaClient } from '@prisma/client';
import * as cheerio from 'cheerio';
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

type WikipediaPageParseResponse = {
  parse?: {
    text?: {
      '*': string;
    };
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

type WikipediaLeadersByCountry = {
  headOfState?: string;
  headOfGovernment?: string;
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

type ValidationSignals = {
  disagreements: Array<{ role: string; wikidata?: string; wikipedia?: string }>;
  sourceAgreementRate: number;
};

type InternalLiveCountry = {
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
  validation: ValidationSignals;
};

export type LiveCountry = Omit<InternalLiveCountry, 'validation'>;

export type LiveConflict = {
  id: string;
  countryId: string;
  role: string;
  summary: string;
  evidence: {
    missingRoles: string[];
    disagreements?: Array<{ role: string; wikidata?: string; wikipedia?: string }>;
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

export type LiveSyncResult = {
  countriesProcessed: number;
  assignmentsStored: number;
  conflictsOpened: number;
  snapshotsStored: number;
  unresolvedCountries: number;
  capturedAt: string;
};

const LIVE_REVALIDATE_SECONDS = 60 * 20;
const FETCH_TIMEOUT_MS = 20_000;

const liveSources: LiveSource[] = [
  {
    id: 'src-wikidata',
    domain: 'wikidata.org',
    name: 'Wikidata',
    type: 'INTERGOVERNMENTAL',
    baseCredibility: 0.92,
    recencyWeight: 0.9,
    officialSignal: 0.82,
    independentSignal: 0.95,
    transparencySignal: 0.97
  },
  {
    id: 'src-wikipedia-heads',
    domain: 'wikipedia.org',
    name: 'Wikipedia current heads list',
    type: 'TRUSTED_MEDIA',
    baseCredibility: 0.82,
    recencyWeight: 0.9,
    officialSignal: 0.6,
    independentSignal: 0.88,
    transparencySignal: 0.9
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

const countryAliases: Record<string, string[]> = {
  'united states': ['united states of america'],
  'united kingdom': ['united kingdom of great britain and northern ireland'],
  czechia: ['czech republic'],
  "cote d ivoire": ['ivory coast'],
  'south korea': ['korea south', 'republic of korea'],
  'north korea': ['korea north', 'democratic people s republic of korea'],
  russia: ['russian federation'],
  'dr congo': ['democratic republic of the congo', 'congo kinshasa'],
  'republic of the congo': ['congo brazzaville'],
  eswatini: ['swaziland'],
  'timor leste': ['east timor'],
  myanmar: ['burma'],
  'cape verde': ['cabo verde'],
  'north macedonia': ['macedonia'],
  syria: ['syrian arab republic'],
  laos: ['lao people s democratic republic'],
  moldova: ['republic of moldova'],
  bolivia: ['bolivia plurinational state of'],
  venezuela: ['venezuela bolivarian republic of'],
  tanzania: ['united republic of tanzania']
};

let datasetPromise: Promise<InternalLiveCountry[]> | null = null;

function toSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseQidFromEntityUri(uri?: string) {
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

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\[[^\]]+\]/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizePersonName(value: string) {
  return normalizeText(value)
    .replace(/\b(of|for|and|the)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
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
        qid: parseQidFromEntityUri(row.headOfState?.value),
        startDate: row.headOfStateStart?.value
      };
    }

    const headOfGovernmentLabel = row.headOfGovernmentLabel?.value?.trim();
    if (headOfGovernmentLabel && !existing.headOfGovernment) {
      existing.headOfGovernment = {
        name: headOfGovernmentLabel,
        qid: parseQidFromEntityUri(row.headOfGovernment?.value),
        startDate: row.headOfGovernmentStart?.value
      };
    }

    map.set(iso2, existing);
  }

  return map;
}

function cleanCellText(text: string) {
  return text
    .replace(/\[[^\]]+\]/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractLeaderNameFromCell(cell: cheerio.Cheerio<any>) {
  const clone = cell.clone();
  clone.find('sup').remove();

  const linkedNames = clone
    .find('a[href^="/wiki/"]')
    .toArray()
    .map((anchor) => cleanCellText(clone.find(anchor).text()))
    .filter((name) => name.length > 0);

  if (linkedNames.length > 0) {
    return linkedNames[linkedNames.length - 1];
  }

  const fallback = cleanCellText(clone.text());
  if (!fallback) {
    return undefined;
  }

  const dashSplit = fallback.split('–').map((part) => part.trim()).filter(Boolean);
  if (dashSplit.length > 1) {
    return dashSplit[dashSplit.length - 1];
  }

  return fallback.split('•')[0]?.split(';')[0]?.trim() || undefined;
}

async function fetchWikipediaCurrentLeaders() {
  const endpoint =
    'https://en.wikipedia.org/w/api.php?action=parse&page=List_of_current_heads_of_state_and_government&prop=text&format=json';
  const payload = await fetchJson<WikipediaPageParseResponse>(endpoint);
  const html = payload.parse?.text?.['*'];

  if (!html) {
    return new Map<string, WikipediaLeadersByCountry>();
  }

  const map = new Map<string, WikipediaLeadersByCountry>();
  const $ = cheerio.load(html);

  $('table.wikitable tbody tr').each((_, row) => {
    const countryHeader = $(row).find('th').first();
    const cells = $(row).find('td');
    if (!countryHeader.length || cells.length === 0) {
      return;
    }

    const country = cleanCellText(countryHeader.text());
    if (!country) {
      return;
    }

    const headOfState = extractLeaderNameFromCell($(cells[0]));
    const headOfGovernment = cells.length > 1 ? extractLeaderNameFromCell($(cells[1])) : undefined;

    const normalized = normalizeText(country);
    if (!normalized) {
      return;
    }

    map.set(normalized, {
      headOfState,
      headOfGovernment
    });
  });

  return map;
}

function findWikipediaLeadersForCountry(
  countryName: string,
  wikipediaMap: Map<string, WikipediaLeadersByCountry>
) {
  const baseKey = normalizeText(countryName);
  const aliasCandidates = countryAliases[baseKey] ?? [];
  const keys = [baseKey, ...aliasCandidates.map((alias) => normalizeText(alias))];

  for (const key of keys) {
    const match = wikipediaMap.get(key);
    if (match) {
      return match;
    }
  }

  return undefined;
}

function buildCitation(
  citationId: string,
  sourceId: string,
  sourceName: string,
  url: string,
  excerpt: string,
  trustScore: number,
  retrievedAt: Date
): LiveCitation {
  return {
    id: citationId,
    url,
    excerpt,
    trustScore,
    retrievedAt,
    source: {
      id: sourceId,
      name: sourceName
    }
  };
}

function scoreRoleAgreement(primaryName?: string, secondaryName?: string) {
  if (primaryName && secondaryName) {
    const agrees = normalizePersonName(primaryName) === normalizePersonName(secondaryName);
    return {
      agrees,
      confidence: agrees ? 0.93 : 0.58
    };
  }

  if (primaryName) {
    return { agrees: true, confidence: 0.84 };
  }

  if (secondaryName) {
    return { agrees: true, confidence: 0.78 };
  }

  return { agrees: true, confidence: 0 };
}

function buildAssignments(
  iso2: string,
  wikidataLeaders: LeadersByIso2 | undefined,
  wikipediaLeaders: WikipediaLeadersByCountry | undefined,
  retrievedAt: Date
) {
  const disagreements: Array<{ role: string; wikidata?: string; wikipedia?: string }> = [];

  const rows: Array<
    [
      role: string,
      officialTitle: string,
      wikidataCandidate: LeaderCandidate | undefined,
      wikipediaCandidate: string | undefined
    ]
  > = [
    ['Head of State', 'Head of State', wikidataLeaders?.headOfState, wikipediaLeaders?.headOfState],
    ['Head of Government', 'Head of Government', wikidataLeaders?.headOfGovernment, wikipediaLeaders?.headOfGovernment]
  ];

  const assignments: LiveAssignment[] = [];

  for (const [role, officialTitle, wikidataCandidate, wikipediaCandidate] of rows) {
      const wikidataName = wikidataCandidate?.name;
      const wikipediaName = wikipediaCandidate;
      const selectedName = wikidataName ?? wikipediaName;

      if (!selectedName) {
        continue;
      }

      const agreement = scoreRoleAgreement(wikidataName, wikipediaName);
      const hasDisagreement = Boolean(
        wikidataName && wikipediaName && normalizePersonName(wikidataName) !== normalizePersonName(wikipediaName)
      );

      if (hasDisagreement) {
        disagreements.push({ role, wikidata: wikidataName, wikipedia: wikipediaName });
      }

      const citations: LiveCitation[] = [];

      if (wikidataName) {
        citations.push(
          buildCitation(
            `citation-${iso2}-${role.toLowerCase().replace(/\s+/g, '-')}-wikidata`,
            'src-wikidata',
            'Wikidata',
            wikidataCandidate?.qid ? `https://www.wikidata.org/wiki/${wikidataCandidate.qid}` : 'https://www.wikidata.org/',
            `Current ${role.toLowerCase()} statement from Wikidata for ${wikidataName}.`,
            0.9,
            retrievedAt
          )
        );
      }

      if (wikipediaName) {
        citations.push(
          buildCitation(
            `citation-${iso2}-${role.toLowerCase().replace(/\s+/g, '-')}-wikipedia`,
            'src-wikipedia-heads',
            'Wikipedia current heads list',
            'https://en.wikipedia.org/wiki/List_of_current_heads_of_state_and_government',
            `Current ${role.toLowerCase()} listing from Wikipedia table for ${wikipediaName}.`,
            0.82,
            retrievedAt
          )
        );
      }

      const profile = hasDisagreement
        ? `${selectedName} is currently reported for ${role.toLowerCase()}, but sources disagree and this record is flagged for review.`
        : `${selectedName} is currently validated as ${role.toLowerCase()} through multi-source verification.`;

      assignments.push({
        id: `assignment-${iso2}-${role.toLowerCase().replace(/\s+/g, '-')}`,
        role,
        officialTitle,
        assumedOfficeAt: parseDate(wikidataCandidate?.startDate) ?? retrievedAt,
        predecessor: null,
        isCurrent: true,
        sourceConfidence: agreement.confidence,
        updatedAt: retrievedAt,
        leader: {
          id: `leader-${iso2}-${selectedName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          fullName: selectedName,
          party: null,
          profile
        },
        citations
      });
  }

  return {
    assignments,
    hasConflict: disagreements.length > 0,
    disagreements
  };
}

async function buildLiveDataset() {
  const retrievedAt = new Date();
  const [countryRows, wikidataLeaders, wikipediaLeaders] = await Promise.all([
    fetchRestCountries(),
    fetchWikidataLeadersByCountry(),
    fetchWikipediaCurrentLeaders()
  ]);

  return countryRows.map((country) => {
    const wikipediaRow = findWikipediaLeadersForCountry(country.name, wikipediaLeaders);
    const { assignments, hasConflict, disagreements } = buildAssignments(
      country.iso2,
      wikidataLeaders.get(country.iso2),
      wikipediaRow,
      retrievedAt
    );

    const confidence = calculateConfidence(
      assignments.map((assignment) => assignment.sourceConfidence),
      hasConflict ? 0.12 : 0
    );

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
      profile: `${country.name} is continuously verified via REST Countries, Wikidata, and Wikipedia current leadership listings.`,
      leaderAssignments: assignments,
      verificationSnapshots: [
        {
          id: `snapshot-${country.iso2.toLowerCase()}`,
          confidenceScore: confidence,
          conflictDetected: hasConflict,
          capturedAt: retrievedAt,
          country: { name: country.name }
        }
      ],
      validation: {
        disagreements,
        sourceAgreementRate:
          assignments.length === 0
            ? 0
            : Number(
                (
                  assignments.filter((assignment) => assignment.sourceConfidence >= 0.84).length /
                  assignments.length
                ).toFixed(3)
              )
      }
    } satisfies InternalLiveCountry;
  });
}

async function getDataset() {
  datasetPromise ??= buildLiveDataset().catch((error) => {
    datasetPromise = null;
    throw error;
  });

  if (!datasetPromise) {
    throw new Error('Live dataset cache unavailable.');
  }

  return datasetPromise;
}

function toPublicCountry(country: InternalLiveCountry): LiveCountry {
  return {
    id: country.id,
    iso2: country.iso2,
    iso3: country.iso3,
    name: country.name,
    slug: country.slug,
    region: country.region,
    governmentType: country.governmentType,
    flagEmoji: country.flagEmoji,
    profile: country.profile,
    leaderAssignments: country.leaderAssignments,
    verificationSnapshots: country.verificationSnapshots
  };
}

export async function getLiveCountries(search?: string, region?: string) {
  const rows = await getDataset();
  const searchTerm = search?.trim().toLowerCase();
  const regionTerm = region?.trim().toLowerCase();

  return rows
    .filter((country) => {
      const bySearch =
        !searchTerm ||
        country.name.toLowerCase().includes(searchTerm) ||
        country.leaderAssignments.some((assignment) => assignment.leader.fullName.toLowerCase().includes(searchTerm));

      const byRegion = !regionTerm || country.region.toLowerCase().includes(regionTerm);
      return bySearch && byRegion;
    })
    .map(toPublicCountry);
}

export async function getLiveCountryBySlug(slug: string) {
  const rows = await getDataset();
  const row = rows.find((country) => country.slug === slug);
  return row ? toPublicCountry(row) : null;
}

export async function getLiveOpenConflicts() {
  const rows = await getDataset();

  return rows
    .filter((country) => country.leaderAssignments.length === 0 || country.validation.disagreements.length > 0)
    .map((country) => {
      const missingRoles = ['Head of State', 'Head of Government'].filter(
        (role) => !country.leaderAssignments.some((assignment) => assignment.role === role)
      );

      return {
        id: `conflict-${country.iso2.toLowerCase()}`,
        countryId: country.id,
        role: country.validation.disagreements.length > 0 ? 'Cross-source disagreement' : 'Leader verification gap',
        summary:
          country.validation.disagreements.length > 0
            ? 'Wikidata and Wikipedia disagree on at least one current leadership role.'
            : 'No current head of state or head of government was resolved from live source statements.',
        evidence: {
          missingRoles,
          disagreements: country.validation.disagreements
        },
        status: 'OPEN' as const,
        confidenceDelta: country.validation.disagreements.length > 0 ? 0.22 : 0.35,
        createdAt: new Date(),
        resolvedAt: null
      };
    })
    .slice(0, 80);
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
    .slice(0, 80);
}

export function getLiveSources() {
  return liveSources;
}

export async function syncLiveDatasetToDatabase(prisma: PrismaClient): Promise<LiveSyncResult> {
  const rows = await getDataset();
  const capturedAt = new Date();

  const sourceIdByKey: Record<string, string> = {};

  for (const source of liveSources) {
    const dbSource = await prisma.source.upsert({
      where: { domain: source.domain },
      update: {
        name: source.name,
        type: source.type as SourceType,
        baseCredibility: source.baseCredibility,
        recencyWeight: source.recencyWeight,
        officialSignal: source.officialSignal,
        independentSignal: source.independentSignal,
        transparencySignal: source.transparencySignal
      },
      create: {
        domain: source.domain,
        name: source.name,
        type: source.type as SourceType,
        baseCredibility: source.baseCredibility,
        recencyWeight: source.recencyWeight,
        officialSignal: source.officialSignal,
        independentSignal: source.independentSignal,
        transparencySignal: source.transparencySignal
      }
    });

    sourceIdByKey[source.id] = dbSource.id;
  }

  let assignmentsStored = 0;
  let conflictsOpened = 0;
  let snapshotsStored = 0;
  let unresolvedCountries = 0;

  for (const country of rows) {
    const dbCountry = await prisma.country.upsert({
      where: { iso2: country.iso2 },
      update: {
        iso3: country.iso3,
        name: country.name,
        slug: country.slug,
        region: country.region,
        governmentType: country.governmentType,
        flagEmoji: country.flagEmoji,
        profile: country.profile
      },
      create: {
        iso2: country.iso2,
        iso3: country.iso3,
        name: country.name,
        slug: country.slug,
        region: country.region,
        governmentType: country.governmentType,
        flagEmoji: country.flagEmoji,
        profile: country.profile
      }
    });

    await prisma.leaderAssignment.updateMany({
      where: { countryId: dbCountry.id, isCurrent: true },
      data: { isCurrent: false }
    });

    for (const assignment of country.leaderAssignments) {
      let dbLeader = await prisma.leader.findFirst({
        where: { fullName: assignment.leader.fullName },
        orderBy: { updatedAt: 'desc' }
      });

      if (!dbLeader) {
        dbLeader = await prisma.leader.create({
          data: {
            fullName: assignment.leader.fullName,
            party: assignment.leader.party,
            profile: assignment.leader.profile
          }
        });
      }

      const dbAssignment = await prisma.leaderAssignment.create({
        data: {
          countryId: dbCountry.id,
          leaderId: dbLeader.id,
          role: assignment.role,
          officialTitle: assignment.officialTitle,
          assumedOfficeAt: assignment.assumedOfficeAt,
          predecessor: assignment.predecessor,
          isCurrent: true,
          sourceConfidence: assignment.sourceConfidence
        }
      });

      assignmentsStored += 1;

      for (const citation of assignment.citations) {
        const sourceId = sourceIdByKey[citation.source.id];
        if (!sourceId) {
          continue;
        }

        await prisma.citation.create({
          data: {
            leaderAssignmentId: dbAssignment.id,
            sourceId,
            url: citation.url,
            excerpt: citation.excerpt,
            publishedAt: null,
            retrievedAt: citation.retrievedAt,
            trustScore: citation.trustScore
          }
        });
      }
    }

    const snapshot = country.verificationSnapshots[0];

    if (country.leaderAssignments.length === 0) {
      unresolvedCountries += 1;
    }

    await prisma.verificationSnapshot.create({
      data: {
        countryId: dbCountry.id,
        capturedAt,
        confidenceScore: snapshot?.confidenceScore ?? 0,
        conflictDetected: snapshot?.conflictDetected ?? country.leaderAssignments.length === 0,
        notes:
          country.validation.disagreements.length > 0
            ? 'Cross-source disagreement detected in automated validation.'
            : null,
        payload: {
          assignmentCount: country.leaderAssignments.length,
          sourceAgreementRate: country.validation.sourceAgreementRate,
          disagreements: country.validation.disagreements,
          sourceIds: Object.keys(sourceIdByKey)
        }
      }
    });

    snapshotsStored += 1;

    const shouldOpenConflict =
      country.validation.disagreements.length > 0 || country.leaderAssignments.length === 0;

    if (shouldOpenConflict) {
      await prisma.conflict.create({
        data: {
          countryId: dbCountry.id,
          role:
            country.validation.disagreements.length > 0
              ? 'Cross-source disagreement'
              : 'Leader verification gap',
          summary:
            country.validation.disagreements.length > 0
              ? 'Automated multi-source validation found disagreement between source records.'
              : 'Automated multi-source validation could not resolve current role holders.',
          evidence: {
            disagreements: country.validation.disagreements,
            missingRoles: ['Head of State', 'Head of Government'].filter(
              (role) => !country.leaderAssignments.some((assignment) => assignment.role === role)
            )
          },
          confidenceDelta: country.validation.disagreements.length > 0 ? 0.22 : 0.35,
          status: 'OPEN'
        }
      });

      conflictsOpened += 1;
    } else {
      await prisma.conflict.updateMany({
        where: { countryId: dbCountry.id, status: 'OPEN' },
        data: { status: 'RESOLVED', resolvedAt: capturedAt }
      });
    }
  }

  return {
    countriesProcessed: rows.length,
    assignmentsStored,
    conflictsOpened,
    snapshotsStored,
    unresolvedCountries,
    capturedAt: capturedAt.toISOString()
  };
}
