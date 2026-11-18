// Imports generated images into their website slots.
//
// Usage: npm run media:import -- "<inbox folder>"
//
// Each file in the inbox is matched to a slot in src/content/visuals.ts by its
// name without extension (for example hero-system-desktop.png fills the
// "hero-system-desktop.webp" slot). Output: public/images/<folder>/<file>.webp,
// at most 2800px wide (3600px for 21:3 bands), metadata stripped. Files that
// match no slot are listed and skipped.

import sharp from "sharp";
import { mkdir, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const inbox = process.argv[2];
if (!inbox) {
  console.error('Usage: npm run media:import -- "<folder>"');
  process.exit(1);
}

const manifest = await readFile(path.join(root, "src/content/visuals.ts"), "utf8");
const slots = [...manifest.matchAll(/slot\("([\w-]+)\.webp", "(\w+)", \[(\d+), (\d+)\]/g)].map((m) => ({ base: m[1], folder: m[2], ratio: [Number(m[3]), Number(m[4])] }));
const files = (await readdir(inbox)).filter((f) => /\.(png|jpe?g|webp|avif)$/i.test(f));

let imported = 0;
for (const file of files) {
  const base = path.parse(file).name.toLowerCase();
  const slot = slots.find((s) => s.base === base);
  if (!slot) {
    console.log(`  skipped  ${file} (no slot named ${base})`);
    continue;
  }
  const maxWidth = slot.ratio[0] / slot.ratio[1] >= 5 ? 3600 : 2800;
  const img = sharp(path.join(inbox, file)).rotate();
  const meta = await img.metadata();
  const outDir = path.join(root, "public/images", slot.folder);
  await mkdir(outDir, { recursive: true });
  await img
    .resize({ width: Math.min(maxWidth, meta.width ?? maxWidth), withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(path.join(outDir, `${slot.base}.webp`));
  const actual = (meta.width ?? 0) / (meta.height ?? 1);
  const wanted = slot.ratio[0] / slot.ratio[1];
  const note = Math.abs(actual - wanted) / wanted > 0.08 ? ` (ratio ${actual.toFixed(2)}, slot expects ${slot.ratio.join(":")}; it will be cropped)` : "";
  console.log(`  imported ${slot.folder}/${slot.base}.webp${note}`);
  imported++;
}
console.log(`${imported} image(s) imported; ${slots.length} slots in total.`);
