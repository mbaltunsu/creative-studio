import clsx from "clsx";
import { CtaPill } from "@/components/ui/cta-pill";
import { PATH_CARDS, PATH_KICKER } from "@/lib/data/path-cards";
import { ACCENT_HEX, type Accent } from "@/lib/data/nav";

/* accent → micro-label colour (typed over every Accent; the cards use 4 of 5) */
const NUMBER_TEXT: Record<Accent, string> = {
  blue: "text-blue",
  coral: "text-coral",
  acid: "text-acid",
  teal: "text-teal",
  violet: "text-violet",
};

/* accent → CtaPill fill-wipe background */
const FILL_BG: Record<Accent, string> = {
  blue: "bg-blue",
  coral: "bg-coral",
  acid: "bg-acid",
  teal: "bg-teal",
  violet: "bg-violet",
};

/* Ink fails AA on blue/violet fills — those hover to paper text instead. */
const FILL_TEXT: Record<Accent, string> = {
  blue: "group-hover/pill:text-paper",
  coral: "group-hover/pill:text-ink",
  acid: "group-hover/pill:text-ink",
  teal: "group-hover/pill:text-ink",
  violet: "group-hover/pill:text-paper",
};

/* Transform-only drift (translate/scale/rotate) — GPU-cheap, never touches
   background-position or filter. Names are prefixed to avoid page collisions. */
const KEYFRAMES = `
@keyframes ppDriftA{0%{transform:translate3d(-6%,-4%,0) scale(1)}100%{transform:translate3d(8%,6%,0) scale(1.14)}}
@keyframes ppDriftB{0%{transform:translate3d(5%,8%,0) scale(1.08) rotate(0deg)}100%{transform:translate3d(-8%,-3%,0) scale(.96) rotate(18deg)}}
@keyframes ppDriftC{0%{transform:translate3d(0,0,0) scale(1)}100%{transform:translate3d(-6%,10%,0) scale(1.2)}}
`;

export function ProjectPath() {
  return (
    <section id="paths" className="relative isolate bg-ink">
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      {/* Overlap background: starts 100lvh ABOVE the section so it rises over the
          previous section's tail, then its sticky child pins for the whole scroll.
          overflow-clip (not -hidden) so it never becomes a scroll container. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-[100lvh] bottom-0 -z-10 overflow-clip"
      >
        <div className="sticky top-0 h-lvh w-full">
          {/* Deep, slowly-breathing ink space: oversized drifting radial blobs. */}
          <div className="absolute -left-[10vmax] -top-[8vmax] aspect-square w-[60vmax] rounded-full bg-[radial-gradient(closest-side,rgba(59,91,255,0.22),transparent)] will-change-transform animate-[ppDriftA_24s_ease-in-out_infinite_alternate] motion-reduce:animate-none" />
          <div className="absolute -right-[8vmax] top-[18vmax] aspect-square w-[52vmax] rounded-full bg-[radial-gradient(closest-side,rgba(155,92,255,0.18),transparent)] will-change-transform animate-[ppDriftB_30s_ease-in-out_infinite_alternate] motion-reduce:animate-none" />
          <div className="absolute -bottom-[6vmax] left-[28vmax] aspect-square w-[40vmax] rounded-full bg-[radial-gradient(closest-side,rgba(0,217,199,0.10),transparent)] will-change-transform animate-[ppDriftC_38s_ease-in-out_infinite_alternate] motion-reduce:animate-none" />
          {/* Faint engineering grid — pure CSS gradients at ~4%. */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
              backgroundSize: "72px 72px",
            }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="mx-auto max-w-[90rem] px-6 pb-12 pt-28 md:px-10 md:pb-20 md:pt-40">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-acid md:text-sm">
          {PATH_KICKER}
        </p>
        <h2 className="mt-4 max-w-[18ch] text-balance font-display text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[1.02] tracking-tight text-paper">
          Choose your project path
        </h2>
      </div>

      {/* Sticky card stack — each card pins a little lower and stacks over the last.
          pb-[24vh] gives the final card room to resolve before the next section. */}
      <ol className="mx-auto max-w-[90rem] px-6 pb-[24vh] md:px-10">
        {PATH_CARDS.map((card, i) => (
          <li
            key={card.id}
            className="sticky flex flex-col justify-center overflow-clip rounded-t-[24px] border-t border-paper/10 bg-ink-soft"
            style={{ top: `calc(${i} * 16vh + 8vh)`, zIndex: i + 1, minHeight: "58vh" }}
          >
            {/* Card's own restrained accent glow in the top-right corner. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-[6%] -top-[28%] h-[70%] w-[45%] opacity-20"
              style={{
                background: `radial-gradient(closest-side,${ACCENT_HEX[card.accent]},transparent)`,
              }}
            />
            <div className="relative p-8 md:p-14">
              <div className="grid gap-6 md:grid-cols-12">
                <div className="md:col-span-3">
                  <span
                    className={clsx(
                      "font-mono text-sm md:text-base",
                      NUMBER_TEXT[card.accent],
                    )}
                  >
                    {card.number}
                  </span>
                </div>
                <div className="md:col-span-6">
                  <h3 className="font-display text-3xl font-semibold text-paper md:text-5xl">
                    {card.title}
                  </h3>
                  <p className="mt-4 max-w-[46ch] font-sans text-base text-paper/60 md:text-lg">
                    {card.description}
                  </p>
                </div>
                <div className="flex items-start justify-start md:col-span-3 md:items-end md:justify-end">
                  <CtaPill
                    href="#contact"
                    quote
                    className="font-mono text-xs uppercase tracking-wider text-paper md:text-sm"
                    fillClassName={FILL_BG[card.accent]}
                    hoverTextClassName={FILL_TEXT[card.accent]}
                  >
                    {card.cta}
                  </CtaPill>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* Breathing room the NEXT section's overlap layer rises over. */}
      <div className="h-[70lvh]" aria-hidden />
    </section>
  );
}
