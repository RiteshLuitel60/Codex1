'use client';

import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-hero-gradient px-8 py-20 md:px-14">
      <div className="absolute inset-0 editorial-grid opacity-20" aria-hidden />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative space-y-6"
      >
        <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-300">Live intelligence platform</p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
          World Leaders Atlas surfaces verified national leadership with full source transparency.
        </h1>
        <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          A premium, continuously refreshed directory powered by source ranking, conflict detection, and historical snapshots.
        </p>
      </motion.div>
    </section>
  );
}
