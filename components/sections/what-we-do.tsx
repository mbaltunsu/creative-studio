"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SERVICES } from "@/lib/data/services";
import { ACCENT_HEX } from "@/lib/data/nav";

export function WhatWeDo() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const activeService = SERVICES[active];

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("li", listRef.current);
      items.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          // ponytail: last item stays active from its midpoint to the section end
          end: i === items.length - 1 ? "bottom top" : "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    },
    { scope: listRef }
  );

  return (
    <section id="solutions" className="relative isolate bg-ink pb-[100lvh] text-paper">
      <div className="mx-auto max-w-[90rem] px-6 py-24 md:px-10 md:py-36">
        {/* Header */}
        <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-coral md:text-sm">
          {"{ what we do }"}
        </p>
        <h2 className="mt-4 font-display text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[1.02] tracking-tight">
          Six crafts. One studio.
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-2 md:gap-16">
          {/* LEFT — interactive service index */}
          <ul ref={listRef}>
            {SERVICES.map((s, i) => {
              const isActive = i === active;
              return (
                <li key={s.id}>
                  <motion.a
                    href="#work"
                    className="group flex min-h-[100lvh] cursor-pointer flex-col justify-center border-b border-paper/10 py-8 md:py-10"
                    onFocus={() => setActive(i)}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1], delay: i * 0.06 }}
                  >
                    {/* Mobile-only inline image (sticky panel is hidden < md) */}
                    <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-lg bg-ink-soft md:hidden">
                      <Image
                        src={s.image}
                        alt={s.title}
                        fill
                        sizes="100vw"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex items-baseline gap-4">
                      <span
                        className="font-mono text-sm"
                        style={{ color: ACCENT_HEX[s.accent] }}
                      >
                        {s.index}
                      </span>
                      <h3
                        className="font-display text-3xl font-semibold tracking-tight transition-transform group-hover:translate-x-2 md:text-5xl"
                        style={isActive ? { color: ACCENT_HEX[s.accent] } : undefined}
                      >
                        {s.title}
                      </h3>
                    </div>

                    <p className="mt-3 max-w-[52ch] font-sans text-paper/55">{s.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {s.deliverables.map((d) => (
                        <span
                          key={d}
                          className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-paper/60"
                          style={{ borderColor: `${ACCENT_HEX[s.accent]}55` }}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </motion.a>
                </li>
              );
            })}
          </ul>

          {/* RIGHT — sticky preview (desktop only) */}
          <div className="hidden md:block">
            <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-xl bg-ink-soft">
              <AnimatePresence>
                <motion.div
                  key={activeService.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                >
                  <Image
                    src={activeService.image}
                    alt={activeService.title}
                    fill
                    sizes="(min-width: 768px) 45vw, 1px"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Legibility scrim + active-service label */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/85 to-transparent"
              />
              <div className="pointer-events-none absolute bottom-5 left-5 flex items-center gap-2">
                <span
                  className="font-mono text-xs font-bold uppercase tracking-widest"
                  style={{ color: ACCENT_HEX[activeService.accent] }}
                >
                  {activeService.index}
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-paper/80">
                  {activeService.title}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
