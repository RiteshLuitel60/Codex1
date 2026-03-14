import { NextResponse } from "next/server";
import { countries } from "@/data/sample-data";

export async function GET() {
  return NextResponse.json({ data: countries, timestamp: new Date().toISOString() });
}
