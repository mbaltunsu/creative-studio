"use client";

import { useRef, useState, useEffect } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { MM } from "@/lib/motion-tokens";
import { ShaderBackground } from "./shader-background";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM.motionOK, () => {
        const split = SplitText.create("[data-hero-title]", {
          type: "chars,words",
          mask: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 118,
              stagger: 0.028,
              duration: 1.05,
              ease: "power4.out",
              delay: 0.25,
            }),
        });

        gsap.from("[data-hero-sub]", {
          autoAlpha: 0,
          y: 24,
          duration: 0.9,
          ease: "power3.out",
          delay: 1.0,
          stagger: 0.12,
        });

        gsap.from("[data-hero-tag]", {
          autoAlpha: 0,
          y: 12,
          duration: 0.7,
          ease: "power3.out",
          delay: 1.35,
          stagger: 0.1,
        });

        /* Content drifts up + fades as the mosaic section takes over. */
        gsap.to("[data-hero-content]", {
          yPercent: -14,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom 35%",
            scrub: true,
          },
        });

        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink"
    >
      {/* Shader (static gradient fallback under reduced motion) */}
      <div className="absolute inset-0" aria-hidden>
        {reduce ? (
          <div className="h-full w-full bg-[radial-gradient(90%_70%_at_50%_100%,rgba(59,91,255,0.28),transparent_60%),radial-gradient(60%_50%_at_80%_20%,rgba(155,92,255,0.16),transparent_60%),radial-gradient(50%_40%_at_15%_30%,rgba(0,217,199,0.12),transparent_60%)]" />
        ) : (
          <ShaderBackground className="h-full w-full" />
        )}
        {/* Legibility scrims */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/90 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/70 to-transparent" />
      </div>

      {/* Headline block */}
      <div
        data-hero-content
        className="relative z-10 flex flex-col items-center px-5 text-center"
      >
        <p
          data-hero-sub
          className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.3em] text-acid md:text-sm"
        >
          {"{ creative production studio }"}
        </p>
        <h1
          data-hero-title
          className="font-display text-[clamp(3.2rem,13vw,12rem)] font-bold uppercase leading-[0.92] tracking-[-0.02em] text-paper"
        >
          Creative
          <br />
          Studio
        </h1>
        <p
          data-hero-sub
          className="mt-7 max-w-xl font-sans text-base text-paper/65 md:text-lg"
        >
          Everything a modern brand needs to move — animation, motion graphics,
          brand films, commercials, AI production, editorial and web. One
          studio.
        </p>
      </div>

      {/* Corner micro-tags */}
      <p
        data-hero-tag
        className="absolute bottom-6 left-6 hidden font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-paper/40 md:block"
      >
        Animation · Film · AI · Editorial · Web
      </p>
      <p
        data-hero-tag
        className="absolute bottom-6 right-6 hidden font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-paper/40 md:block"
      >
        ©2026 — Amsterdam
      </p>

      {/* Scroll cue */}
      <div
        data-hero-tag
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-hidden
      >
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-paper/50">
          Scroll
        </span>
        <span className="relative block h-8 w-px overflow-hidden bg-paper/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.6s_ease-in-out_infinite] bg-acid motion-reduce:animate-none" />
        </span>
      </div>
    </section>
  );
}
