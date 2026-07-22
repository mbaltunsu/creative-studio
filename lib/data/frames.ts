/* "In 14 days, we…" scroll-scrubbed sequence.
   Scaling to real AI-generated frames later = drop files in /public/frames/reel/
   with the same naming and bump `count`. */
export const REEL_FRAMES = {
  count: 4,
  url: (i: number) => `/frames/reel/frame_${String(i).padStart(3, "0")}.webp`,
};
