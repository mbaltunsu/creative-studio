import clsx from "clsx";
import { Marquee } from "@/components/anim/marquee";
import { INDUSTRIES, INDUSTRIES_KICKER } from "@/lib/data/industries";
import type { Accent } from "@/lib/data/nav";

/* accent → tall-capsule palette (typed over every Accent). Accent pills invert
   to paper on hover; the paper pills (no accent) invert to ink. */
const ACCENT_PILL: Record<Accent, string> = {
  blue: "bg-blue text-paper hover:bg-paper hover:text-ink",
  coral: "bg-coral text-ink hover:bg-paper hover:text-ink",
  acid: "bg-acid text-ink hover:bg-paper hover:text-ink",
  violet: "bg-violet text-paper hover:bg-paper hover:text-ink",
  teal: "bg-teal text-ink hover:bg-paper hover:text-ink",
};

const PAPER_PILL =
  "bg-paper text-ink hover:bg-ink hover:text-paper hover:border-paper/30";

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

      {/* Full-bleed marquee of tall capsule pills. Children are passed ONCE —
          Marquee renders them twice internally; space with padding, not gap. */}
      <Marquee duration={45} className="mt-10 pb-28 md:mt-16 md:pb-40">
        <ul className="flex">
          {INDUSTRIES.map((pill) => (
            <li key={pill.label} className="mr-0 shrink-0 pr-4 md:pr-6">
              <div
                className={clsx(
                  "flex h-[min(520px,62vh)] w-[clamp(180px,19vw,264px)] items-center justify-center rounded-full border border-transparent px-6 text-center transition-colors duration-300",
                  pill.accent ? ACCENT_PILL[pill.accent] : PAPER_PILL,
                )}
              >
                <span className="font-display text-[clamp(1.4rem,2vw,2.2rem)] font-semibold leading-tight">
                  {pill.label}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Marquee>
    </section>
  );
}
