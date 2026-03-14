"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", label: "Directory" },
  { href: "/tracker", label: "Change Tracker" },
  { href: "/methodology", label: "Methodology" },
  { href: "/admin/conflicts", label: "Admin" }
];

export function SiteHeader() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 mx-auto mt-4 flex w-[95%] max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/30 px-6 py-3 backdrop-blur-2xl"
    >
      <Link href="/" className="text-sm font-semibold tracking-[0.25em] text-white/90">
        WORLD LEADERS ATLAS
      </Link>
      <nav className="hidden gap-6 md:flex">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="text-sm text-white/80 transition hover:text-white">
            {item.label}
          </Link>
        ))}
      </nav>
    </motion.header>
  );
}
