import { pathLength, rings, rng, SQ, walkers, type UV } from "@/lib/lattice";

/**
 * Canvas renderer for the hero system (THE CORE).
 *
 * States: dormant (three points and a faint core) -> awake (the maze grows
 * outward from the core, the arrow breaks out) -> live (pulses travel, the
 * pointer lights up nearby paths and reveals hidden words, scroll separates
 * the layers). Everything is drawn from lattice geometry shared with the rest
 * of the site. No dependencies; the caller owns the animation loop's lifetime.
 */

type Stroke = { pts: [number, number][]; len: number; delay: number; layer: 0 | 1 | 2; ring: boolean; end: boolean };
type Label = { x: number; y: number; text: string };

const WORDS = ["signal", "model", "talent", "deploy", "data", "people", "decision", "cloud", "design", "security"];

export type EngineInput = { pointerX: number; pointerY: number; pointerActive: boolean; scroll: number };

export class LatticeEngine {
  private ctx: CanvasRenderingContext2D;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private unit = 24;
  private cx = 0;
  private cy = 0;
  private bound = 8;
  private strokes: Stroke[] = [];
  private labels: Label[] = [];
  private pulses: { s: number; t: number; speed: number }[] = [];
  private wakeAt = -1;
  private smooth = { x: 0, y: 0, a: 0 };
  private font = "system-ui, sans-serif";

  constructor(
    private canvas: HTMLCanvasElement,
    private opts: { mobile: boolean; quiet: boolean },
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no 2d context");
    this.ctx = ctx;
    // Canvas cannot resolve CSS variables, so read the loaded family once.
    this.font = getComputedStyle(document.body).fontFamily || this.font;
  }

  resize(width: number, height: number, mobile: boolean) {
    this.opts.mobile = mobile;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.w = width;
    this.h = height;
    this.canvas.width = Math.round(width * this.dpr);
    this.canvas.height = Math.round(height * this.dpr);
    this.unit = Math.max(15, Math.min(30, width / (mobile ? 22 : 54)));
    this.cx = mobile ? width * 0.5 : width * 0.7;
    this.cy = mobile ? height * 0.74 : height * 0.52;
    const room = mobile ? Math.min(width * 0.44, height * 0.24) : Math.min(height * 0.4, width * 0.25);
    this.bound = Math.max(4, Math.floor(room / (this.unit * SQ)));
    this.build();
  }

  private toXY([u, v]: UV, scale = 1): [number, number] {
    return [(u - v) * this.unit * SQ * scale, (u + v) * this.unit * SQ * scale];
  }

  private build() {
    const B = this.bound;
    const strokes: Stroke[] = [];
    const add = (pts: UV[], layer: 0 | 1 | 2, ring: boolean, end: boolean, scale = 1) => {
      const xy = pts.map((p) => this.toXY(p, scale));
      const mid = pts.reduce((m, p) => Math.max(m, Math.abs(p[0]), Math.abs(p[1])), 0) / (B * scale);
      strokes.push({ pts: xy, len: pathLength(pts) * this.unit * scale, delay: Math.min(0.62, mid * 0.5 + (layer === 0 ? 0.12 : 0)), layer, ring, end });
    };
    const radii: number[] = [];
    for (let r = 2; r < B; r += 2) radii.push(r);
    rings(radii, 5).forEach((p) => add(p, 2, true, false));
    const n = this.opts.mobile ? 0.55 : 1;
    walkers({ seed: 21, count: Math.round(60 * n), bound: B, runs: [2, 6], run: [1, 3] }).forEach((p) => add(p.points, 2, false, p.end));
    walkers({ seed: 33, count: Math.round(50 * n), bound: Math.round(B * 1.35), runs: [2, 5], run: [1, 4] }).forEach((p) => add(p.points, 1, false, p.end));
    walkers({ seed: 47, count: Math.round(70 * n), bound: Math.round(B * 2.2), runs: [2, 5], run: [1, 5] }).forEach((p) => add(p.points, 0, false, false, 1.25));
    this.strokes = strokes;

    const r = rng(9);
    const ends = strokes.filter((s) => s.layer === 2 && s.end);
    this.labels = WORDS.slice(0, this.opts.mobile ? 5 : WORDS.length).map((text, i) => {
      const s = ends[Math.floor((i / WORDS.length) * ends.length + r() * 2) % Math.max(1, ends.length)];
      const [x, y] = s ? s.pts[s.pts.length - 1] : [0, 0];
      return { x, y, text };
    });
    const front = strokes.map((s, i) => (s.layer === 2 && !s.ring ? i : -1)).filter((i) => i >= 0);
    this.pulses = Array.from({ length: this.opts.mobile ? 8 : 16 }, (_, i) => ({ s: front[(i * 7) % Math.max(1, front.length)], t: r(), speed: 0.12 + r() * 0.18 }));
  }

  wake(now: number) {
    if (this.wakeAt < 0) this.wakeAt = now;
  }

  get awake() {
    return this.wakeAt >= 0;
  }

  /** Draw one frame. Returns false when nothing will change until input changes. */
  frame(now: number, input: EngineInput, still = false): boolean {
    const { ctx, w, h } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const grow = still ? 1 : this.wakeAt < 0 ? 0 : Math.min(1, (now - this.wakeAt) / 2400);
    const k = 0.06;
    this.smooth.x += (input.pointerX - this.smooth.x) * k;
    this.smooth.y += (input.pointerY - this.smooth.y) * k;
    this.smooth.a += ((input.pointerActive ? 1 : 0) - this.smooth.a) * 0.08;
    const px = still ? 0 : this.smooth.x;
    const py = still ? 0 : this.smooth.y;
    const sc = still ? 0 : input.scroll;

    // Layer transforms: parallax with the pointer, separation with scroll.
    const layerT = [
      { dx: px * 8, dy: py * 6 - sc * 30, s: 1 + sc * 0.04 },
      { dx: px * 18, dy: py * 12 + sc * 10, s: 1 + sc * 0.12 },
      { dx: px * 30, dy: py * 20 + sc * 70, s: 1 + sc * 0.26 },
    ];

    if (grow === 0) {
      this.drawDormant(now);
      return true;
    }

    for (const layer of [0, 1, 2] as const) {
      const t = layerT[layer];
      ctx.save();
      ctx.translate(this.cx + t.dx, this.cy + t.dy);
      ctx.scale(t.s, t.s);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const s of this.strokes) {
        if (s.layer !== layer) continue;
        const p = Math.min(1, Math.max(0, (grow - s.delay) / 0.38));
        if (p <= 0) continue;
        if (layer === 0) {
          ctx.strokeStyle = "rgba(174,182,206,0.11)";
          ctx.lineWidth = 1;
        } else if (layer === 1) {
          ctx.strokeStyle = "rgba(74,154,192,0.32)";
          ctx.lineWidth = 1.2;
        } else if (s.ring) {
          ctx.strokeStyle = this.opts.quiet ? "rgba(44,123,168,0.55)" : "rgba(44,123,168,0.9)";
          ctx.lineWidth = this.unit * 0.34;
        } else {
          ctx.strokeStyle = this.opts.quiet ? "rgba(211,215,227,0.4)" : "rgba(211,215,227,0.7)";
          ctx.lineWidth = 1.6;
        }
        this.stroke(s, p);
        if (layer === 2 && s.end && p >= 1) {
          const [x, y] = s.pts[s.pts.length - 1];
          ctx.fillStyle = "#3fe0cc";
          ctx.fillRect(x - 2.5, y - 2.5, 5, 5);
        }
      }

      if (layer === 2) {
        this.drawCore(now, grow);
        this.drawArrow(grow);
        // The pointer's lens: nearby paths light up and hidden words appear.
        if (this.smooth.a > 0.02 && !still) {
          const lx = ((input.pointerX + 1) / 2) * w - this.cx - t.dx;
          const ly = ((input.pointerY + 1) / 2) * h - this.cy - t.dy;
          ctx.save();
          ctx.beginPath();
          ctx.arc(lx / t.s, ly / t.s, 150, 0, Math.PI * 2);
          ctx.clip();
          ctx.globalAlpha = this.smooth.a;
          ctx.strokeStyle = "#3fe0cc";
          ctx.lineWidth = 2;
          for (const s of this.strokes) if (s.layer === 2 && !s.ring) this.stroke(s, 1);
          ctx.restore();
          ctx.font = `600 11px ${this.font}`;
          ctx.textBaseline = "middle";
          for (const l of this.labels) {
            const d = Math.hypot(l.x * t.s - lx, l.y * t.s - ly);
            const a = Math.max(0, 1 - d / 170) * this.smooth.a;
            if (a <= 0.01) continue;
            ctx.fillStyle = `rgba(63,224,204,${a.toFixed(3)})`;
            ctx.fillText(l.text.toUpperCase(), l.x + 9, l.y - 9);
          }
        }
        if (!still && grow >= 1) this.drawPulses(now);
      }
      ctx.restore();
    }
    return !still;
  }

  private stroke(s: Stroke, p: number) {
    const { ctx } = this;
    let left = s.len * p;
    ctx.beginPath();
    ctx.moveTo(s.pts[0][0], s.pts[0][1]);
    for (let i = 1; i < s.pts.length && left > 0; i++) {
      const [ax, ay] = s.pts[i - 1];
      const [bx, by] = s.pts[i];
      const seg = Math.hypot(bx - ax, by - ay);
      if (seg <= left) {
        ctx.lineTo(bx, by);
        left -= seg;
      } else {
        const f = left / seg;
        ctx.lineTo(ax + (bx - ax) * f, ay + (by - ay) * f);
        left = 0;
      }
    }
    ctx.stroke();
  }

  private drawCore(now: number, grow: number) {
    const { ctx } = this;
    const s = this.unit * 0.55;
    const breathe = 1 + Math.sin(now / 900) * 0.06;
    ctx.save();
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = `rgba(20,201,181,${(0.35 + 0.65 * grow).toFixed(3)})`;
    ctx.fillRect((-s / 2) * breathe, (-s / 2) * breathe, s * breathe, s * breathe);
    ctx.restore();
  }

  /** The logo's arrow: from the core, up and to the right, out of the diamond. */
  private drawArrow(grow: number) {
    const p = Math.min(1, Math.max(0, (grow - 0.7) / 0.3));
    if (p <= 0) return;
    const { ctx } = this;
    const L = (this.bound + 3) * this.unit * p;
    const x = L * SQ;
    const y = -L * SQ;
    ctx.strokeStyle = "#14c9b5";
    ctx.lineWidth = this.unit * 0.34;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(x, y);
    ctx.stroke();
    if (p >= 1) {
      const a = this.unit * 1.1;
      ctx.beginPath();
      ctx.moveTo(x - a, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + a);
      ctx.stroke();
    }
  }

  private drawPulses(now: number) {
    const { ctx } = this;
    ctx.fillStyle = "#3fe0cc";
    for (const pulse of this.pulses) {
      const s = this.strokes[pulse.s];
      if (!s) continue;
      const t = (pulse.t + (now / 1000) * pulse.speed) % 1;
      let left = s.len * t;
      for (let i = 1; i < s.pts.length; i++) {
        const [ax, ay] = s.pts[i - 1];
        const [bx, by] = s.pts[i];
        const seg = Math.hypot(bx - ax, by - ay);
        if (seg >= left) {
          const f = left / seg;
          ctx.beginPath();
          ctx.arc(ax + (bx - ax) * f, ay + (by - ay) * f, 2.6, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        left -= seg;
      }
    }
  }

  /** Almost nothing: three points slowly finding each other around a faint core. */
  private drawDormant(now: number) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(this.w / 2, this.h * 0.5);
    const t = now / 1000;
    const seeds: [number, number][] = [
      [-1, -3],
      [3, 1],
      [-2, 2],
    ];
    ctx.lineCap = "round";
    seeds.forEach(([u, v], i) => {
      const [x, y] = this.toXY([u * 3, v * 3]);
      const a = 0.35 + 0.35 * Math.sin(t * 1.4 + i * 2);
      ctx.fillStyle = `rgba(63,224,204,${a.toFixed(3)})`;
      ctx.fillRect(x - 2.5, y - 2.5, 5, 5);
      // A short stub reaching toward the centre.
      const reach = 0.35 + 0.25 * Math.sin(t * 0.7 + i);
      ctx.strokeStyle = "rgba(174,182,206,0.22)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      const [ux, vy] = this.toXY([u * 3 * (1 - reach), v * 3]);
      ctx.lineTo(ux, vy);
      ctx.stroke();
    });
    ctx.restore();
  }
}
