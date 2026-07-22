"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { MM } from "@/lib/motion-tokens";

/* Scroll-scrubbed canvas image sequence (Apple-product-page style), pinned.

   Frames are stored as decoded HTMLImageElements — NOT ImageBitmaps: 100
   decoded 1080p RGBA bitmaps ≈ 830MB, which kills mobile Safari. Compressed
   images lean on the browser's decode cache instead; scrubbing is sequential
   so cache behavior is good.

   Placeholder-friendly: with `blend`, adjacent frames crossfade via
   globalAlpha, so a 4-frame set reads as an intentional slow dissolve and a
   100-frame set reads as video scrubbing — same code path. Scaling up later =
   drop files + bump `count`. */
export function FrameSequence({
  count,
  url,
  length = "+=250%",
  mobileLength = "+=180%",
  blend = true,
  onTimeline,
  className,
  children,
}: {
  count: number;
  url: (i: number) => string;
  length?: string;
  mobileLength?: string;
  blend?: boolean;
  onTimeline?: (tl: gsap.core.Timeline) => void;
  className?: string;
  children?: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const lastDrawn = useRef(-1);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const canvas = canvasRef.current;
      if (!wrap || !canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const images = imagesRef.current;
      images.length = count;

      const nearestLoaded = (i: number) => {
        for (let k = Math.min(i, count - 1); k >= 0; k--) {
          const img = images[k];
          if (img?.complete && img.naturalWidth > 0) return img;
        }
        return null;
      };

      const paint = (img: HTMLImageElement, alpha: number) => {
        const s = Math.max(
          canvas.width / img.naturalWidth,
          canvas.height / img.naturalHeight,
        );
        ctx.globalAlpha = alpha;
        ctx.drawImage(
          img,
          (canvas.width - img.naturalWidth * s) / 2,
          (canvas.height - img.naturalHeight * s) / 2,
          img.naturalWidth * s,
          img.naturalHeight * s,
        );
      };

      const draw = (f: number) => {
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const i = Math.floor(f);
        const frac = f - i;
        const a = nearestLoaded(i);
        if (!a) return;
        paint(a, 1);
        if (blend && frac > 0.001) {
          const b = nearestLoaded(Math.min(i + 1, count - 1));
          if (b && b !== a) paint(b, frac);
        }
        ctx.globalAlpha = 1;
      };

      const loadFrame = (i: number) =>
        new Promise<void>((resolve) => {
          if (images[i]) return resolve();
          const img = new Image();
          img.fetchPriority = i === 0 ? "high" : "low";
          img.decoding = "async";
          img.src = url(i);
          images[i] = img;
          img
            .decode()
            .catch(() => {})
            .finally(() => resolve());
        });

      /* device-pixel canvas, DPR-capped */
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const state = { frame: 0 };
      const resize = () => {
        const r = wrap.getBoundingClientRect();
        canvas.width = Math.max(1, Math.round(r.width * dpr));
        canvas.height = Math.max(1, Math.round(r.height * dpr));
        lastDrawn.current = -1;
        draw(state.frame);
      };
      const ro = new ResizeObserver(resize);
      ro.observe(wrap);
      resize();

      loadFrame(0).then(() => draw(state.frame));

      /* Warm the rest when the section is ~1.5 viewports away; small
         concurrency pool, ascending (matches scroll access order). */
      let warmed = false;
      const warm = () => {
        if (warmed) return;
        warmed = true;
        let next = 1;
        const pump = () => {
          if (next >= count) return;
          const i = next++;
          loadFrame(i).then(() => {
            if (Math.floor(state.frame) === i || Math.ceil(state.frame) === i) {
              lastDrawn.current = -1;
              draw(state.frame);
            }
            pump();
          });
        };
        for (let c = 0; c < 6; c++) pump();
      };
      ScrollTrigger.create({
        trigger: wrap,
        start: "top 250%",
        once: true,
        onEnter: warm,
      });

      const mm = gsap.matchMedia();
      const build = (end: string, pin: boolean) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end,
            pin,
            scrub: true,
            invalidateOnRefresh: true,
            onEnter: warm,
          },
        });
        tl.to(
          state,
          {
            frame: count - 1,
            ease: "none",
            duration: 1,
            onUpdate: () => {
              const f = blend ? state.frame : Math.round(state.frame);
              if (f !== lastDrawn.current) {
                lastDrawn.current = f;
                draw(f);
              }
            },
          },
          0,
        );
        onTimeline?.(tl);
        return tl;
      };

      mm.add(`${MM.desktop} and ${MM.motionOK}`, () => {
        build(length, true);
      });
      mm.add(`${MM.mobile} and ${MM.motionOK}`, () => {
        build(mobileLength, true);
      });
      mm.add(MM.reduce, () => {
        /* No pin, no scrub: draw the final frame once, content static. */
        loadFrame(count - 1).then(() => {
          state.frame = count - 1;
          lastDrawn.current = -1;
          draw(count - 1);
        });
      });

      return () => ro.disconnect();
    },
    { scope: wrapRef },
  );

  return (
    <div ref={wrapRef} className={`relative h-lvh overflow-hidden ${className ?? ""}`}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      {children}
    </div>
  );
}
