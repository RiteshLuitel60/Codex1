const items = [
  {
    title: '1. Source discovery',
    body: 'The ingestion service prioritizes official government publications, then cross-checks intergovernmental and trusted editorial records.'
  },
  {
    title: '2. Credibility scoring',
    body: 'Each source receives a weighted trust score based on authority, transparency, historical reliability, and update recency.'
  },
  {
    title: '3. Conflict detection',
    body: 'When leading sources disagree on role holder or date, the system opens a conflict case and lowers confidence pending review.'
  },
  {
    title: '4. Snapshotting',
    body: 'Every verification run stores a snapshot payload for auditable historical timelines and regression analysis.'
  }
];

export default function MethodologyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold">Methodology & verification policy</h1>
      {items.map((item) => (
        <section key={item.title} className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold">{item.title}</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{item.body}</p>
        </section>
      ))}
    </div>
  );
}
