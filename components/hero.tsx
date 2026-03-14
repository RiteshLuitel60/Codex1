"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-hero-radial p-10 md:p-20">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl"
      >
        A verified atlas of the world&apos;s current national leaders.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1 }}
        className="mt-6 max-w-2xl text-base text-white/75 md:text-lg"
      >
        Built with transparent sourcing, confidence scoring, and continuous verification from official and trusted public records.
      </motion.p>
    </section>
  );
}
