import { NextResponse } from 'next/server';
import { getCountries } from '@/lib/data';

function toCsv(rows: Array<Record<string, string | number>>) {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const csvRows = [headers.join(',')];
  rows.forEach((row) => {
    csvRows.push(headers.map((header) => `"${String(row[header]).replaceAll('"', '""')}"`).join(','));
  });
  return csvRows.join('\n');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') ?? 'json';
  const countries = await getCountries();

  if (format === 'csv') {
    const csv = toCsv(
      countries.map((country) => ({
        country: country.name,
        region: country.region,
        governmentType: country.governmentType,
        confidence: country.verificationSnapshots[0]?.confidenceScore ?? 0
      }))
    );

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="world-leaders-atlas.csv"'
      }
    });
  }

  return NextResponse.json({ countries });
}
