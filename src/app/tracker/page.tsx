import { getRecentSnapshots } from '@/lib/data';

export default async function TrackerPage() {
  const snapshots = await getRecentSnapshots();

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold">Leadership change tracker</h1>
      <div className="space-y-4">
        {snapshots.map((snapshot) => (
          <article key={snapshot.id} className="glass rounded-2xl p-5 text-sm">
            <p className="font-semibold">{snapshot.country.name}</p>
            <p className="text-slate-500 dark:text-slate-300">{new Date(snapshot.capturedAt).toLocaleString()}</p>
            <p>Confidence: {Math.round(snapshot.confidenceScore * 100)}%</p>
            <p>{snapshot.conflictDetected ? 'Conflict detected (under review)' : 'No conflict signals detected'}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
