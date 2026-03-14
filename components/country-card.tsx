import Link from "next/link";
import type { CountrySummary } from "@/lib/types";

export function CountryCard({ country }: { country: CountrySummary }) {
  return (
    <Link
      href={`/countries/${country.code}`}
      className="glass group rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-white/25"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{country.name}</h3>
        <span className="text-2xl" aria-label={`${country.name} flag`}>
          {country.flagEmoji}
        </span>
      </div>
      <p className="mt-2 text-sm text-white/70">{country.region}</p>
      <p className="mt-4 text-sm text-white/85">{country.primaryLeader}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-aurora">
        Confidence {country.confidenceScore}%
      </p>
    </Link>
  );
}
