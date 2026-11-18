"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useScrollProgress } from "@/lib/motion";
import { ChapterLabel, cx } from "./ui";

/**
 * STATE 03 DISCOVER. Most problems are tangled, not technical: nine parts of
 * a business pull apart as the visitor scrolls, then line up around the core.
 * Words sit at their connected positions in the HTML (the no-script and
 * reduced-motion state); scroll moves them away and back with transforms.
 */
const PARTS = ["Teams", "Data", "AI", "Code", "Cloud", "Process", "Security", "Talent", "Customers"] as const;

// Connected positions: a diamond around the core (x%, y%), desktop and phone.
const ring = (a: number, b: number, offset = 0) =>
  PARTS.map((_, i) => {
    const t = ((i + offset) / PARTS.length) * Math.PI * 2 - Math.PI / 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    const k = 1 / (Math.abs(c) / a + Math.abs(s) / b);
    return [50 + c * k, 50 + s * k] as [number, number];
  });
// Phones: hand-placed, so nine labels never collide on a narrow stage (order matches PARTS).
const NARROW: [number, number][] = [
  [50, 7],
  [80, 24],
  [82, 46],
  [80, 68],
  [64, 91],
  [36, 91],
  [20, 68],
  [18, 46],
  [20, 24],
];
const CONNECTED = { wide: ring(34, 38), narrow: NARROW };
// Phones scatter to their own spread-out targets (offsets from NARROW).
const SCATTER_NARROW: [number, number][] = [
  [18, 23],
  [-52, 28],
  [-8, 36],
  [-50, -56],
  [14, -33],
  [-14, -15],
  [38, -56],
  [22, 48],
  [40, 20],
];
// Where each part drifts when isolated (offsets in % of the stage).
const SCATTER: [number, number][] = [
  [-30, -6],
  [24, -22],
  [36, 4],
  [30, 26],
  [6, 34],
  [-22, 30],
  [-40, 12],
  [-34, -24],
  [12, -36],
];

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function SystemMap({ core }: { core: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const words = useRef<(HTMLLIElement | null)[]>([]);
  const lines = useRef<SVGSVGElement>(null);
  const first = useRef<HTMLHeadingElement>(null);
  const second = useRef<HTMLParagraphElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);
  const last = useRef(0);
  // Statements share one slot while animating; without script or with reduced motion they stack.
  const [stacked, setStacked] = useState(false);

  const apply = (p: number) => {
    last.current = p;
    const st = stage.current;
    if (!st) return;
    const w = st.clientWidth;
    const h = st.clientHeight;
    const narrow = w < 700;
    const pos = narrow ? CONNECTED.narrow : CONNECTED.wide;
    const apart = reduced.current ? 0 : smooth(0.1, 0.38, p);
    const back = reduced.current ? 1 : smooth(0.48, 0.76, p);
    words.current.forEach((el, i) => {
      if (!el) return;
      // Clustered at the centre -> scattered -> connected (offset 0).
      const [x, y] = pos[i];
      el.style.left = `${x}%`;
      el.style.top = `${y}%`;
      const clusterX = ((i % 3) - 1) * (narrow ? 30 : 12) + 50 - x;
      const clusterY = (Math.floor(i / 3) - 1) * (narrow ? 7 : 8) + 50 - y;
      const [sx, sy] = (narrow ? SCATTER_NARROW : SCATTER)[i];
      // Keep every whole label on stage while it drifts (clamped by its own size).
      const hw = el.offsetWidth / 2 + 6;
      const hh = el.offsetHeight / 2 + 6;
      const px = Math.min(w - hw, Math.max(hw, ((x + (clusterX * (1 - apart) + sx * apart) * (1 - back)) / 100) * w));
      const py = Math.min(h - hh, Math.max(hh, ((y + (clusterY * (1 - apart) + sy * apart) * (1 - back)) / 100) * h));
      el.style.transform = `translate3d(calc(-50% + ${(px - (x / 100) * w).toFixed(1)}px), calc(-50% + ${(py - (y / 100) * h).toFixed(1)}px), 0)`;
    });
    const draw = reduced.current ? 1 : smooth(0.56, 0.86, p);
    lines.current?.querySelectorAll("path").forEach((path, i) => {
      path.style.strokeDashoffset = String(1 - Math.min(1, Math.max(0, draw * 1.4 - (i % 9) * 0.05)));
    });
    if (coreRef.current) {
      const c = reduced.current ? 1 : smooth(0.5, 0.8, p);
      coreRef.current.style.opacity = String(c);
      coreRef.current.style.transform = `translate(-50%, -50%) scale(${(0.6 + 0.4 * c).toFixed(3)})`;
    }
    if (first.current && !reduced.current) {
      const out = smooth(0.66, 0.78, p);
      first.current.style.opacity = String(1 - out);
      first.current.style.transform = `translate3d(0, ${(-16 * out).toFixed(1)}px, 0)`;
    }
    if (second.current && !reduced.current) {
      const inn = smooth(0.76, 0.88, p);
      second.current.style.opacity = String(inn);
      second.current.style.transform = `translate3d(0, ${(16 * (1 - inn)).toFixed(1)}px, 0)`;
    }
  };

  useScrollProgress(track, apply);

  // Connectors depend on the stage size: one clean spoke from each part to the core.
  useEffect(() => {
    const st = stage.current;
    const svg = lines.current;
    if (!st || !svg) return;
    reduced.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced.current) requestAnimationFrame(() => setStacked(true));
    const layout = () => {
      const w = st.clientWidth;
      const h = st.clientHeight;
      const pos = (w < 700 ? CONNECTED.narrow : CONNECTED.wide).map(([x, y]) => [(x / 100) * w, (y / 100) * h]);
      const cx = w / 2;
      const cy = h / 2;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      svg.innerHTML = pos
        .map(
          ([x, y]) =>
            `<path d="M${x.toFixed(1)} ${y.toFixed(1)}L${cx.toFixed(1)} ${cy.toFixed(1)}" pathLength="1" fill="none" stroke="#14c9b5" stroke-opacity="0.75" stroke-width="1.5" stroke-dasharray="1" stroke-dashoffset="1" stroke-linecap="round" />`,
        )
        .join("");
      apply(last.current);
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(st);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={track} className="system-track relative h-[300vh] motion-reduce:h-auto">
      <div className="sticky top-0 flex h-svh min-h-[40rem] flex-col overflow-hidden motion-reduce:relative motion-reduce:h-auto">
        <div className="container-x relative z-10 pt-[calc(var(--header-h)+1.5rem)]">
          <ChapterLabel index="02" name="Untangle" />
          <div className="relative mt-5">
            <h2 ref={first} id="system-title" className="t-h2 max-w-[24ch] text-[clamp(1.9rem,3.4vw,3.5rem)] text-ink-950">
              Most problems aren&apos;t technical. <span className="text-ink-500">They&apos;re tangled.</span>
            </h2>
            <p ref={second} className={cx("t-h2 max-w-[24ch] text-[clamp(1.9rem,3.4vw,3.5rem)] text-ink-950", stacked ? "absolute inset-x-0 top-0 opacity-0" : "mt-4")}>
              Untangle the parts and the <span className="text-signal-700">path appears.</span>
            </p>
          </div>
        </div>

        <div ref={stage} className="relative my-4 min-h-[24rem] flex-1 motion-reduce:h-[70svh]">
          <svg ref={lines} aria-hidden="true" className="absolute inset-0 size-full" />
          <div ref={coreRef} aria-hidden="true" className="absolute top-1/2 left-1/2 w-[min(26vw,30svh,20rem)] max-md:w-[min(34vw,24svh)]" style={{ transform: "translate(-50%, -50%)" }}>
            <div className="overflow-hidden [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)]">{core}</div>
          </div>
          <ul aria-label="Parts of the system" className="absolute inset-0">
            {PARTS.map((part, i) => {
              const [x, y] = CONNECTED.wide[i];
              return (
                <li
                  key={part}
                  ref={(el) => {
                    words.current[i] = el;
                  }}
                  className={cx(
                    "t-label absolute flex items-center gap-2 rounded-full border border-ink-200 bg-chalk px-4 py-2.5 text-[0.82rem] text-ink-900 shadow-[0_10px_30px_-18px_rgb(7_17_47/0.4)] will-change-transform max-sm:px-3 max-sm:py-2 max-sm:text-[0.7rem]",
                    part === "Customers" && "border-ink-950 bg-ink-950 text-paper",
                  )}
                  style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                >
                  <span aria-hidden="true" className="node" />
                  {part}
                </li>
              );
            })}
          </ul>
        </div>

      </div>
    </div>
  );
}
