import type { ReactNode } from "react";
import clsx from "clsx";

/* Outline pill with a fill-wipe hover: accent layer sweeps up, text swaps color.
   hoverTextClassName must contrast with fillClassName (ink works on acid/coral/
   teal/paper fills; use paper on blue/violet fills). */
export function CtaPill({
  children,
  href = "#contact",
  className,
  fillClassName = "bg-acid",
  hoverTextClassName = "group-hover/pill:text-ink",
  arrow = true,
}: {
  children: ReactNode;
  href?: string;
  className?: string;
  fillClassName?: string;
  hoverTextClassName?: string;
  arrow?: boolean;
}) {
  return (
    <a
      href={href}
      className={clsx(
        "group/pill relative inline-flex items-center gap-[0.5em] overflow-hidden whitespace-nowrap rounded-full border border-current px-[1.2em] py-[0.55em]",
        className,
      )}
    >
      <span
        aria-hidden
        className={clsx(
          "absolute inset-0 translate-y-[101%] rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/pill:translate-y-0",
          fillClassName,
        )}
      />
      <span className={clsx("relative z-10 transition-colors duration-300", hoverTextClassName)}>
        {children}
      </span>
      {arrow && (
        <span
          aria-hidden
          className={clsx(
            "relative z-10 transition-[color,translate] duration-300 group-hover/pill:translate-x-1",
            hoverTextClassName,
          )}
        >
          →
        </span>
      )}
    </a>
  );
}
