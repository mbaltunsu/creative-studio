"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/components/ui/logo";

const STORAGE_KEY = "cs-cookie-consent";

/* Non-modal consent card, bottom-left. Client-only by nature (needs
   localStorage), so it renders nothing on the server and slides in after a
   beat — the SSR "no hidden content" rule applies to page sections, not to
   JS-dependent overlays. ponytail: no consent-mode plumbing — wire real
   analytics gating here when analytics exist. */
export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = window.setTimeout(() => setOpen(true), 1800);
    return () => window.clearTimeout(t);
  }, []);

  const choose = (value: "accepted" | "declined") => {
    localStorage.setItem(STORAGE_KEY, value);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 28, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          aria-label="Cookie consent"
          className="fixed inset-x-4 bottom-4 z-[60] sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[22.5rem]"
        >
          <div className="relative overflow-hidden rounded-2xl border border-paper/10 bg-ink-soft/90 p-5 shadow-[0_24px_64px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            {/* Acid hairline, echoing the accent system */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-acid/70 via-acid/20 to-transparent"
            />
            <div className="flex items-start justify-between gap-4">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-acid">
                {"{ cookies }"}
              </p>
              <Logo className="h-3.5 w-3.5 opacity-80" />
            </div>
            <h2 className="mt-3 font-display text-lg font-semibold tracking-tight text-paper">
              The digital kind, sadly.
            </h2>
            <p className="mt-1.5 font-sans text-[13px] leading-snug text-paper/55">
              We use a few cookies to understand traffic and keep the site
              feeling this smooth. No creepy cross-site tracking.
            </p>
            <div className="mt-4 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => choose("accepted")}
                className="rounded-xl bg-acid px-4 py-2.5 font-mono text-[12px] font-bold uppercase tracking-[0.08em] text-ink transition-transform duration-200 hover:scale-[1.03]"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => choose("declined")}
                className="rounded-xl border border-paper/15 px-4 py-2.5 font-mono text-[12px] font-bold uppercase tracking-[0.08em] text-paper/65 transition-colors duration-200 hover:border-paper/40 hover:text-paper"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
