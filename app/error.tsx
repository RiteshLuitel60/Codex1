"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="glass rounded-2xl p-8">
      <h2 className="text-xl font-semibold">Something interrupted the atlas pipeline.</h2>
      <button onClick={() => reset()} className="mt-4 rounded-lg border border-white/20 px-4 py-2 text-sm">
        Retry
      </button>
    </div>
  );
}
