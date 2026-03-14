import { getOpenConflicts } from '@/lib/data';

export default async function AdminConflictsPage() {
  const conflicts = await getOpenConflicts();

  return (
    <div className="space-y-6">
      <header className="surface-card rounded-3xl p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.26em] text-muted">Operations</p>
        <h1 className="mt-2 font-display text-4xl text-[color:var(--text-1)] md:text-5xl">Conflict Resolution Dashboard</h1>
      </header>
      {conflicts.length === 0 ? (
        <div className="surface-card rounded-2xl p-8 text-sm text-muted">No active conflicts. Automated verification is currently aligned.</div>
      ) : (
        <div className="space-y-4">
          {conflicts.map((conflict) => (
            <article key={conflict.id} className="surface-card rounded-2xl p-5 text-sm">
              <h2 className="font-semibold text-[color:var(--text-1)]">{conflict.role}</h2>
              <p className="mt-1 text-muted">{conflict.summary}</p>
              <p className="mt-2" style={{ color: 'var(--accent-3)' }}>
                Confidence delta: {Math.round(conflict.confidenceDelta * 100)}%
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
