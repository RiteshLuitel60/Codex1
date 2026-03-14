import { prisma } from '@/lib/prisma';
import { mockConflicts, mockCountries } from '@/lib/mock-data';
import {
  getLiveCountries,
  getLiveCountryBySlug,
  getLiveOpenConflicts,
  getLiveRecentSnapshots
} from '@/lib/live-data';
import { isDatabaseConfigured } from '@/lib/runtime';

function filterCountries(search?: string, region?: string) {
  return mockCountries.filter((country) => {
    const bySearch = !search || country.name.toLowerCase().includes(search.toLowerCase());
    const byRegion = !region || country.region.toLowerCase().includes(region.toLowerCase());
    return bySearch && byRegion;
  });
}

export async function getCountries(search?: string, region?: string) {
  if (!isDatabaseConfigured()) {
    try {
      return await getLiveCountries(search, region);
    } catch (error) {
      console.error('Live country fetch failed, falling back to bundled dataset.', error);
      return filterCountries(search, region);
    }
  }

  return prisma.country.findMany({
    where: {
      name: search ? { contains: search, mode: 'insensitive' } : undefined,
      region: region ? { contains: region, mode: 'insensitive' } : undefined
    },
    include: {
      leaderAssignments: {
        where: { isCurrent: true },
        include: { leader: true }
      },
      verificationSnapshots: {
        orderBy: { capturedAt: 'desc' },
        take: 1
      }
    },
    orderBy: { name: 'asc' }
  });
}

export async function getCountryBySlug(slug: string) {
  if (!isDatabaseConfigured()) {
    try {
      return await getLiveCountryBySlug(slug);
    } catch (error) {
      console.error('Live country detail fetch failed, falling back to bundled dataset.', error);
      return mockCountries.find((country) => country.slug === slug) ?? null;
    }
  }

  return prisma.country.findUnique({
    where: { slug },
    include: {
      leaderAssignments: {
        include: {
          leader: true,
          citations: {
            include: { source: true }
          }
        },
        orderBy: { assumedOfficeAt: 'desc' }
      },
      verificationSnapshots: {
        orderBy: { capturedAt: 'desc' },
        take: 10
      }
    }
  });
}

export async function getOpenConflicts() {
  if (!isDatabaseConfigured()) {
    try {
      return await getLiveOpenConflicts();
    } catch (error) {
      console.error('Live conflict fetch failed, falling back to bundled dataset.', error);
      return mockConflicts;
    }
  }

  return prisma.conflict.findMany({
    where: { status: 'OPEN' },
    orderBy: { createdAt: 'desc' }
  });
}


export async function getRecentSnapshots() {
  if (!isDatabaseConfigured()) {
    try {
      return await getLiveRecentSnapshots();
    } catch (error) {
      console.error('Live snapshot fetch failed, falling back to bundled dataset.', error);
      return mockCountries.flatMap((country) =>
        country.verificationSnapshots.map((snapshot) => ({
          ...snapshot,
          country: { name: country.name }
        }))
      );
    }
  }

  return prisma.verificationSnapshot.findMany({
    include: { country: true },
    orderBy: { capturedAt: 'desc' },
    take: 50
  });
}
