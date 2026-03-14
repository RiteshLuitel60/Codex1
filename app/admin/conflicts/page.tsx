const queue = [
  {
    country: "Exampleland",
    role: "Head of Government",
    issue: "Two official portals report different appointment dates",
    confidenceGap: 12
  }
];

export default function ConflictDashboardPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold">Conflict Resolution Dashboard</h1>
      <section className="glass rounded-2xl p-6">
        {queue.map((item) => (
          <article key={item.country} className="rounded-xl border border-amber-300/20 bg-amber-200/5 p-4">
            <p className="text-sm font-medium">{item.country} · {item.role}</p>
            <p className="mt-2 text-sm text-white/75">{item.issue}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.15em] text-amber-200">Confidence divergence {item.confidenceGap}%</p>
          </article>
        ))}
      </section>
    </div>
  );
}
