type TimelineItem = {
  leader: string;
  role: string;
  start: string;
  end?: string;
};

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <section className="surface-card rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-[color:var(--text-1)]">Historical Leadership Timeline</h3>
      <ol className="mt-4 space-y-4 border-l border-[var(--panel-border)] pl-4">
        {items.map((item, index) => (
          <li key={`${item.leader}-${index}`} className="relative">
            <span className="absolute -left-[23px] top-1 h-2.5 w-2.5 rounded-full" style={{ background: 'var(--accent-3)' }} />
            <p className="font-medium text-[color:var(--text-1)]">{item.leader}</p>
            <p className="text-sm text-muted">
              {item.role} · {item.start} {item.end ? `– ${item.end}` : '– Present'}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
