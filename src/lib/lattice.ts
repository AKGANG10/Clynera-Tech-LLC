/**
 * The Clynera lattice: geometry taken from the logo's symbol.
 *
 * The symbol is a maze of paths that only run at 45 degrees and turn at right
 * angles, nested as diamonds around a small square core, with dots where paths
 * end and one arrow breaking out. In lattice coordinates (u, v) those paths are
 * axis-aligned and the diamond silhouette is a square |u|, |v| <= R, so the
 * whole visual language reduces to a square grid rotated 45 degrees.
 *
 * Pure functions only: shared by server-rendered SVG and client canvases.
 */

export type UV = [number, number];
export type Path = { points: UV[]; layer: 0 | 1 | 2; end: boolean };

/** Deterministic PRNG, so server and client draw the same structure. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const SQ = Math.SQRT1_2;

/** Lattice point to screen: rotate 45 degrees and scale by `s` (one lattice step). */
export const toXY = ([u, v]: UV, s: number, cx = 0, cy = 0): [number, number] => [cx + (u - v) * s * SQ, cy + (u + v) * s * SQ];

const DIRS: UV[] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

/**
 * Nested diamond rings with gaps, like the logo's maze. Each ring is a square
 * loop in (u, v) broken by one or two openings and joined to the next ring by
 * a short spoke.
 */
export function rings(radii: number[], seed = 7): UV[][] {
  const r = rng(seed);
  const out: UV[][] = [];
  for (const R of radii) {
    const corners: UV[] = [
      [-R, -R],
      [R, -R],
      [R, R],
      [-R, R],
    ];
    // Walk the perimeter as unit steps so a gap can open anywhere.
    const loop: UV[] = [];
    for (let i = 0; i < 4; i++) {
      const [a, b] = [corners[i], corners[(i + 1) % 4]];
      const steps = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]));
      for (let k = 0; k < steps; k++) loop.push([a[0] + ((b[0] - a[0]) / steps) * k, a[1] + ((b[1] - a[1]) / steps) * k]);
    }
    const n = loop.length;
    const gap = Math.max(1, Math.round(R * 0.45));
    const start = Math.floor(r() * n);
    // One long run from the end of the gap back round to its start.
    const run: UV[] = [];
    for (let k = gap; k <= n; k++) run.push(loop[(start + k) % n]);
    out.push(simplify(run));
  }
  return out;
}

/** Drop collinear points so paths draw with clean corners. */
export function simplify(points: UV[]): UV[] {
  if (points.length < 3) return points;
  const out: UV[] = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const [a, b, c] = [out[out.length - 1], points[i], points[i + 1]];
    const d1 = [Math.sign(b[0] - a[0]), Math.sign(b[1] - a[1])];
    const d2 = [Math.sign(c[0] - b[0]), Math.sign(c[1] - b[1])];
    if (d1[0] !== d2[0] || d1[1] !== d2[1]) out.push(b);
  }
  out.push(points[points.length - 1]);
  return out;
}

/**
 * Walkers: paths that wander the lattice inside |u|,|v| <= bound, turning 90
 * degrees between runs and never reusing an edge. Layer 0 is far, 2 is near.
 */
export function walkers({
  seed,
  count,
  bound,
  runs = [3, 7],
  run = [1, 4],
  origin,
}: {
  seed: number;
  count: number;
  bound: number;
  runs?: [number, number];
  run?: [number, number];
  origin?: (r: () => number) => UV;
}): Path[] {
  const r = rng(seed);
  const used = new Set<string>();
  const edge = (a: UV, b: UV) => (a[0] < b[0] || a[1] < b[1] ? `${a}|${b}` : `${b}|${a}`);
  const between = (min: number, max: number) => min + Math.floor(r() * (max - min + 1));
  const paths: Path[] = [];
  for (let i = 0; i < count; i++) {
    let p: UV = origin ? origin(r) : [between(-bound, bound), between(-bound, bound)];
    const points: UV[] = [p];
    let dir = Math.floor(r() * 4);
    const total = between(runs[0], runs[1]);
    for (let j = 0; j < total; j++) {
      const len = between(run[0], run[1]);
      let moved = 0;
      for (let k = 0; k < len; k++) {
        const next: UV = [p[0] + DIRS[dir][0], p[1] + DIRS[dir][1]];
        if (Math.abs(next[0]) > bound || Math.abs(next[1]) > bound || used.has(edge(p, next))) break;
        used.add(edge(p, next));
        p = next;
        moved++;
      }
      if (moved) points.push(p);
      dir = (dir + (r() < 0.5 ? 1 : 3)) % 4;
    }
    if (points.length > 1) paths.push({ points: simplify(points), layer: (i % 3) as 0 | 1 | 2, end: r() < 0.55 });
  }
  return paths;
}

/** Total length of a path in lattice steps. */
export const pathLength = (pts: UV[]) => pts.slice(1).reduce((n, p, i) => n + Math.abs(p[0] - pts[i][0]) + Math.abs(p[1] - pts[i][1]), 0);

/** SVG path data for lattice points. */
export const svgPath = (pts: UV[], s: number, cx = 0, cy = 0) =>
  pts
    .map((p, i) => {
      const [x, y] = toXY(p, s, cx, cy);
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join("");

/**
 * Path between two screen points using only 45 degree segments: an L in
 * lattice space. Used to connect labels and nodes in the logo's language.
 */
export function diagonalPath(ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const a = (dx + dy) / 2;
  return `M${ax.toFixed(1)} ${ay.toFixed(1)}L${(ax + a).toFixed(1)} ${(ay + a).toFixed(1)}L${bx.toFixed(1)} ${by.toFixed(1)}`;
}
