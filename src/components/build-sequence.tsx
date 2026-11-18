"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { buildStages } from "@/content/capabilities";
import { rings, svgPath } from "@/lib/lattice";
import { useScrollProgress } from "@/lib/motion";
import { ChapterLabel, cx } from "./ui";

/**
 * STATE 05 BUILD. One object, seven states. As the visitor scrolls, a single
 * point gains structure, surface, paths, signals and scale, until the arrow
 * breaks out: the object being built is the Clynera mark. Each stage's
 * progress is a CSS variable (--s1 ... --s7) so one style write per frame
 * drives every layer.
 */
const N = buildStages.length;
const U = 19;
const C = 200;

export function BuildSequence({ headingId = "build-title" }: { headingId?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const obj = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  const grad = `bt${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  const geometry = useMemo(() => {
    const grid: string[] = [];
    for (let k = -7; k <= 7; k++) {
      grid.push(svgPath([[k, -7], [k, 7]], U, C, C));
      grid.push(svgPath([[-7, k], [7, k]], U, C, C));
    }
    return { grid, rings: rings([2, 4, 6], 3).map((r) => svgPath(r, U, C, C)) };
  }, []);

  useScrollProgress(track, (p) => {
    const el = obj.current;
    if (!el || reduced) return;
    for (let i = 0; i < N; i++) {
      const local = Math.min(1, Math.max(0, p * N - i + 0.35));
      el.style.setProperty(`--s${i + 1}`, local.toFixed(3));
    }
    const next = Math.min(N - 1, Math.floor(p * N));
    setActive((a) => (a === next ? a : next));
  });

  useEffect(() => {
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    requestAnimationFrame(() => {
      setReduced(true);
      setActive(N - 1);
      for (let i = 1; i <= N; i++) obj.current?.style.setProperty(`--s${i}`, "1");
    });
  }, []);

  const v = (i: number) => `var(--s${i}, 0)`;

  return (
    <div ref={track} className={cx("relative", reduced ? "" : "h-[460vh]")}>
      <div className={cx("flex flex-col overflow-hidden", reduced ? "py-24" : "sticky top-0 h-svh min-h-[40rem]")}>
        <div className="container-x pt-[calc(var(--header-h)+2rem)]">
          <ChapterLabel index="04" name="Blueprint" tone="dark" />
          <h2 id={headingId} className="t-h2 mt-6 max-w-[18ch] text-paper">
            From first question to running system.
          </h2>
        </div>

        <div className="container-x grid flex-1 items-center gap-8 py-6 lg:grid-cols-12">
          <div className="relative mx-auto aspect-square w-full max-w-[min(34rem,46svh)] lg:col-span-7 lg:max-w-[min(38rem,62svh)]">
            <svg ref={obj} viewBox="0 0 400 400" aria-hidden="true" className="absolute inset-0 size-full overflow-visible" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id={grad} x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="#2c7ba8" />
                  <stop offset="1" stopColor="#14c9b5" />
                </linearGradient>
              </defs>
              {/* 6 Deployment: the system scales out into instances. */}
              {[-1, 1].map((d) => (
                <g key={d} style={{ opacity: `calc(${v(6)} * 0.28)`, transform: `translate(calc(${v(6)} * ${d * 46}px), calc(${v(6)} * ${-d * 30}px)) scale(calc(1 - ${v(6)} * 0.12))`, transformOrigin: "200px 200px" }}>
                  {geometry.rings.map((d2, i) => (
                    <path key={i} d={d2} stroke="#aeb6ce" strokeWidth="6" />
                  ))}
                </g>
              ))}
              {/* 2 Architecture: the lattice and the boundary. */}
              <g style={{ opacity: v(2) }}>
                {geometry.grid.map((d, i) => (
                  <path key={i} d={d} stroke="#aeb6ce" strokeOpacity="0.12" />
                ))}
                <path d={svgPath([[-7, -7], [7, -7], [7, 7], [-7, 7], [-7, -7]], U, C, C)} stroke="#aeb6ce" strokeOpacity="0.5" strokeDasharray="4 6" />
              </g>
              {/* 3 Design: surfaces. */}
              <g style={{ opacity: `calc(${v(3)} * 0.9)` }}>
                <path d={svgPath([[-6, -6], [0, -6], [0, 0], [-6, 0]], U, C, C)} fill="#13225a" />
                <path d={svgPath([[0, -6], [6, -6], [6, 0], [0, 0]], U, C, C)} fill="#1c5f8c" fillOpacity="0.6" />
                <path d={svgPath([[0, 0], [6, 0], [6, 6], [0, 6]], U, C, C)} fill="#0b8f83" fillOpacity="0.35" />
                <path d={svgPath([[-6, 0], [0, 0], [0, 6], [-6, 6]], U, C, C)} fill="#26346a" fillOpacity="0.7" />
              </g>
              {/* 4 Engineering: the maze paths are built. */}
              {geometry.rings.map((d, i) => (
                <path key={i} d={d} pathLength="1" stroke={`url(#${grad})`} strokeWidth="9" strokeDasharray="1" style={{ strokeDashoffset: `calc(1 - ${v(4)})` }} />
              ))}
              {/* 5 Intelligence: signals move. */}
              <g style={{ opacity: v(5) }}>
                {geometry.rings.map((d, i) => (
                  <circle key={i} r="5" fill="#3fe0cc" className="motion-only">
                    <animateMotion dur={`${4 + i * 1.5}s`} repeatCount="indefinite" path={d} />
                  </circle>
                ))}
                {[
                  [70, 300],
                  [96, 326],
                  [52, 340],
                ].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="6" fill="#aeb6ce" />
                ))}
              </g>
              {/* 1 Idea: the point. */}
              <circle cx={C} cy={C} r="26" stroke="#3fe0cc" strokeOpacity="0.4" style={{ opacity: `calc(1 - ${v(2)} * 0.8)` }} />
              <rect x={C - 9} y={C - 9} width="18" height="18" fill="#14c9b5" transform={`rotate(45 ${C} ${C})`} />
              {/* 7 Impact: the arrow breaks out. */}
              <path d="M200 200L352 48" pathLength="1" stroke="#14c9b5" strokeWidth="10" strokeDasharray="1" style={{ strokeDashoffset: `calc(1 - ${v(7)})` }} />
              <path d="M318 48H352V82" stroke="#14c9b5" strokeWidth="10" style={{ opacity: `clamp(0, calc((${v(7)} - 0.85) * 8), 1)` }} />
            </svg>
          </div>

          <ol className="lg:col-span-5">
            {buildStages.map((s, i) => {
              const on = i === active;
              const passed = i < active;
              return (
                <li
                  key={s.id}
                  aria-current={on && !reduced ? "step" : undefined}
                  className={cx("border-t border-ink-800 py-3 transition-colors duration-[var(--dur-component)] max-lg:py-2", !on && !reduced && "max-lg:sr-only")}
                >
                  <p className={cx("t-label flex items-center gap-4 text-[0.85rem]", on || reduced ? "text-paper" : passed ? "text-ink-400" : "text-ink-600")}>
                    <span aria-hidden="true" className={cx("t-meta w-6", on ? "text-signal-300" : "")}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.name}
                  </p>
                  <p
                    className={cx(
                      "overflow-hidden pl-10 text-[0.98rem] leading-relaxed text-ink-300 transition-[max-height,opacity] duration-[var(--dur-section)]",
                      on || reduced ? "mt-2 max-h-40 opacity-100" : "max-h-0 opacity-0",
                    )}
                  >
                    {s.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        {!reduced ? (
          <div aria-hidden="true" className="container-x flex gap-1.5 pb-8 lg:hidden">
            {buildStages.map((s, i) => (
              <span key={s.id} className={cx("h-0.5 flex-1 transition-colors", i <= active ? "bg-signal-400" : "bg-ink-800")} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
