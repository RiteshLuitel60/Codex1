import Link from 'next/link';
import { formatConfidence } from '@/lib/utils';

type CountryCardProps = {
  slug: string;
  name: string;
  flagEmoji: string;
  region: string;
  confidence: number;
  leaders: string;
};

export function CountryCard({ slug, name, flagEmoji, region, confidence, leaders }: CountryCardProps) {
  return (
    <Link href={`/countries/${slug}`} className="surface-card block rounded-2xl p-5 transition hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[color:var(--text-1)]">
            {flagEmoji} {name}
          </h3>
          <p className="text-sm text-muted">{region}</p>
        </div>
        <span
          className="rounded-full px-2 py-1 text-xs font-semibold"
          style={{
            background: 'color-mix(in srgb, var(--accent-3) 18%, transparent)',
            color: 'var(--accent-3)'
          }}
        >
          {formatConfidence(confidence)}
        </span>
      </div>
      <p className="mt-4 text-sm text-muted">{leaders}</p>
    </Link>
  );
}
