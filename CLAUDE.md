# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # Next.js dev server (Turbopack), http://localhost:3000
npm run build         # production build (also type-checks and prerenders)
npm run start          # serve the production build
npm run lint            # eslint (flat config: eslint-config-next core-web-vitals + typescript)
npx tsc --noEmit          # type-check only, no build
node scripts/convert-images.mjs # convert public/images/_raw/*.png → webp (idempotent, skips existing outputs)
```

No test runner is configured. There is a single route (`/`) — no per-route or per-component test commands apply.

## Architecture

This is the Phase 1 landing page for a creative production studio. Category/portfolio pages are a future phase and don't exist yet — everything currently renders on `/` via `app/page.tsx`, which composes ~10 section components in a fixed scroll order inside a plain-block `<main>`.

### Animation engine (read before touching any section)

All scroll animation is GSAP + ScrollTrigger driven by Lenis smooth scroll, wired in two files that every animated component depends on:

- `lib/gsap.ts` — the **only** place `gsap` is imported from. Registers `ScrollTrigger`, `SplitText`, and `useGSAP` behind a `typeof window` guard. Never `import gsap from "gsap"` directly in a component.
- `components/providers/smooth-scroll.tsx` — instantiates Lenis with `autoRaf: false` and drives it from `gsap.ticker` (single rAF authority), syncs `lenis.on('scroll', ScrollTrigger.update)`, and sets `gsap.ticker.lagSmoothing(0)`. Exposes `getLenis()` for imperative access (e.g. `navbar.tsx` calls `lenis.stop()`/`start()` while a menu is open). Under `prefers-reduced-motion: reduce`, Lenis is never instantiated — native scroll still drives ScrollTrigger.

Rules enforced throughout the codebase — preserve them when editing:

- **Every top-level section is `relative isolate` with an opaque background** (`bg-ink` or `bg-paper`). This is load-bearing: it's what keeps the pinned/sticky sections' z-index stacking correct across the whole page.
- **No hidden/animated initial state in JSX.** SSR markup always renders the final, legible state (no `opacity-0` or transform utility classes on content). Client components set `from`-state via `gsap.set`/`gsap.from` inside `useGSAP(() => {...}, { scope: ref })`, which runs before paint — this avoids SSR/hydration flashes and keeps the page usable with JS disabled.
- **Responsive/reduced-motion branching uses `gsap.matchMedia()`**, not manual `window.innerWidth` checks — see `MM` breakpoints in `lib/motion-tokens.ts` (`desktop`, `mobile`, `motionOK`, `reduce`).
- **Randomness must be deterministic.** `lib/data/mosaic.ts` seeds a `mulberry32` PRNG at module scope for the mosaic tile-scatter offsets — never use `Math.random()` in a render path, since ScrollTrigger's `invalidateOnRefresh` re-runs function-based tween values on resize and non-deterministic values cause visible pops.
- **`content-visibility: auto` is never used anywhere on this page** — it changes intrinsic sizing during scroll and corrupts ScrollTrigger's cached pin start/end offsets.

Two sections are intentionally pure-CSS server components with **zero JS**: `components/sections/project-path.tsx` (a native `position: sticky` cascading card stack whose background rises over the previous section via a `-top-[100lvh]` layer + `overflow-clip`) and `components/sections/industries-marquee.tsx`. Don't introduce ScrollTrigger there — the sticky/overlap trick is deliberately CSS-only and cheaper than a pin.

`components/sections/mosaic-reel.tsx` and `components/anim/frame-sequence.tsx` are the two GSAP-pinned scroll-scrubbed sections. `FrameSequence` is a generic canvas image-sequence scrubber (config: frame `count` + `url(i)` template in `lib/data/frames.ts`); it stores frames as `HTMLImageElement`s (not `ImageBitmap`s — decoded RGBA bitmaps at scale would blow mobile memory), preloads frame 0 eagerly and the rest lazily, and crossfades adjacent frames so a small placeholder frame count still reads as intentional motion.

### Hero shader

`components/sections/shader-background.tsx` is a vendored, from-scratch WebGL1 fragment shader (recovered/de-minified from a third-party component, ported with zero dependencies) — not a library. Color palette and shader params are passed as props (`ShaderParams`, see `DEFAULT_SHADER_PARAMS`); it self-manages DPR capping, IntersectionObserver-gated pausing, and full GL context cleanup. Don't add a shader library (three.js, ogl, etc.) — extend this file's uniforms/params instead.

### Design tokens & content data

- Colors, fonts, and the marquee keyframe are defined once in `app/globals.css` under `@theme` (Tailwind v4) — `ink`/`paper` are the only two background colors used anywhere; `blue`/`coral`/`acid`/`teal`/`violet` are accents applied to interactive/decorative elements only, never body copy. Reuse these tokens (`bg-ink`, `text-acid`, etc.) rather than introducing new colors.
- All copy/structural content (nav links, solutions, services, projects, path cards, industries) lives in typed data files under `lib/data/`, imported by the section components — edit content there, not inline in JSX.
- `components/ui/cta-pill.tsx` is the shared CTA button (outline, fill-wipe hover) — `fillClassName` and `hoverTextClassName` must be passed together so hover text stays legible against the fill color (see the `FILL_BG`/`FILL_TEXT` accent maps in `project-path.tsx` for the pattern).

### Image/video assets

`public/images/*.webp`, `public/frames/reel/*.webp`, and `public/media/showreel.mp4` are generated placeholder assets (see `scripts/convert-images.mjs` for the PNG→webp conversion step). `lib/data/frames.ts`'s `REEL_FRAMES.count` currently points at 4 placeholder frames for the "In 14 days" scroll sequence — scaling to a real frame set is just dropping files into `public/frames/reel/` with the same naming and bumping `count`, no component changes.

## Frontend workflow / skills used to build this

This page was built with a specific skill/tool workflow — reuse it for consistency when adding sections or doing another design pass, rather than improvising a different process:

- **`frontend-design` skill** — invoked before writing section components to set the quality bar (distinctive, non-generic UI; no default AI-slop patterns like purple gradients, Inter/system fonts, or uniform 3-column feature grids). Re-invoke it when building new sections so they match the existing bar.
- **`taste-skill:redesign-skill`** — used for the final design QA pass (a dedicated review agent, not inline self-review), auditing against the design-system intent: color discipline (accents never on body copy), type-scale/eyebrow consistency across sections, container-width alignment, contrast, and generic-pattern smells. Its findings drove several fixes still in the code (see `FILL_BG`/`FILL_TEXT` accent maps in `project-path.tsx` for the contrast fix, and the unified `tracking-[0.3em]` eyebrow style across sections). Run this again as a subagent before considering any future visual pass "done" — don't just eyeball it.
- **`playwright-cli` skill** — used for all visual verification: scripted scroll-sweep screenshots at desktop (1440px) and mobile (390px) widths, mega-menu/mobile-menu interaction checks, and confirming `prefers-reduced-motion` fallbacks actually render (static hero, no pins, video with native controls). Screenshot-and-Read is the verification loop for any animation or layout change here — don't assume a GSAP timeline or responsive variant works without watching it.
- **`codex-cli`** (the `codex exec` CLI with its built-in image-gen skill, model `gpt-5.6-sol`, `gpt-image-2` under the hood) — used to generate every placeholder image and the source stills for the placeholder showreel. First consult the model on achievable subjects/style for the given art direction before batch-generating; for a fixed-camera sequence (like the "In 14 days" frames), generate a master frame and edit *from that master* for every subsequent frame — chaining edit-of-edit compounds drift.
