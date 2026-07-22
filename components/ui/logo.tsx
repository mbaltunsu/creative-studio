import clsx from "clsx";

/* Pixel-squares mark from the navbar reference: scattered colored cells on a 3x3 grid. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 22 22"
      className={clsx("h-[22px] w-[22px]", className)}
      aria-hidden
    >
      <rect x="0" y="0" width="6" height="6" fill="#3b5bff" />
      <rect x="8" y="8" width="6" height="6" fill="#ff5a5f" />
      <rect x="16" y="8" width="6" height="6" fill="#f7f7f2" />
      <rect x="0" y="16" width="6" height="6" fill="#e8ff3d" />
      <rect x="16" y="16" width="6" height="6" fill="#9b5cff" />
    </svg>
  );
}
