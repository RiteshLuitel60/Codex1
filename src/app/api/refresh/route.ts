import { NextResponse } from 'next/server';
import { enqueueRefreshAllCountries } from '@/ingestion/queue';
import { isDatabaseConfigured, isRedisConfigured } from '@/lib/runtime';

export async function POST() {
  if (!isDatabaseConfigured() || !isRedisConfigured()) {
    return NextResponse.json(
      {
        status: 'skipped',
        reason: 'Refresh queue requires DATABASE_URL and REDIS_HOST/REDIS_URL in this deployment.'
      },
      { status: 202 }
    );
  }

  await enqueueRefreshAllCountries();
  return NextResponse.json({ status: 'queued' });
}
