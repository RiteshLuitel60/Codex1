'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--panel-border)] px-6 py-16 md:px-12 md:py-20">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 14% 18%, color-mix(in srgb, var(--accent-3) 32%, transparent), transparent 40%), radial-gradient(circle at 78% 20%, color-mix(in srgb, var(--accent-2) 30%, transparent), transparent 35%), linear-gradient(165deg, color-mix(in srgb, var(--panel) 66%, transparent) 0%, color-mix(in srgb, var(--panel) 86%, transparent) 100%)'
        }}
        aria-hidden
      />
      <div className="absolute inset-0 editorial-grid opacity-20" aria-hidden />
      <div className="absolute -right-14 top-4 h-36 w-36 rounded-full bg-[color:var(--accent-1)]/20 blur-3xl" aria-hidden />
      <div className="absolute bottom-0 left-4 h-28 w-28 rounded-full bg-[color:var(--accent-2)]/25 blur-3xl" aria-hidden />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative space-y-7"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-muted">Live Intelligence Platform</p>
        <h1 className="title-gradient max-w-4xl font-display text-4xl leading-tight md:text-6xl">
          A global observatory for leadership changes, verified in real time across independent public sources.
        </h1>
        <p className="max-w-2xl text-lg text-muted">
          Track head-of-state and head-of-government records with transparent citations, cross-source disagreement flags, and auditable confidence snapshots.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/countries"
            className="rounded-full px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(120deg, var(--accent-1), var(--accent-2))' }}
          >
            Explore Countries
          </Link>
          <Link
            href="/tracker"
            className="rounded-full border border-[var(--panel-border)] bg-[color:var(--panel)]/70 px-5 py-2.5 text-sm font-medium text-[color:var(--text-1)] transition hover:-translate-y-0.5"
          >
            Open Verification Feed
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
