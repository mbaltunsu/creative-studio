import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";

/* Pure-CSS infinite marquee: two identical copies + translateX(-50%) keyframe.
   Spacing must come from item padding, never flex gap (breaks the -50% loop). */
export function Marquee({
  children,
  duration = 40,
  className,
  pauseOnHover = true,
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
  pauseOnHover?: boolean;
}) {
  return (
    <div
      className={clsx(
        "overflow-clip motion-reduce:overflow-x-auto",
        pauseOnHover && "group",
        className,
      )}
      style={{ "--duration": `${duration}s` } as CSSProperties}
    >
      <div
        className={clsx(
          "flex w-max animate-marquee motion-reduce:animate-none",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
