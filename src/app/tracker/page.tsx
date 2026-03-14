import { getRecentSnapshots } from '@/lib/data';

export default async function TrackerPage() {
  const snapshots = await getRecentSnapshots();

  return (
    <div className="space-y-6">
      <header className="surface-card rounded-3xl p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.26em] text-muted">Verification Feed</p>
        <h1 className="mt-2 font-display text-4xl text-[color:var(--text-1)] md:text-5xl">Leadership Change Tracker</h1>
      </header>
      <div className="space-y-4">
        {snapshots.map((snapshot) => (
          <article key={snapshot.id} className="surface-card rounded-2xl p-5 text-sm">
            <p className="font-semibold text-[color:var(--text-1)]">{snapshot.country.name}</p>
            <p className="text-muted">{new Date(snapshot.capturedAt).toLocaleString()}</p>
            <p className="mt-2 text-[color:var(--text-1)]">Confidence: {Math.round(snapshot.confidenceScore * 100)}%</p>
            <p className="text-muted">{snapshot.conflictDetected ? 'Conflict detected (under review)' : 'No conflict signals detected'}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
