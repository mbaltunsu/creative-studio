export const MM = {
  desktop: "(min-width: 768px)",
  mobile: "(max-width: 767.98px)",
  motionOK: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;

export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
} as const;
