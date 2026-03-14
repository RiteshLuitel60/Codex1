import { Queue } from 'bullmq';
import { prisma } from '@/lib/prisma';
import { isRedisConfigured } from '@/lib/runtime';

const connection = {
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: Number(process.env.REDIS_PORT ?? 6379)
};

let ingestionQueue: Queue | null = null;

function getQueue() {
  if (!isRedisConfigured()) {
    return null;
  }

  ingestionQueue ??= new Queue('leaders-ingestion', { connection });
  return ingestionQueue;
}

export async function enqueueRefreshAllCountries() {
  const queue = getQueue();
  if (!queue) {
    return 0;
  }

  const countries = await prisma.country.findMany({ select: { id: true, slug: true } });
  await Promise.all(
    countries.map((country) =>
      queue.add(
        'refresh-country',
        { countryId: country.id, slug: country.slug },
        { removeOnComplete: true, removeOnFail: true }
      )
    )
  );

  return countries.length;
}
