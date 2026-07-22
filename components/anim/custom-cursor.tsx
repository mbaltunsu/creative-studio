"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/* Trailing "VIEW" badge that appears over [data-cursor="view"] zones
   (project cards). Doesn't replace the OS cursor — augments it. */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });

    let active = false;
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const hit = (e.target as Element).closest?.('[data-cursor="view"]');
      if (!!hit === active) return;
      active = !!hit;
      gsap.to(el, {
        scale: active ? 1 : 0,
        autoAlpha: active ? 1 : 0,
        duration: 0.3,
        ease: "back.out(1.6)",
        overwrite: "auto",
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, true);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over, true);
    };
  }, {});

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] opacity-0"
    >
      <span className="block rounded-full bg-acid px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-ink shadow-[0_4px_24px_rgba(232,255,61,0.35)]">
        View
      </span>
    </div>
  );
}
