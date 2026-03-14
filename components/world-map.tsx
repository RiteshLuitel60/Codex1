"use client";

import { motion } from "framer-motion";

export function WorldMap() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="glass rounded-3xl p-6"
    >
      <h2 className="mb-4 text-xl font-medium">Interactive World Coverage</h2>
      <div className="relative h-64 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 md:h-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(136,196,255,0.22),transparent_25%),radial-gradient(circle_at_65%_55%,rgba(121,89,255,0.2),transparent_30%)]" />
        <p className="absolute bottom-4 left-4 text-xs text-white/65">
          SVG map layer hook ready for region filters and hover states.
        </p>
      </div>
    </motion.section>
  );
}
