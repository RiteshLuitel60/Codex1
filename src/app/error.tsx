'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="surface-card rounded-2xl p-10 text-center">
      <p className="text-lg font-semibold text-[color:var(--text-1)]">Unable to load this dataset right now.</p>
      <button
        onClick={reset}
        className="mt-4 rounded-full px-4 py-2 text-sm font-medium text-white"
        style={{ background: 'linear-gradient(120deg, var(--accent-1), var(--accent-3))' }}
      >
        Retry
      </button>
    </div>
  );
}
