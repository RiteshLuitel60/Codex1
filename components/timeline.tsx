import type { TimelineEntry } from "@/lib/types";

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <section className="glass rounded-2xl p-6">
      <h3 className="text-lg font-medium">Leadership Timeline</h3>
      <div className="mt-5 space-y-4 border-l border-white/20 pl-6">
        {entries.map((entry) => (
          <article key={`${entry.role}-${entry.assumedOffice}`} className="relative">
            <span className="absolute -left-[1.9rem] top-1 h-3 w-3 rounded-full bg-aurora" />
            <p className="text-sm text-white/90">{entry.leaderName} · {entry.role}</p>
            <p className="text-xs text-white/60">{entry.assumedOffice} — {entry.endedOffice ?? "Present"}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
