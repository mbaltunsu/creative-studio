export const MOSAIC_IMAGE = "/images/mosaic-master.webp";
export const COLS = 5;
export const ROWS = 3;

/* Deterministic PRNG so scatter is identical on every render/refresh (hydration-safe). */
const mulberry32 = (a: number) => () =>
  ((a = (a + 0x6d2b79f5) | 0),
  (((Math.imul(a ^ (a >>> 15), 1 | a) + 0x6d2b79f5) >>> 0) / 4294967296));

const rand = mulberry32(7);

export interface TileScatter {
  dx: number; // fraction of frame width
  dy: number; // fraction of frame height
  rot: number;
  scale: number;
}

/* Each tile flies in from its own quadrant: offset pushed outward from frame center. */
export const SCATTER: TileScatter[] = Array.from({ length: COLS * ROWS }, (_, i) => {
  const cx = (i % COLS) / (COLS - 1) - 0.5;
  const cy = Math.floor(i / COLS) / (ROWS - 1) - 0.5;
  return {
    dx: cx * (1.3 + rand() * 0.9),
    dy: cy * (1.5 + rand() * 1.0) + (rand() - 0.5) * 0.35,
    rot: (rand() - 0.5) * 50,
    scale: 0.7 + rand() * 0.5,
  };
});
