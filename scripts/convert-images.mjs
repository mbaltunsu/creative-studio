/* Converts codex-generated PNGs (public/images/_raw) to webp assets:
   - rock-* frames → public/frames/reel/frame_NNN.webp (1600w draw size)
   - everything else → public/images/<name>.webp (mosaic capped at 1920w)
   Idempotent: skips outputs that already exist. */
import sharp from "sharp";
import { readdirSync, mkdirSync, existsSync } from "fs";

const RAW = "public/images/_raw";
mkdirSync("public/frames/reel", { recursive: true });

const rockMap = { "rock-master": 0, "rock-f1": 1, "rock-f2": 2, "rock-f3": 3 };

for (const f of readdirSync(RAW).filter((f) => f.endsWith(".png"))) {
  const name = f.slice(0, -4);
  const src = `${RAW}/${f}`;
  let out;
  let pipeline = sharp(src);
  if (name in rockMap) {
    out = `public/frames/reel/frame_${String(rockMap[name]).padStart(3, "0")}.webp`;
    pipeline = pipeline.resize({ width: 1600 }).webp({ quality: 80 });
  } else {
    out = `public/images/${name}.webp`;
    if (name === "mosaic-master") pipeline = pipeline.resize({ width: 1920 });
    pipeline = pipeline.webp({ quality: 82 });
  }
  if (existsSync(out)) continue;
  await pipeline.toFile(out);
  console.log("converted:", name, "→", out);
}
