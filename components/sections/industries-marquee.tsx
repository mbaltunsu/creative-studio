import type { CSSProperties } from "react";
import clsx from "clsx";
import { Marquee } from "@/components/anim/marquee";
import { INDUSTRIES, INDUSTRIES_KICKER } from "@/lib/data/industries";
import type { Accent } from "@/lib/data/nav";

/* Ticket-spine cards: vertical book-spine label, index + accent dot on top,
   perforated 64px stub (sector code + arrow) with notched ticket edges.
   Accent cards invert to paper on hover; paper cards alternate solid/outline
   and invert the other way. All pure CSS — this section stays zero-JS. */
const ACCENT_CARD: Record<Accent, string> = {
  blue: "border-transparent bg-blue text-paper hover:bg-paper hover:text-ink",
  coral: "border-transparent bg-coral text-ink hover:bg-paper hover:text-ink",
  acid: "border-transparent bg-acid text-ink hover:bg-paper hover:text-ink",
  violet: "border-transparent bg-violet text-paper hover:bg-paper hover:text-ink",
  teal: "border-transparent bg-teal text-ink hover:bg-paper hover:text-ink",
};

const PAPER_CARD =
  "border-transparent bg-paper text-ink hover:bg-ink hover:text-paper hover:border-paper/30";
const OUTLINE_CARD =
  "border-paper/25 bg-transparent text-paper hover:border-transparent hover:bg-paper hover:text-ink";

/* Half-circle notches cut where the perforation meets the card edges. If a
   browser skips mask-composite the notches vanish and the card stays whole. */
const TICKET_MASK: CSSProperties = {
  WebkitMaskImage:
    "radial-gradient(circle 10px at 0 calc(100% - 64px), transparent 9px, #000 10px), radial-gradient(circle 10px at 100% calc(100% - 64px), transparent 9px, #000 10px)",
  WebkitMaskComposite: "source-in",
  maskImage:
    "radial-gradient(circle 10px at 0 calc(100% - 64px), transparent 9px, #000 10px), radial-gradient(circle 10px at 100% calc(100% - 64px), transparent 9px, #000 10px)",
  maskComposite: "intersect",
};

/* currentColor hatch — follows each variant's text color through hover inverts. */
const HATCH: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 10px)",
};

/* Baseline stagger, cycling every 3 cards (12 % 3 = 0, so the marquee's
   duplicated copy continues the rhythm seamlessly). */
const CARD_LIFT = [0, 26, 10];

/* Transform-only motion. A slow full rotation for the conic ring; the centring
   translate lives on the element (margin-auto) so it survives motion-reduce. */
const KEYFRAMES = `
@keyframes imFlowA{0%{transform:translate3d(-5%,4%,0) scale(1.05)}100%{transform:translate3d(8%,-6%,0) scale(1.2)}}
@keyframes imFlowB{0%{transform:translate3d(6%,-3%,0) scale(1)}100%{transform:translate3d(-8%,7%,0) scale(1.16)}}
@keyframes imSpin{to{transform:rotate(360deg)}}
`;

export function IndustriesMarquee() {
  return (
    <section id="industries" className="relative isolate bg-ink">
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      {/* Overlap layer rises over project-path's trailing 70lvh spacer. It must
          have an OPAQUE ink base since it climbs over the previous section. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-[70lvh] bottom-0 -z-10 overflow-clip"
      >
        <div className="sticky top-0 h-lvh w-full bg-ink">
          {/* Cooler, slower character than file 1: teal + acid ambiance. */}
          <div className="absolute -left-[6vmax] top-[10vmax] aspect-square w-[54vmax] rounded-full bg-[radial-gradient(closest-side,rgba(0,217,199,0.16),transparent)] will-change-transform animate-[imFlowA_34s_ease-in-out_infinite_alternate] motion-reduce:animate-none" />
          <div className="absolute -bottom-[8vmax] -right-[10vmax] aspect-square w-[48vmax] rounded-full bg-[radial-gradient(closest-side,rgba(232,255,61,0.10),transparent)] will-change-transform animate-[imFlowB_42s_ease-in-out_infinite_alternate] motion-reduce:animate-none" />
          {/* Huge slow-rotating conic ring, carved hollow with a radial mask.
              Centred by auto-margins (no transform) so motion-reduce stays centred. */}
          <div
            className="absolute inset-0 m-auto aspect-square w-[120vmax] rounded-full will-change-transform animate-[imSpin_90s_linear_infinite] motion-reduce:animate-none"
            style={{
              background:
                "conic-gradient(from 0deg,rgba(0,217,199,0.10),transparent 30%,rgba(155,92,255,0.08) 55%,transparent 80%,rgba(0,217,199,0.10))",
              WebkitMaskImage:
                "radial-gradient(closest-side,transparent 56%,#000 60%,#000 78%,transparent 82%)",
              maskImage:
                "radial-gradient(closest-side,transparent 56%,#000 60%,#000 78%,transparent 82%)",
            }}
          />
          {/* Faint diagonal hatch — different texture from file 1's grid. */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 1px,transparent 11px)",
            }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="mx-auto max-w-[90rem] px-6 pt-28 md:px-10 md:pt-40">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-teal md:text-sm">
          {INDUSTRIES_KICKER}
        </p>
        <h2 className="mt-4 max-w-[18ch] text-balance font-display text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[1.02] tracking-tight text-paper">
          Industries of expertise
        </h2>
      </div>

      {/* Full-bleed marquee of ticket-spine cards. Children are passed ONCE —
          Marquee renders them twice internally; space with padding, not gap. */}
      <Marquee duration={45} pauseOnHover={false} className="mt-10 pb-28 md:mt-16 md:pb-40">
        <ul className="flex items-start">
          {(() => {
            let paperCount = 0;
            return INDUSTRIES.map((card, i) => {
              const variant = card.accent
                ? ACCENT_CARD[card.accent]
                : paperCount++ % 2 === 0
                  ? PAPER_CARD
                  : OUTLINE_CARD;
              return (
                <li
                  key={card.label}
                  className="mr-0 shrink-0 pr-4 md:pr-6"
                  style={{ marginTop: CARD_LIFT[i % 3] }}
                >
                  <div
                    className={clsx(
                      "group/card relative isolate flex h-[min(520px,62vh)] w-[clamp(210px,20vw,272px)] flex-col overflow-hidden rounded-[20px] border transition-colors duration-300",
                      variant,
                    )}
                    style={TICKET_MASK}
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
                      style={HATCH}
                    />
                    <div className="flex items-center justify-between px-5 pt-5 font-mono text-[11px] font-bold tracking-[0.18em]">
                      <span className="opacity-70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span aria-hidden className="size-1.5 rounded-full bg-current" />
                    </div>
                    <div className="flex min-h-0 flex-1 items-end justify-center px-4 py-4">
                      <span className="rotate-180 font-display text-[clamp(1.7rem,1.9vw,2.4rem)] font-semibold leading-[1.04] tracking-tight [writing-mode:vertical-rl]">
                        {card.label}
                      </span>
                    </div>
                    <div className="flex h-16 w-full items-center justify-between border-t border-dashed px-5 [border-color:color-mix(in_srgb,currentColor_35%,transparent)]">
                      <span className="font-mono text-xs font-bold tracking-[0.22em]">
                        {card.code}
                      </span>
                      <span
                        aria-hidden
                        className="font-mono text-base transition-transform duration-300 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5"
                      >
                        ↗
                      </span>
                    </div>
                  </div>
                </li>
              );
            });
          })()}
        </ul>
      </Marquee>
    </section>
  );
}
