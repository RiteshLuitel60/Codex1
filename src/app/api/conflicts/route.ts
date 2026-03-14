import { NextResponse } from 'next/server';
import { getOpenConflicts } from '@/lib/data';

export async function GET() {
  const conflicts = await getOpenConflicts();
  return NextResponse.json({ conflicts });
}
