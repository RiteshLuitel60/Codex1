import { NextResponse } from "next/server";
import { countryDetails } from "@/data/sample-data";

export async function GET(_: Request, { params }: { params: { code: string } }) {
  const result = countryDetails[params.code];

  if (!result) {
    return NextResponse.json({ error: "Country not found" }, { status: 404 });
  }

  return NextResponse.json({ data: result, timestamp: new Date().toISOString() });
}
