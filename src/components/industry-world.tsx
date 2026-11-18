"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { industries } from "@/content/world";
import { useScrollProgress } from "@/lib/motion";
import { ChapterLabel, cx } from "./ui";

/**
 * A horizontal world: industries move through the screen while the page
 * scrolls normally, and the environment takes on each industry's tint. Panels
 * hold no focusable elements, so keyboard and screen-reader users simply read
 * them in order. Phones and reduced motion get a vertical journey instead.
 */
export function IndustryWorld({ band, index = "08", headingId = "industries-title" }: { band?: ReactNode; index?: string; headingId?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const q = matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const update = () => setPinned(q.matches);
    const raf = requestAnimationFrame(update);
    q.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(raf);
      q.removeEventListener("change", update);
    };
  }, []);

  useScrollProgress(outer, (p) => {
    if (!pinned || !strip.current) return;
    const max = strip.current.scrollWidth - window.innerWidth;
    strip.current.style.transform = `translate3d(${(-p * max).toFixed(1)}px,0,0)`;
    if (backdrop.current) backdrop.current.style.transform = `translate3d(${(-p * max * 0.3).toFixed(1)}px,0,0)`;
    const i = Math.min(industries.length - 1, Math.round(p * (industries.length - 1)));
    setActive((a) => (a === i ? a : i));
  });

  const tint = industries[active].hue;

  return (
    <div
      ref={outer}
      className="relative transition-[background-color] duration-[var(--dur-section)]"
      style={{ height: pinned ? `calc(100svh + ${industries.length * 46}vw)` : undefined, backgroundColor: pinned ? tint : undefined }}
    >
      <div className={cx(pinned ? "sticky top-0 flex h-svh flex-col overflow-hidden" : "py-24")}>
        <div className="container-x relative z-10 pt-[calc(var(--header-h)+2rem)]">
          <ChapterLabel index={index} name="Industries" tone="dark" />
          <h2 id={headingId} className="t-h2 mt-6 max-w-[20ch] text-paper">
            Different industries. One connected world.
          </h2>
        </div>

        {band && pinned ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[34%] opacity-50">
            <div ref={backdrop} className="w-[170vw] will-change-transform max-lg:w-full">
              {band}
            </div>
          </div>
        ) : null}

        <div className={cx("relative", pinned ? "flex flex-1 items-center" : "mt-12")}>
          <div ref={strip} className={cx(pinned ? "flex gap-6 pr-[12vw] pl-[var(--gutter)] will-change-transform" : "container-x grid gap-5")}>
            {industries.map((ind, i) => (
              <article
                key={ind.id}
                className={cx(
                  "relative flex shrink-0 flex-col justify-between overflow-hidden rounded-[var(--radius-panel)] border border-white/10 p-8 transition-[opacity] duration-[var(--dur-section)] sm:p-10",
                  pinned ? "h-[min(30rem,58svh)] w-[42vw]" : "min-h-[22rem]",
                  pinned && i !== active && "opacity-55",
                )}
                style={{ backgroundColor: pinned ? "rgb(7 17 47 / 0.55)" : ind.hue }}
              >
                <IndustryMotif index={i} />
                <div className="relative">
                  <p className="t-meta text-ink-300">
                    <span aria-hidden="true">{String(i + 1).padStart(2, "0")} / 08</span>
                  </p>
                  <h3 className="t-h2 mt-4 text-[clamp(1.8rem,3.2vw,3.2rem)] text-paper">{ind.name}</h3>
                </div>
                <dl className="relative mt-10 grid gap-6 sm:grid-cols-3">
                  {(
                    [
                      ["Problem", ind.problem],
                      ["Technology", ind.technology],
                      ["Possibility", ind.possibility],
                    ] as const
                  ).map(([k, val], j) => (
                    <div key={k} className="border-t border-white/15 pt-4">
                      <dt className={cx("t-meta", j === 2 ? "text-signal-300" : "text-ink-300")}>{k}</dt>
                      <dd className="mt-2 text-[0.98rem] leading-snug text-ink-100">{val}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </div>

        {pinned ? (
          <div aria-hidden="true" className="container-x relative flex gap-6 pb-8">
            {industries.map((ind, i) => (
              <span key={ind.id} className={cx("t-meta transition-colors", i === active ? "text-signal-300" : "text-ink-500")}>
                {ind.name}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** A quiet lattice figure per industry, so each panel has its own environment. */
function IndustryMotif({ index }: { index: number }) {
  const r = 30 + (index % 4) * 14;
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className="pointer-events-none absolute -top-10 -right-10 size-64 opacity-40" fill="none" stroke="#aeb6ce" strokeWidth="1">
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M100 ${100 - r - k * 18}L${100 + r + k * 18} 100L100 ${100 + r + k * 18}L${100 - r - k * 18} 100Z`} strokeOpacity={0.5 - k * 0.14} />
      ))}
      <path d={`M100 100L${150 + index * 4} ${50 - index * 3}`} stroke="#3fe0cc" strokeWidth="2" />
      <rect x="95" y="95" width="10" height="10" transform="rotate(45 100 100)" fill="#14c9b5" stroke="none" />
    </svg>
  );
}
