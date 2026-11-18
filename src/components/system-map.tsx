"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { diagonalPath } from "@/lib/lattice";
import { useScrollProgress } from "@/lib/motion";
import { ChapterLabel, cx } from "./ui";

/**
 * STATE 03 DISCOVER. Technology does not exist in isolation: nine parts of a
 * business pull apart as the visitor scrolls, then reconnect around the core.
 * Words sit at their connected positions in the HTML (the no-script and
 * reduced-motion state); scroll moves them away and back with transforms.
 */
const PARTS = ["People", "Data", "AI", "Software", "Cloud", "Design", "Strategy", "Talent", "Business"] as const;

// Connected positions: a diamond around the core (x%, y%), desktop and phone.
const ring = (a: number, b: number) =>
  PARTS.map((_, i) => {
    const t = (i / PARTS.length) * Math.PI * 2 - Math.PI / 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    const k = 1 / (Math.abs(c) / a + Math.abs(s) / b);
    return [50 + c * k, 50 + s * k] as [number, number];
  });
const CONNECTED = { wide: ring(34, 38), narrow: ring(38, 30) };
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
      const clusterX = ((i % 3) - 1) * (narrow ? 22 : 12) + 50 - x;
      const clusterY = (Math.floor(i / 3) - 1) * (narrow ? 7 : 8) + 50 - y;
      const [sx, sy] = SCATTER[i];
      // Keep every word on stage while it drifts.
      const ox = Math.min(92 - x, Math.max(8 - x, (clusterX * (1 - apart) + sx * apart) * (1 - back)));
      const oy = Math.min(92 - y, Math.max(8 - y, (clusterY * (1 - apart) + sy * apart) * (1 - back)));
      el.style.transform = `translate3d(calc(-50% + ${((ox / 100) * w).toFixed(1)}px), calc(-50% + ${((oy / 100) * h).toFixed(1)}px), 0)`;
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
    if (first.current) first.current.style.opacity = reduced.current ? "1" : String(1 - smooth(0.7, 0.84, p) * 0.85);
    if (second.current) second.current.style.opacity = reduced.current ? "1" : String(smooth(0.78, 0.92, p));
  };

  useScrollProgress(track, apply);

  // Connector geometry depends on the stage size: 45 degree paths, word to core and word to word.
  useEffect(() => {
    const st = stage.current;
    const svg = lines.current;
    if (!st || !svg) return;
    reduced.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const layout = () => {
      const w = st.clientWidth;
      const h = st.clientHeight;
      const pos = (w < 700 ? CONNECTED.narrow : CONNECTED.wide).map(([x, y]) => [(x / 100) * w, (y / 100) * h]);
      const cx = w / 2;
      const cy = h / 2;
      const d = [
        ...pos.map(([x, y]) => diagonalPath(x, y, cx, cy)),
        ...pos.map(([x, y], i) => {
          const [nx, ny] = pos[(i + 1) % pos.length];
          return diagonalPath(x, y, nx, ny);
        }),
      ];
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      svg.innerHTML = d
        .map(
          (p, i) =>
            `<path d="${p}" pathLength="1" fill="none" stroke="${i < pos.length ? "#14c9b5" : "#26346a"}" stroke-opacity="${i < pos.length ? 0.9 : 0.35}" stroke-width="${i < pos.length ? 1.6 : 1}" stroke-dasharray="1" stroke-dashoffset="1" stroke-linecap="round" />`,
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
        <div className="container-x relative z-10 pt-[calc(var(--header-h)+2rem)]">
          <ChapterLabel index="02" name="System" />
          <h2 ref={first} id="system-title" className="t-h2 mt-6 max-w-[14ch] text-ink-950">
            Technology doesn&apos;t exist in isolation.
          </h2>
        </div>

        <div ref={stage} className="relative min-h-[26rem] flex-1 motion-reduce:h-[70svh]">
          <div ref={coreRef} aria-hidden="true" className="absolute top-1/2 left-1/2 w-[min(30vw,32svh,22rem)] max-md:w-[min(46vw,28svh)]" style={{ transform: "translate(-50%, -50%)" }}>
            <div className="overflow-hidden [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)]">{core}</div>
          </div>
          <svg ref={lines} aria-hidden="true" className="absolute inset-0 size-full" />
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
                    part === "Business" && "border-ink-950 bg-ink-950 text-paper",
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

        <div className="container-x relative z-10 flex justify-end pb-[max(2.5rem,6svh)]">
          <p ref={second} className="t-h2 max-w-[15ch] text-right text-ink-950">
            The value is in the <span className="text-signal-700">connection.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
