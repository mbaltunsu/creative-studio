"use client";

import { useRef } from "react";
import clsx from "clsx";
import { gsap, useGSAP } from "@/lib/gsap";
import { Marquee } from "@/components/anim/marquee";
import { CtaPill } from "@/components/ui/cta-pill";
import { Logo } from "@/components/ui/logo";
import { NAV_LINKS, SOLUTIONS } from "@/lib/data/nav";

/* Shared mono micro-label: uppercase, tracked-out, voice `{ like this }`. */
const MONO_LABEL = "font-mono text-xs font-bold uppercase tracking-[0.3em]";

/* Discipline marquee words — each slash separator gets its own accent. */
const DISCIPLINES = [
  { word: "ANIMATION", slash: "text-blue" },
  { word: "MOTION", slash: "text-coral" },
  { word: "FILM", slash: "text-acid" },
  { word: "AI PRODUCTION", slash: "text-violet" },
  { word: "EDITORIAL", slash: "text-teal" },
  { word: "WEB", slash: "text-blue" },
] as const;

/* Social links — badge cycles the four accents. */
const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com", badge: "bg-blue" },
  { label: "LinkedIn", href: "https://linkedin.com", badge: "bg-coral" },
  { label: "Vimeo", href: "https://vimeo.com", badge: "bg-acid" },
  { label: "Awwwards", href: "https://awwwards.com", badge: "bg-violet" },
] as const;

/* Per-link hover accent for the Pages column. */
const NAV_HOVER = [
  "hover:text-blue",
  "hover:text-coral",
  "hover:text-acid",
  "hover:text-teal",
] as const;

export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Single ScrollTrigger reveal. Initial states are set by gsap.from only
      // (immediateRender) — never via hidden classes in the JSX — so the markup
      // hydrates identically on server and client and stays visible without JS.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });

      tl.from("[data-footer-inner]", {
        y: 96,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
      }).from(
        "[data-divider]",
        {
          scaleX: 0,
          duration: 1.1,
          ease: "power2.inOut",
        },
        "-=0.5",
      );
    },
    { scope: ref },
  );

  return (
    <footer
      ref={ref}
      id="contact"
      className="relative isolate overflow-clip bg-ink text-paper"
    >
      <div data-footer-inner>
        {/* 1 — Discipline marquee */}
        <Marquee
          duration={30}
          className="border-b border-paper/10 py-6 md:py-8"
        >
          {DISCIPLINES.map((d) => (
            <span
              key={d.word}
              className="flex shrink-0 items-center pr-8 font-display text-[clamp(3rem,8vw,7rem)] font-semibold uppercase leading-none text-paper/90 md:pr-12"
            >
              {d.word}
              <span aria-hidden className={clsx("pl-8 md:pl-12", d.slash)}>
                /
              </span>
            </span>
          ))}
        </Marquee>

        {/* 2–4 — content column */}
        <div className="mx-auto max-w-[90rem] px-6 pt-20 md:px-10 md:pt-28">
          {/* 2 — invitation + grid */}
          <p className={clsx(MONO_LABEL, "text-acid")}>{"{ start a project }"}</p>
          <h2 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.03] tracking-tight md:text-6xl">
            Let&rsquo;s make something worth watching.
          </h2>

          <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-12">
            {/* Studio + socials */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3">
                <Logo />
                <span className="font-display text-lg font-bold tracking-tight">
                  CREATIVE STUDIO
                </span>
              </div>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/40">
                Independent studio for animation, motion, film and AI
                production.
              </p>

              <p className={clsx("mt-8", MONO_LABEL, "text-paper/40")}>
                {"{ follow us }"}
              </p>
              <nav aria-label="Social" className="mt-4">
                <ul className="space-y-3">
                  {SOCIALS.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/social inline-flex items-center gap-3"
                      >
                        <span
                          aria-hidden
                          className={clsx(
                            "grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[4px] text-ink",
                            s.badge,
                          )}
                        >
                          <span className="text-[11px] leading-none">↗</span>
                        </span>
                        <span className="text-sm text-paper/80 underline-offset-4 group-hover/social:underline">
                          {s.label}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Pages */}
            <nav aria-label="Pages" className="lg:col-span-2">
              <p className={clsx(MONO_LABEL, "text-paper/40")}>{"{ pages }"}</p>
              <ul className="mt-4 space-y-3">
                {NAV_LINKS.map((link, i) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={clsx(
                        "text-sm text-paper transition-colors",
                        NAV_HOVER[i % NAV_HOVER.length],
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Solutions */}
            <nav aria-label="Solutions" className="lg:col-span-3">
              <p className={clsx(MONO_LABEL, "text-paper/40")}>
                {"{ solutions }"}
              </p>
              <ul className="mt-4 space-y-3">
                {SOLUTIONS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      className="text-sm text-paper/70 transition-colors hover:text-paper"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact */}
            <div className="lg:col-span-3">
              <p className={clsx(MONO_LABEL, "text-paper/40")}>
                {"{ contact }"}
              </p>
              <address className="mt-4 space-y-3 text-sm not-italic text-paper/70">
                <a
                  href="mailto:hello@creativestudio.example"
                  className="block w-fit transition-colors hover:text-acid"
                >
                  hello@creativestudio.example
                </a>
                <span className="block">+31 20 000 0000</span>
                <span className="block">Amsterdam, NL</span>
              </address>
            </div>
          </div>

          {/* 3 — animated divider (initial scaleX set by gsap.from, not the JSX) */}
          <div
            data-divider
            className="mt-16 h-px w-full origin-left bg-paper/20 md:mt-24"
          />

          {/* 4 — CTA row */}
          <div className="grid items-center gap-8 py-14 md:py-20 lg:grid-cols-4">
            <div className="flex flex-col gap-2 font-mono text-xs uppercase text-paper/40">
              <span>&copy; 2026 Creative Studio</span>
              <a
                href="#privacy"
                className="w-fit transition-colors hover:text-paper"
              >
                Privacy
              </a>
              <a
                href="#terms"
                className="w-fit transition-colors hover:text-paper"
              >
                Terms
              </a>
            </div>

            <div className="flex justify-center lg:col-span-2">
              <CtaPill
                href="#contact"
                className="font-display text-2xl text-paper md:text-5xl"
                fillClassName="bg-acid"
              >
                START A PROJECT
              </CtaPill>
            </div>

            <div className="hidden lg:block" aria-hidden />
          </div>
        </div>
      </div>
    </footer>
  );
}
