"use client";

import { motion } from "motion/react";
import { NAV_LINKS, SOLUTIONS, ACCENT_HEX } from "@/lib/data/nav";

const ease = [0.32, 0.72, 0, 1] as const;

export function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 overflow-y-auto bg-ink md:hidden"
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div className="flex min-h-full flex-col px-6 pb-10 pt-24">
        <nav aria-label="Main">
          <ul>
            {NAV_LINKS.map((l, i) => (
              <motion.li
                key={l.label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 + i * 0.06, ease }}
                className="border-b border-paper/10"
              >
                <a
                  href={l.href}
                  onClick={onClose}
                  className="block py-4 font-display text-4xl font-semibold tracking-tight text-paper"
                >
                  {l.label}
                </a>
              </motion.li>
            ))}
          </ul>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.36, ease }}
          className="mt-8"
        >
          <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-acid">
            {"{ solutions }"}
          </p>
          <ul className="mt-3 space-y-2">
            {SOLUTIONS.map((s) => (
              <li key={s.label} className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block size-1.5 rounded-full"
                  style={{ background: ACCENT_HEX[s.accent] }}
                />
                <a
                  href={s.href}
                  onClick={onClose}
                  className="font-sans text-lg text-paper/70"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.44, ease }}
          className="mt-auto flex items-center justify-between pt-10"
        >
          <a href="#login" className="font-mono text-sm font-bold uppercase tracking-widest text-paper/70">
            Log in
          </a>
          <a
            href="#contact"
            data-quote
            onClick={onClose}
            className="rounded-xl bg-acid px-5 py-3 font-mono text-sm font-bold uppercase tracking-wide text-ink"
          >
            Get a quote →
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}
