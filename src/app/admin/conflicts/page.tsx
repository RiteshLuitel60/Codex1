import { getOpenConflicts } from '@/lib/data';

export default async function AdminConflictsPage() {
  const conflicts = await getOpenConflicts();

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold">Admin · Conflict resolution dashboard</h1>
      {conflicts.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-sm">No active conflicts. Automated verification is currently aligned.</div>
      ) : (
        <div className="space-y-4">
          {conflicts.map((conflict) => (
            <article key={conflict.id} className="glass rounded-2xl p-5 text-sm">
              <h2 className="font-semibold">{conflict.role}</h2>
              <p className="mt-1">{conflict.summary}</p>
              <p className="mt-2 text-slate-500 dark:text-slate-300">Confidence delta: {Math.round(conflict.confidenceDelta * 100)}%</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
