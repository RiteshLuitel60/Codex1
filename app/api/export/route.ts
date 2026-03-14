import { NextResponse } from "next/server";
import { countryDetails } from "@/data/sample-data";

export async function GET() {
  const rows = Object.values(countryDetails).map((country) => ({
    code: country.code,
    name: country.name,
    region: country.region,
    confidenceScore: country.confidenceScore,
    lastVerifiedAt: country.lastVerifiedAt
  }));

  return NextResponse.json({ data: rows, exportedAt: new Date().toISOString() });
}
