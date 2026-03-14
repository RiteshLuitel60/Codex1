import { NextResponse } from 'next/server';
import { getCountries } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') ?? undefined;
  const region = searchParams.get('region') ?? undefined;
  const countries = await getCountries(q, region);

  return NextResponse.json({ countries });
}
