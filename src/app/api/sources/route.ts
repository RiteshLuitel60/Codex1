import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockSources } from '@/lib/mock-data';
import { isDatabaseConfigured } from '@/lib/runtime';
import { scoreSource } from '@/lib/source-ranking';

export async function GET() {
  const sources = isDatabaseConfigured()
    ? await prisma.source.findMany({ orderBy: { baseCredibility: 'desc' } })
    : mockSources;

  const ranked = sources.map((source) => ({
    ...source,
    ranking: scoreSource({
      baseCredibility: source.baseCredibility,
      recencyWeight: source.recencyWeight,
      officialSignal: source.officialSignal,
      independentSignal: source.independentSignal,
      transparencySignal: source.transparencySignal
    })
  }));

  return NextResponse.json({ sources: ranked, mode: isDatabaseConfigured() ? 'database' : 'demo' });
}
