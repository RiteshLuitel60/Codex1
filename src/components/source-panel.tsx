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
    <section className="surface-card rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-[color:var(--text-1)]">Source Transparency</h3>
      <div className="mt-4 space-y-3">
        {citations.map((citation) => (
          <article key={citation.id} className="rounded-xl border border-[var(--panel-border)] p-4">
            <a href={citation.url} className="text-sm underline underline-offset-4" style={{ color: 'var(--accent-2)' }}>
              {citation.sourceName}
            </a>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
              <span>Trust: {formatConfidence(citation.trustScore)}</span>
              <span>Verified: {new Date(citation.retrievedAt).toLocaleString()}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
