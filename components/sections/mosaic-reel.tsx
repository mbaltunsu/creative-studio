"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { gsap, useGSAP } from "@/lib/gsap";
import { MM } from "@/lib/motion-tokens";
import { COLS, ROWS, SCATTER, MOSAIC_IMAGE } from "@/lib/data/mosaic";

const REEL_SRC = "/media/showreel.mp4";
const TILES = Array.from({ length: COLS * ROWS }, (_, i) => i);

/* Scattered tiles of one image scrub together into the full picture, the frame
   scales to cover the viewport, and the showreel crossfades in — one pinned
   timeline. SSR renders the tiles ASSEMBLED (no-JS/SEO state); GSAP applies the
   scatter before first paint. */
export function MosaicReel() {
  const ref = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduce, setReduce] = useState(false);

  preload(MOSAIC_IMAGE, { as: "image" });

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      const build = (endPct: number, scatterMul: number) => {
        const frame = frameRef.current;
        const video = videoRef.current;
        if (!frame || !video) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: `+=${endPct}%`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const v = videoRef.current;
              if (!v) return;
              /* hysteresis so play/pause doesn't thrash at the boundary */
              if (self.progress > 0.68) v.play().catch(() => {});
              else if (self.progress < 0.6) v.pause();
            },
          },
        });

        tl.from(
          "[data-tile]",
          {
            x: (i: number) => SCATTER[i].dx * frame.offsetWidth * scatterMul,
            y: (i: number) => SCATTER[i].dy * frame.offsetHeight * scatterMul,
            rotation: (i: number) => SCATTER[i].rot,
            scale: (i: number) => SCATTER[i].scale,
            ease: "power2.out",
            duration: 2,
            stagger: { each: 0.05, from: "edges", grid: [ROWS, COLS] },
          },
          0,
        )
          .to({}, { duration: 0.35 })
          .to(
            frame,
            {
              scale: () =>
                Math.max(
                  window.innerWidth / frame.offsetWidth,
                  window.innerHeight / frame.offsetHeight,
                ) * 1.005,
              duration: 1,
              ease: "power1.inOut",
            },
            ">",
          )
          .to(video, { autoAlpha: 1, duration: 0.4 }, "<0.6")
          .to("[data-reel-tag]", { autoAlpha: 1, y: 0, duration: 0.25 }, "<0.1")
          .to({}, { duration: 0.3 });
      };

      mm.add(`${MM.desktop} and ${MM.motionOK}`, () => build(400, 1));
      /* Short mobile scrub — 300% took 3-4 full swipes to clear the pin. */
      mm.add(`${MM.mobile} and ${MM.motionOK}`, () => build(150, 0.6));
    },
    { scope: ref },
  );

  /* Reduced motion: no pin, no scrub — the finished image and the reel with
     controls, stacked. */
  if (reduce) {
    return (
      <section className="relative isolate bg-ink px-5 py-24">
        <div className="mx-auto max-w-5xl space-y-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MOSAIC_IMAGE} alt="Studio showpiece" className="w-full rounded-xl" />
          <video
            src={REEL_SRC}
            poster={MOSAIC_IMAGE}
            controls
            muted
            playsInline
            preload="metadata"
            className="w-full rounded-xl"
            aria-label="Studio showreel"
          />
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative isolate bg-ink">
      <div className="relative flex h-lvh items-center justify-center overflow-hidden">
        <div
          ref={frameRef}
          className="relative aspect-video w-[min(92vw,115vmin)] md:w-[min(78vw,115vmin)] will-change-transform"
        >
          {TILES.map((i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            return (
              <div
                key={i}
                data-tile
                className="absolute will-change-transform"
                style={{
                  left: `${(col * 100) / COLS}%`,
                  top: `${(row * 100) / ROWS}%`,
                  width: `${100 / COLS}%`,
                  height: `${100 / ROWS}%`,
                  backgroundImage: `url(${MOSAIC_IMAGE})`,
                  backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                  backgroundPosition: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
                }}
              />
            );
          })}
        </div>

        <video
          ref={videoRef}
          src={REEL_SRC}
          poster={MOSAIC_IMAGE}
          muted
          playsInline
          loop
          preload="metadata"
          aria-hidden
          className="absolute inset-0 z-10 h-full w-full object-cover opacity-0"
        />

        <p
          data-reel-tag
          className="absolute bottom-6 left-6 z-20 translate-y-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-paper/70 opacity-0"
        >
          {"{ showreel — 2026 }"}
        </p>
      </div>
    </section>
  );
}
