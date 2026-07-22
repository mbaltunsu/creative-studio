"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import clsx from "clsx";
import { Logo } from "@/components/ui/logo";
import { NAV_LINKS } from "@/lib/data/nav";
import { getLenis } from "@/components/providers/smooth-scroll";
import { MegaMenu } from "./mega-menu";
import { MobileMenu } from "./mobile-menu";

function UserIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
      <circle cx="8" cy="5" r="2.6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.8 14c.9-2.6 2.8-3.9 5.2-3.9s4.3 1.3 5.2 3.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function Navbar() {
  const ref = useRef<HTMLElement>(null);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuOpenRef = useRef(false);
  menuOpenRef.current = megaOpen || mobileOpen;
  const closeTimer = useRef<number | null>(null);

  /* Hide on scroll down / show on scroll up — direction-anchor hysteresis so
     1px jitter never flickers the bar. Native scroll listener works under Lenis
     too (Lenis animates real window scroll). No React state on the scroll path. */
  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    /* Top-level paper sections wash out the 35% glass — deepen it while the
       bar overlaps one (see .nav-over-paper in globals.css). */
    const paperSections = Array.from(
      document.querySelectorAll<HTMLElement>("main > section.bg-paper"),
    );
    let lastY = window.scrollY;
    let anchor = lastY;
    let dir = 0;
    let hidden = false;
    const setHidden = (h: boolean) => {
      if (h === hidden) return;
      hidden = h;
      nav.classList.toggle("nav-hidden", h);
      if (h) setMegaOpen(false);
    };
    const onScroll = () => {
      nav.classList.toggle(
        "nav-over-paper",
        paperSections.some((s) => {
          const r = s.getBoundingClientRect();
          return r.top < 72 && r.bottom > 0;
        }),
      );
      const y = window.scrollY;
      const d = y > lastY ? 1 : y < lastY ? -1 : 0;
      if (d !== 0 && d !== dir) {
        dir = d;
        anchor = lastY;
      }
      lastY = y;
      if (menuOpenRef.current || y < 80) {
        setHidden(false);
        return;
      }
      if (dir === 1 && y - anchor > 24) setHidden(true);
      if (dir === -1 && anchor - y > 24) setHidden(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Freeze page scroll while the fullscreen mobile menu is open. */
  useEffect(() => {
    const lenis = getLenis();
    if (mobileOpen) lenis?.stop();
    else lenis?.start();
    return () => {
      getLenis()?.start();
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const scheduleCloseMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 140);
  };

  return (
    <>
      <header ref={ref} className="site-nav fixed inset-x-0 top-0 z-50">
        <div
          className={clsx(
            "nav-veil relative border-b transition-colors duration-300",
            megaOpen
              ? "border-paper/10 bg-ink"
              : "border-paper/15 bg-ink/35 backdrop-blur-[20px]",
          )}
        >
          <div className="mx-auto grid h-16 max-w-[90rem] grid-cols-[1fr_auto_1fr] items-center px-5 md:h-[72px] md:px-10">
            <a href="#top" aria-label="Creative Studio — home" className="flex w-fit items-center gap-3">
              <Logo />
              <span className="hidden font-mono text-xs font-bold uppercase tracking-[0.18em] text-paper sm:block">
                Creative&nbsp;Studio
              </span>
            </a>

            <nav className="hidden items-center gap-9 md:flex" aria-label="Main">
              {NAV_LINKS.map((l) =>
                l.mega ? (
                  <div
                    key={l.label}
                    onPointerEnter={openMega}
                    onPointerLeave={scheduleCloseMega}
                  >
                    <button
                      type="button"
                      aria-expanded={megaOpen}
                      aria-haspopup="true"
                      onFocus={openMega}
                      onClick={() => setMegaOpen((v) => !v)}
                      className={clsx(
                        "font-mono text-[13px] font-bold uppercase tracking-[0.14em] transition-colors",
                        megaOpen ? "text-acid" : "text-paper/80 hover:text-paper",
                      )}
                    >
                      {l.label}
                    </button>
                  </div>
                ) : (
                  <a
                    key={l.label}
                    href={l.href}
                    className="font-mono text-[13px] font-bold uppercase tracking-[0.14em] text-paper/80 transition-colors hover:text-paper"
                  >
                    {l.label}
                  </a>
                ),
              )}
            </nav>

            <div className="flex items-center justify-end gap-5">
              <a
                href="#login"
                className="hidden items-center gap-2 font-mono text-[13px] font-bold uppercase tracking-[0.14em] text-paper/80 transition-colors hover:text-paper md:flex"
              >
                Log in <UserIcon />
              </a>
              <a
                href="#contact"
                data-quote
                className="hidden rounded-xl bg-acid px-4 py-2.5 font-mono text-[13px] font-bold uppercase tracking-[0.08em] text-ink transition-transform duration-200 hover:scale-[1.03] md:block"
              >
                Get a quote <span aria-hidden>→</span>
              </a>
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                className="relative z-50 flex size-10 items-center justify-center text-paper md:hidden"
              >
                <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
                  {mobileOpen ? (
                    <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  ) : (
                    <path d="M2 5.5h16M2 10h16M2 14.5h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {megaOpen && (
              <MegaMenu
                onClose={() => setMegaOpen(false)}
                onPointerEnter={openMega}
                onPointerLeave={scheduleCloseMega}
              />
            )}
          </AnimatePresence>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
