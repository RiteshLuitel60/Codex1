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
    <Link href={`/countries/${slug}`} className="glass block rounded-2xl p-5 transition hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {flagEmoji} {name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-300">{region}</p>
        </div>
        <span className="rounded-full bg-aurora-2/15 px-2 py-1 text-xs font-semibold text-aurora-2">
          {formatConfidence(confidence)}
        </span>
      </div>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{leaders}</p>
    </Link>
  );
}
