"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { PointerEventHandler } from "react";
import { SOLUTIONS, ACCENT_HEX } from "@/lib/data/nav";

export function MegaMenu({
  onClose,
  onPointerEnter,
  onPointerLeave,
}: {
  onClose: () => void;
  onPointerEnter: PointerEventHandler;
  onPointerLeave: PointerEventHandler;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      data-lenis-prevent
      className="absolute inset-x-0 top-full hidden max-h-[calc(100dvh-96px)] overflow-y-auto border-b border-paper/10 bg-ink md:block"
    >
      <div className="mx-auto grid max-w-[90rem] grid-cols-3 gap-x-5 gap-y-6 px-6 py-6 md:px-10">
        {SOLUTIONS.map((s, i) => (
          <motion.a
            key={s.label}
            href={s.href}
            onClick={onClose}
            className="group"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 + i * 0.04, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="relative aspect-[12/5] overflow-hidden rounded-xl bg-ink-soft">
              <Image
                src={s.image}
                alt=""
                fill
                sizes="(min-width: 768px) 30vw, 90vw"
                className="object-cover opacity-75 grayscale transition duration-500 ease-out group-hover:scale-[1.05] group-hover:opacity-100 group-hover:grayscale-0"
              />
              <span
                className="absolute right-3 top-3 font-mono text-xs font-bold"
                style={{ color: ACCENT_HEX[s.accent] }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between gap-3">
              <h3 className="font-display text-base font-semibold tracking-tight text-paper md:text-lg">
                {s.label}
              </h3>
              <span
                aria-hidden
                className="font-mono text-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                style={{ color: ACCENT_HEX[s.accent] }}
              >
                ↗
              </span>
            </div>
            <p className="mt-0.5 font-sans text-[13px] leading-snug text-paper/50">{s.blurb}</p>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
