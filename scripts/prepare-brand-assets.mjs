// Builds web-ready brand assets from the supplied raster logo.
//
// Source: assets/brand/clynera-logo-source.png (supplied by Clynera Tech, 1600x664, white background).
// Output:
//   public/brand/clynera-logo.png       full logo, transparent
//   public/brand/clynera-logo-light.png full logo for dark backgrounds
//   public/brand/clynera-mark-light.png symbol for dark backgrounds
//   public/brand/clynera-mark.png       symbol only, transparent
//   public/brand/clynera-wordmark.png   "clynera TECH LLC" only, transparent (header)
//   src/app/icon.png, apple-icon.png, favicon.ico, opengraph-image.png
//   src/content/mark-points.json        points sampled from the symbol (finale animation)
//
// Run: npm run brand:assets
// Replace with official vector files when the brand owner supplies them.

import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const source = path.join(root, "assets/brand/clynera-logo-source.png");
const brand = path.join(root, "public/brand");
const app = path.join(root, "src/app");

// Measured from the source: the symbol spans x 75..492, the wordmark x 541..1508, both y 118..533.
const MARK = { left: 60, top: 104, width: 448, height: 444 };
const WORD = { left: 528, top: 104, width: 996, height: 444 };
const PAPER = "#F2F1EC";
const ALPHA_FLOOR = 0.035;

/** Colour-to-alpha against white, preserving anti-aliased edges. */
async function transparent(region) {
  const { data, info } = await sharp(source).extract(region).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    let a = Math.max(1 - r, 1 - g, 1 - b);
    if (a < ALPHA_FLOOR) a = 0;
    if (a === 0) continue;
    const un = (c) => Math.min(1, Math.max(0, 1 - (1 - c) / a));
    rgba[j] = Math.round(un(r) * 255);
    rgba[j + 1] = Math.round(un(g) * 255);
    rgba[j + 2] = Math.round(un(b) * 255);
    rgba[j + 3] = Math.round(a * 255);
  }
  return sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).png();
}

/** Version for dark backgrounds: navy and grey become paper, teal stays teal. */
async function onDark(png) {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const paper = [242, 241, 236];
  for (let i = 0; i < data.length; i += 4) {
    if (!data[i + 3]) continue;
    const t = Math.min(1, Math.max(0, (data[i + 1] - data[i]) / 190)) ** 0.7;
    for (let c = 0; c < 3; c++) data[i + c] = Math.round(paper[c] * (1 - t) + data[i + c] * t);
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png({ compressionLevel: 9 }).toBuffer();
}

const trimmed = async (img) => sharp(await img.toBuffer()).trim({ threshold: 1 }).png().toBuffer();

/** Symbol on a rounded paper tile, for icons. */
async function tile(mark, size, padRatio, radiusRatio) {
  const pad = Math.round(size * padRatio);
  const inner = await sharp(mark).resize(size - pad * 2, size - pad * 2, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  const r = Math.round(size * radiusRatio);
  const base = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" fill="${PAPER}"/></svg>`);
  return sharp(base).composite([{ input: inner, left: pad, top: pad }]).png().toBuffer();
}

function ico(images) {
  const head = Buffer.alloc(6);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(images.length, 4);
  const dir = Buffer.alloc(16 * images.length);
  let offset = 6 + 16 * images.length;
  images.forEach(([size, buf], i) => {
    const o = i * 16;
    dir.writeUInt8(size, o);
    dir.writeUInt8(size, o + 1);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(buf.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += buf.length;
  });
  return Buffer.concat([head, dir, ...images.map((i) => i[1])]);
}

/** Points on the symbol, centred and scaled to -1..1, with a navy (0) to teal (1) tone. */
async function markPoints(markPng) {
  const { data, info } = await sharp(markPng).resize(220, null).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const pts = [];
  const step = 5;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const i = (y * width + x) * channels;
      if (data[i + 3] < 150) continue;
      const tone = Math.min(1, Math.max(0, (data[i + 1] - data[i]) / 190));
      const s = Math.max(width, height) / 2;
      pts.push([+((x - width / 2) / s).toFixed(3), +((y - height / 2) / s).toFixed(3), +tone.toFixed(2)]);
    }
  }
  return pts;
}

const full = await trimmed(await transparent({ left: 0, top: 0, width: 1600, height: 664 }));
const mark = await trimmed(await transparent(MARK));
const word = await trimmed(await transparent(WORD));

await sharp(full).resize(1200, null).png({ compressionLevel: 9 }).toFile(path.join(brand, "clynera-logo.png"));
await sharp(await onDark(await sharp(full).resize(1200, null).png().toBuffer())).toFile(path.join(brand, "clynera-logo-light.png"));
await sharp(await onDark(await sharp(mark).resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer())).toFile(path.join(brand, "clynera-mark-light.png"));
await sharp(mark).resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ compressionLevel: 9 }).toFile(path.join(brand, "clynera-mark.png"));
await sharp(word).resize(null, 120).png({ compressionLevel: 9 }).toFile(path.join(brand, "clynera-wordmark.png"));

await writeFile(path.join(app, "icon.png"), await tile(mark, 96, 0.08, 0.22));
await writeFile(path.join(app, "apple-icon.png"), await tile(mark, 180, 0.12, 0.2));
await writeFile(path.join(app, "favicon.ico"), ico([[16, await tile(mark, 16, 0.02, 0.2)], [32, await tile(mark, 32, 0.04, 0.2)], [48, await tile(mark, 48, 0.05, 0.2)]]));

// Open Graph: logo on paper with a few lattice lines drawn from the symbol's 45 degree geometry.
const og = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${PAPER}"/>
  <g fill="none" stroke="#08143C" stroke-opacity="0.08" stroke-width="2">
    ${Array.from({ length: 14 }, (_, i) => `<path d="M${-200 + i * 110} 630 L${430 + i * 110} 0"/><path d="M${-200 + i * 110} 0 L${430 + i * 110} 630"/>`).join("")}
  </g>
  <path d="M120 520 H1080" stroke="#0FB9A8" stroke-width="3"/>
</svg>`);
const ogLogo = await sharp(full).resize(860, null).toBuffer();
const ogMeta = await sharp(ogLogo).metadata();
await sharp(og)
  .composite([{ input: ogLogo, left: Math.round((1200 - 860) / 2), top: Math.round((560 - ogMeta.height) / 2) }])
  .png({ compressionLevel: 9 })
  .toFile(path.join(app, "opengraph-image.png"));

await writeFile(path.join(root, "src/content/mark-points.json"), JSON.stringify(await markPoints(mark)) + "\n");
console.log("brand assets written");
