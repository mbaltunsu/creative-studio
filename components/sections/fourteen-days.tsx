"use client";

import { FrameSequence } from "@/components/anim/frame-sequence";
import { CtaPill } from "@/components/ui/cta-pill";
import { REEL_FRAMES } from "@/lib/data/frames";

/* "In 14 days, we…" — scroll-scrubbed growth sequence (bare rock → overgrown).
   Placeholder frames for now; real AI-generated frames drop into
   /public/frames/reel/ later (see lib/data/frames.ts). */
export function FourteenDays() {
  return (
    <section id="studio" className="relative isolate bg-ink">
      <FrameSequence
        count={REEL_FRAMES.count}
        url={REEL_FRAMES.url}
        length="+=280%"
        onTimeline={(tl) => {
          tl.to("[data-fd-1]", { autoAlpha: 0, y: -36, duration: 0.16, ease: "power1.in" }, 0.1)
            .fromTo(
              "[data-fd-2]",
              { autoAlpha: 0, y: 36 },
              { autoAlpha: 1, y: 0, duration: 0.14, ease: "power1.out" },
              0.34,
            )
            .to("[data-fd-2]", { autoAlpha: 0, y: -36, duration: 0.14, ease: "power1.in" }, 0.56)
            .fromTo(
              "[data-fd-3]",
              { autoAlpha: 0, y: 36 },
              { autoAlpha: 1, y: 0, duration: 0.16, ease: "power1.out" },
              0.8,
            );
        }}
      >
        {/* soft scrim for text legibility */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_62%_at_50%_48%,rgba(10,10,10,0.8),transparent_75%)]"
        />

        <div
          data-fd-1
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-acid md:text-sm">
            {"{ how fast we move }"}
          </p>
          <h2 className="mt-5 font-display text-[clamp(2.8rem,8vw,7.5rem)] font-semibold leading-[0.95] tracking-tight text-paper">
            In 14 days, we…
          </h2>
        </div>

        <div
          data-fd-2
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <h2 className="font-display text-[clamp(2.2rem,6vw,5.5rem)] font-semibold leading-[1] tracking-tight text-paper">
            …turn a brief into
            <br />a living thing.
          </h2>
          <p className="mt-6 max-w-lg font-sans text-base text-paper/80 md:text-lg">
            Concept, design and production grow in parallel — not in sequence.
          </p>
        </div>

        <div
          data-fd-3
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <h2 className="font-display text-[clamp(2.2rem,6vw,5.5rem)] font-semibold leading-[1] tracking-tight text-paper">
            Overgrown with ideas.
            <br />
            Delivered on time.
          </h2>
          <div className="mt-8">
            <CtaPill
              href="#contact"
              quote
              className="font-mono text-sm font-bold uppercase tracking-wider text-paper"
              fillClassName="bg-teal"
            >
              Start yours
            </CtaPill>
          </div>
        </div>

        <p
          aria-hidden
          className="absolute bottom-6 right-6 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-paper/40"
        >
          {"{ day 01 → 14 }"}
        </p>
      </FrameSequence>
    </section>
  );
}
