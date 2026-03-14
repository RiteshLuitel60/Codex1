import { NextResponse } from 'next/server';
import { enqueueRefreshAllCountries } from '@/ingestion/queue';
import { prisma } from '@/lib/prisma';
import { syncLiveDatasetToDatabase } from '@/lib/live-data';
import { isDatabaseConfigured, isRedisConfigured } from '@/lib/runtime';

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        status: 'skipped',
        reason: 'Refresh persistence requires DATABASE_URL to be configured.'
      },
      { status: 202 }
    );
  }

  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') ?? 'sync';

  if (mode === 'queue') {
    if (!isRedisConfigured()) {
      return NextResponse.json(
        {
          status: 'skipped',
          reason: 'Queue mode requires REDIS_HOST/REDIS_URL in this deployment.'
        },
        { status: 202 }
      );
    }

    const jobs = await enqueueRefreshAllCountries();
    return NextResponse.json({ status: 'queued', jobs });
  }

  const result = await syncLiveDatasetToDatabase(prisma);
  return NextResponse.json({ status: 'synced', result });
}
