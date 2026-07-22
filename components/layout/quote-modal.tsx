"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import { getLenis } from "@/components/providers/smooth-scroll";
import { SOLUTIONS, ACCENT_HEX } from "@/lib/data/nav";
import { CURRENCIES, type CurrencyCode } from "@/lib/data/quote";

/* Fullscreen "start a project" brief-builder. Opens via a delegated click
   listener on any `a[data-quote]` — so server components (CtaPill call sites)
   trigger it with a plain attribute and keep #contact as their no-JS fallback.
   Phase 1: three sequential-unlock steps compose a live brief sentence.
   Phase 2: recap + contact form → POST /api/quote. */

const EASE = [0.32, 0.72, 0, 1] as const;
const MONO_LABEL = "font-mono text-xs font-bold uppercase tracking-[0.3em]";
const FIELD_INPUT =
  "mt-2 w-full border-b border-paper/20 bg-transparent pb-2.5 font-sans text-lg text-paper outline-none transition-colors placeholder:text-paper/25 focus:border-acid";

/* Step accents: 01 blue → 02 coral → 03 violet; acid is reserved for actions. */
const STEP_HEX = [ACCENT_HEX.blue, ACCENT_HEX.coral, ACCENT_HEX.violet];

type Phase = "select" | "details" | "sent";

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
      <path
        d="M5 5l10 10M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Outline circle whose checkmark draws itself when the step completes. */
function StepCheck({ done, hex }: { done: boolean; hex: string }) {
  return (
    <svg viewBox="0 0 36 36" className="size-9 shrink-0" aria-hidden>
      <circle
        cx="18"
        cy="18"
        r="16.5"
        fill="none"
        stroke={done ? hex : "rgba(247,247,242,0.2)"}
        strokeWidth="1.5"
        className="transition-[stroke] duration-300"
      />
      <motion.path
        d="M11.5 18.5l4.5 4.5 8.5-9"
        fill="none"
        stroke={hex}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: done ? 1 : 0, opacity: done ? 1 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      />
    </svg>
  );
}

/* A word slot in the live brief sentence — dim dots until filled, then the
   value drops in wearing its step's accent. Keyed so edits replay the entry. */
function Slot({ value, hex }: { value: string | null; hex: string }) {
  if (!value) return <span className="text-paper/20">· · ·</span>;
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="inline-block"
      style={{ color: hex }}
    >
      {value}
    </motion.span>
  );
}

export function QuoteModal() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("select");

  /* Brief */
  const [projectType, setProjectType] = useState<string | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [amount, setAmount] = useState(""); // raw digit string
  const [launchDate, setLaunchDate] = useState(""); // yyyy-mm-dd

  /* Contact — controlled so values survive the select ⇄ details flip. */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  /* Global open trigger: any `a[data-quote]` click, plain clicks only. */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
        return;
      const a =
        e.target instanceof Element ? e.target.closest("a[data-quote]") : null;
      if (!a) return;
      e.preventDefault();
      triggerRef.current = a as HTMLElement;
      setOpen(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  /* Freeze page scroll while open (house overlay pattern). */
  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
    return () => {
      getLenis()?.start();
    };
  }, [open]);

  /* Move focus in on open; return it to the trigger on close. */
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => closeRef.current?.focus());
    } else {
      triggerRef.current?.focus();
    }
  }, [open]);

  const reset = () => {
    setPhase("select");
    setProjectType(null);
    setCurrency("USD");
    setAmount("");
    setLaunchDate("");
    setName("");
    setEmail("");
    setPhone("");
    setDescription("");
    setError(null);
  };

  const close = () => {
    if (phase === "sent") reset();
    setOpen(false);
  };

  /* Esc + a minimal focus loop — the overlay covers the page, so trapping Tab
     inside the panel is all the isolation we need. */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      close();
      return;
    }
    if (e.key !== "Tab" || !panelRef.current) return;
    const els = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => el.offsetParent !== null);
    if (!els.length) return;
    const first = els[0];
    const last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  /* Derived */
  const symbol = CURRENCIES.find((c) => c.code === currency)!.symbol;
  const amountNum = amount ? Number(amount) : 0;
  const niceAmount = amountNum
    ? `${symbol}${amountNum.toLocaleString("en-US")}`
    : null;
  const niceDate = launchDate
    ? new Date(`${launchDate}T00:00:00`).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;
  const done = [!!projectType, amountNum > 0, !!launchDate];
  const allDone = done.every(Boolean);
  const article = projectType && /^[aeiou]/i.test(projectType) ? "An" : "A";

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectType,
          currency,
          amount: amountNum,
          launchDate,
          name,
          email,
          phone: phone || undefined,
          description,
        }),
      });
      if (!res.ok) throw new Error();
      setPhase("sent");
    } catch {
      setError("Couldn’t send right now — try again, or email us directly.");
    } finally {
      setSending(false);
    }
  };

  const steps = [
    {
      title: "Select project type",
      hint: "pick one to unlock budget",
      summary: projectType,
      control: (
        <div role="radiogroup" aria-label="Project type">
          {SOLUTIONS.map((s) => {
            const active = projectType === s.label;
            return (
              <button
                key={s.label}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setProjectType(s.label)}
                className={clsx(
                  "flex w-full items-center gap-3 border-b border-paper/10 py-2.5 text-left font-sans text-[15px] transition-colors md:py-3",
                  active ? "text-paper" : "text-paper/50 hover:text-paper/90",
                )}
              >
                <span
                  aria-hidden
                  className={clsx(
                    "size-1.5 shrink-0 rounded-full transition-[scale,opacity] duration-300",
                    active ? "scale-[1.8] opacity-100" : "opacity-40",
                  )}
                  style={{ background: ACCENT_HEX[s.accent] }}
                />
                {s.label}
              </button>
            );
          })}
        </div>
      ),
    },
    {
      title: "Set a budget",
      hint: "a rough number is fine",
      summary: niceAmount,
      control: (
        <>
          <div className="flex gap-2" role="group" aria-label="Currency">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                type="button"
                aria-pressed={currency === c.code}
                onClick={() => setCurrency(c.code)}
                className={clsx(
                  "rounded-full border px-3.5 py-1.5 font-mono text-xs font-bold tracking-wide transition-colors",
                  currency === c.code
                    ? "border-coral bg-coral text-ink"
                    : "border-paper/25 text-paper/60 hover:border-paper/60 hover:text-paper",
                )}
              >
                {c.code}
              </button>
            ))}
          </div>
          <label className="mt-8 block">
            <span className="sr-only">Budget amount</span>
            <div className="flex items-baseline gap-2 border-b border-paper/20 pb-2 transition-colors focus-within:border-coral">
              <span
                aria-hidden
                className="font-display text-3xl font-semibold text-paper/40 md:text-4xl"
              >
                {symbol}
              </span>
              <input
                inputMode="numeric"
                autoComplete="off"
                placeholder="25,000"
                value={amount ? Number(amount).toLocaleString("en-US") : ""}
                onChange={(e) =>
                  setAmount(e.target.value.replace(/\D/g, "").slice(0, 9))
                }
                className="w-full bg-transparent font-display text-3xl font-semibold text-paper outline-none placeholder:text-paper/20 md:text-4xl"
              />
            </div>
          </label>
        </>
      ),
    },
    {
      title: "Estimated launch date",
      hint: "we plan backwards from it",
      summary: niceDate,
      control: (
        <label className="block">
          <span className="sr-only">Estimated launch date</span>
          <input
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            value={launchDate}
            onChange={(e) => setLaunchDate(e.target.value)}
            className="w-full border-b border-paper/20 bg-transparent pb-2 font-display text-2xl font-semibold text-paper outline-none transition-colors [color-scheme:dark] focus:border-violet md:text-3xl"
          />
        </label>
      ),
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onKeyDown={onKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label="Start a project"
          className="fixed inset-0 z-[80] flex flex-col bg-ink text-paper md:flex-row"
        >
          {/* Rail — top bar on mobile, left column on desktop */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex shrink-0 items-center gap-4 border-b border-paper/10 bg-ink-soft px-5 py-4 md:w-[300px] md:flex-col md:items-start md:border-b-0 md:border-r md:px-8 md:py-8"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close"
              className="grid size-11 shrink-0 place-items-center rounded-full border border-paper/25 text-paper/80 transition-colors hover:border-paper hover:text-paper"
            >
              <CloseIcon />
            </button>
            <p className={clsx(MONO_LABEL, "text-acid")}>
              {"{ start a project }"}
            </p>
            <div className="hidden md:mt-auto md:block">
              <p className="max-w-[24ch] font-sans text-sm leading-relaxed text-paper/50">
                Already know exactly what you need? Skip the form and write to
                us directly — project type, budget, launch date.
              </p>
              <a
                href="mailto:hello@creativestudio.example"
                className="mt-4 inline-block font-sans text-sm text-acid underline underline-offset-4 transition-colors hover:text-paper"
              >
                hello@creativestudio.example
              </a>
            </div>
          </motion.div>

          {/* Main */}
          <div
            data-lenis-prevent
            className="flex-1 overflow-y-auto overscroll-contain"
          >
            <AnimatePresence mode="wait" initial={false}>
              {phase === "select" && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="flex min-h-full flex-col px-6 py-10 md:px-14 md:py-16"
                >
                  <div className="grid flex-1 gap-12 md:grid-cols-3 md:gap-10">
                    {steps.map((step, i) => {
                      const unlocked = i === 0 || done[i - 1];
                      return (
                        <motion.div
                          key={step.title}
                          initial={{ opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.45,
                            delay: 0.08 + i * 0.08,
                            ease: EASE,
                          }}
                        >
                          {/* Inner div owns the locked-dim so motion's inline
                              opacity never fights the class. */}
                          <div
                            className={clsx(
                              "flex h-full flex-col transition-opacity duration-500",
                              unlocked ? "opacity-100" : "opacity-30",
                            )}
                          >
                            <p
                              className="font-mono text-xs font-bold tracking-[0.2em]"
                              style={{ color: STEP_HEX[i] }}
                            >
                              {`{ 0${i + 1} }`}
                            </p>
                            <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-paper md:text-[1.75rem]">
                              {step.title}
                            </h3>
                            <motion.div
                              aria-hidden
                              className="mt-4 h-px origin-left"
                              style={{ background: STEP_HEX[i] }}
                              initial={false}
                              animate={{ scaleX: unlocked ? 1 : 0 }}
                              transition={{ duration: 0.5, ease: EASE }}
                            />
                            <fieldset
                              disabled={!unlocked}
                              className="mt-8 min-w-0 flex-1"
                            >
                              {step.control}
                            </fieldset>
                            <div className="mt-10 flex items-center gap-3">
                              <StepCheck done={done[i]} hex={STEP_HEX[i]} />
                              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-paper/40">
                                {done[i] ? step.summary : step.hint}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Live brief sentence + continue */}
                  <div className="mt-14 flex flex-col gap-8 border-t border-paper/10 pt-8 md:mt-16 md:flex-row md:items-end md:justify-between">
                    <p
                      aria-live="polite"
                      className="max-w-3xl font-display text-2xl font-semibold leading-snug tracking-tight text-paper/30 md:text-4xl"
                    >
                      {article} <Slot value={projectType} hex={STEP_HEX[0]} />{" "}
                      project, around{" "}
                      <Slot value={niceAmount} hex={STEP_HEX[1]} />, launching{" "}
                      <Slot value={niceDate} hex={STEP_HEX[2]} />.
                    </p>
                    <AnimatePresence>
                      {allDone && (
                        <motion.button
                          type="button"
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 16 }}
                          transition={{ duration: 0.35, ease: EASE }}
                          onClick={() => setPhase("details")}
                          className="shrink-0 self-start rounded-xl bg-acid px-7 py-4 font-mono text-sm font-bold uppercase tracking-[0.08em] text-ink transition-transform duration-200 hover:scale-[1.03] md:self-auto"
                        >
                          Continue <span aria-hidden>→</span>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {phase === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="flex min-h-full flex-col px-6 py-10 md:px-14 md:py-16"
                >
                  <button
                    type="button"
                    onClick={() => setPhase("select")}
                    className="w-fit font-mono text-xs font-bold uppercase tracking-[0.14em] text-paper/50 transition-colors hover:text-paper"
                  >
                    <span aria-hidden>←</span> Edit brief
                  </button>

                  <div className="mt-8 grid flex-1 gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Recap */}
                    <div>
                      <h3 className="border-b border-paper/15 pb-4 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                        Your selections
                      </h3>
                      {[
                        { label: "Project type", value: projectType },
                        { label: "Project budget", value: niceAmount },
                        { label: "Desired launch", value: niceDate },
                      ].map((row, i) => (
                        <div key={row.label} className="mt-9">
                          <p
                            className="font-mono text-xs font-bold uppercase tracking-[0.2em]"
                            style={{ color: STEP_HEX[i] }}
                          >
                            {row.label}
                          </p>
                          <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-paper md:text-5xl">
                            {row.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Contact form */}
                    <form onSubmit={submit} className="flex flex-col">
                      <h3 className="border-b border-paper/15 pb-4 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                        Your information
                      </h3>
                      <div className="mt-9 space-y-8">
                        <label className="block">
                          <span className={clsx(MONO_LABEL, "text-paper/50")}>
                            Full name *
                          </span>
                          <input
                            required
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={FIELD_INPUT}
                          />
                        </label>
                        <label className="block">
                          <span className={clsx(MONO_LABEL, "text-paper/50")}>
                            Email address *
                          </span>
                          <input
                            required
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={FIELD_INPUT}
                          />
                        </label>
                        <label className="block">
                          <span className={clsx(MONO_LABEL, "text-paper/50")}>
                            Phone (optional)
                          </span>
                          <input
                            type="tel"
                            autoComplete="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={FIELD_INPUT}
                          />
                        </label>
                        <label className="block">
                          <span className={clsx(MONO_LABEL, "text-paper/50")}>
                            Short project description *
                          </span>
                          <textarea
                            required
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What are we making? A few sentences is plenty."
                            className={clsx(FIELD_INPUT, "resize-none")}
                          />
                        </label>
                      </div>

                      {error && (
                        <p className="mt-6 font-mono text-xs font-bold uppercase tracking-[0.14em] text-coral">
                          {error}
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={sending}
                        className="mt-10 h-14 w-full rounded-xl bg-acid font-mono text-sm font-bold uppercase tracking-[0.12em] text-ink transition-transform duration-200 hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
                      >
                        {sending ? "Sending…" : "Send brief →"}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              {phase === "sent" && (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="flex min-h-full flex-col items-center justify-center px-6 py-16 text-center"
                >
                  <p className={clsx(MONO_LABEL, "text-acid")}>
                    {"{ brief received }"}
                  </p>
                  <h3 className="mt-5 font-display text-5xl font-semibold tracking-tight md:text-7xl">
                    Talk soon.
                  </h3>
                  <p className="mt-5 max-w-md font-sans text-base text-paper/60">
                    Your brief is in our inbox. We usually reply within 48
                    hours.
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-10 rounded-xl border border-paper/25 px-6 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.08em] text-paper transition-colors hover:border-paper"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
