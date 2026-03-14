'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/40 bg-hero-gradient px-6 py-16 shadow-bloom md:px-12 md:py-20">
      <div className="absolute inset-0 editorial-grid opacity-25" aria-hidden />
      <div className="absolute -right-12 top-8 h-28 w-28 rounded-full bg-brass/25 blur-2xl" aria-hidden />
      <div className="absolute bottom-4 left-8 h-24 w-24 rounded-full bg-lagoon/25 blur-2xl" aria-hidden />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative space-y-7"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-slate-600 dark:text-slate-300">Live Intelligence Platform</p>
        <h1 className="title-gradient max-w-4xl font-display text-4xl leading-tight md:text-6xl">
          A global observatory for leadership changes, verified in real time across independent public sources.
        </h1>
        <p className="max-w-2xl text-lg text-slate-700 dark:text-slate-200">
          Track head-of-state and head-of-government records with transparent citations, cross-source disagreement flags, and auditable confidence snapshots.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/countries"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 dark:bg-brass dark:text-midnight"
          >
            Explore Countries
          </Link>
          <Link
            href="/tracker"
            className="rounded-full border border-ink/20 bg-white/70 px-5 py-2.5 text-sm font-medium text-ink transition hover:-translate-y-0.5 dark:border-slate-600 dark:bg-slate-900/55 dark:text-slate-100"
          >
            Open Verification Feed
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
