'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="glass rounded-2xl p-10 text-center">
      <p className="text-lg font-semibold">Unable to load this dataset right now.</p>
      <button onClick={reset} className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-slate-900">
        Retry
      </button>
    </div>
  );
}
