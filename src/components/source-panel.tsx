import { formatConfidence } from '@/lib/utils';

type Citation = {
  id: string;
  url: string;
  sourceName: string;
  trustScore: number;
  retrievedAt: string;
};

export function SourcePanel({ citations }: { citations: Citation[] }) {
  return (
    <section className="glass rounded-2xl p-6">
      <h3 className="text-xl font-semibold">Source Transparency</h3>
      <div className="mt-4 space-y-3">
        {citations.map((citation) => (
          <article key={citation.id} className="rounded-xl border border-slate-200/30 p-4 dark:border-slate-700">
            <a href={citation.url} className="text-sm text-aurora-2 underline underline-offset-4">
              {citation.sourceName}
            </a>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-300">
              <span>Trust: {formatConfidence(citation.trustScore)}</span>
              <span>Verified: {new Date(citation.retrievedAt).toLocaleString()}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
