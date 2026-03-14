import type { SourceRecord } from "@/lib/types";

export function SourcePanel({ sources }: { sources: SourceRecord[] }) {
  return (
    <section className="glass rounded-2xl p-6">
      <h3 className="text-lg font-medium">Source Transparency</h3>
      <ul className="mt-4 space-y-3 text-sm">
        {sources.map((source) => (
          <li key={source.url} className="rounded-xl border border-white/10 p-3">
            <div className="flex justify-between gap-3">
              <span className="font-medium text-white/90">{source.publisher}</span>
              <span className="text-aurora">Trust {source.trustScore}/100</span>
            </div>
            <a href={source.url} target="_blank" className="mt-1 block text-white/70 underline underline-offset-4">
              {source.url}
            </a>
            <p className="mt-1 text-xs text-white/55">Verified {source.verifiedAt}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
