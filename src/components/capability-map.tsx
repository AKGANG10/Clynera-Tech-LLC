"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { capabilities, type CapabilityId } from "@/content/capabilities";
import { CapabilityScene } from "./capability-scenes";
import { ArrowLink, cx } from "./ui";

/**
 * STATE 04 CONNECT. An interactive map instead of service cards: nine
 * capabilities around a diamond window. Hover (fine pointers), tap, click or
 * the arrow keys change what the window shows. ARIA tabs pattern with
 * automatic activation; the description panel is always readable text.
 */
export function CapabilityMap({ images = {}, detailHref }: { images?: Partial<Record<CapabilityId, ReactNode>>; detailHref?: string }) {
  const [active, setActive] = useState<CapabilityId>("ai");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const strip = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const current = capabilities.find((c) => c.id === active)!;
  const idx = capabilities.indexOf(current);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const n = capabilities.length;
    const map: Record<string, number> = { ArrowRight: idx + 1, ArrowDown: idx + 1, ArrowLeft: idx - 1, ArrowUp: idx - 1, Home: 0, End: n - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = (map[e.key] + n) % n;
    setActive(capabilities[next].id);
    // Focus moves within whichever tab set the key was pressed in.
    (e.currentTarget.dataset.set === "strip" ? strip : tabs).current[next]?.focus();
  };

  return (
    <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
      <div className="relative min-w-0 lg:col-span-7">
        <div className="relative mx-auto aspect-square w-full max-w-[40rem]">
          {/* The window: the logo's diamond, showing the selected capability's environment. */}
          <div className="absolute inset-[17%] max-lg:inset-[10%]">
            <div className="absolute inset-0 bg-ink-950 [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)]">
              <div aria-hidden="true" className="lattice-bg-dark absolute inset-0" />
              {images[active] ? <div className="scene-enter absolute inset-0 opacity-80 [&>*]:!absolute [&>*]:!inset-0 [&>*]:!aspect-auto">{images[active]}</div> : null}
              <CapabilityScene key={active} id={active} />
            </div>
            <svg viewBox="0 0 100 100" aria-hidden="true" className="pointer-events-none absolute -inset-[3%] size-[106%]" fill="none">
              <path d="M50 1 99 50 50 99 1 50Z" stroke="#08143c" strokeOpacity="0.18" strokeWidth="0.3" />
            </svg>
          </div>

          <div role="tablist" aria-label="Capabilities" className="pointer-events-none absolute inset-0 max-lg:hidden">
            {capabilities.map((c, i) => {
              const t = (i / capabilities.length) * Math.PI * 2 - Math.PI / 2;
              const x = 50 + Math.cos(t) * 47;
              const y = 50 + Math.sin(t) * 47;
              const selected = c.id === active;
              return (
                <button
                  key={c.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  id={`${uid}-tab-${c.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`${uid}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(c.id)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(c.id)}
                  data-set="ring"
                  onKeyDown={onKey}
                  className={cx(
                    "t-label pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border px-3.5 py-2 text-[0.72rem] whitespace-nowrap transition-[background-color,color,border-color] duration-[var(--dur-micro)]",
                    selected ? "border-ink-950 bg-ink-950 text-paper" : "border-ink-200 bg-chalk text-ink-800 hover:border-ink-900",
                  )}
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <span aria-hidden="true" className={cx("node", !selected && "bg-ink-300")} />
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Phones and tablets: the same tabs as a swipeable strip above the window. */}
        <div role="tablist" aria-label="Capabilities" className="-mx-[var(--gutter)] mt-8 flex snap-x gap-2 overflow-x-auto px-[var(--gutter)] pb-2 lg:hidden">
          {capabilities.map((c, i) => {
            const selected = c.id === active;
            return (
              <button
                key={c.id}
                id={`${uid}-mtab-${c.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`${uid}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(c.id)}
                data-set="strip"
                onKeyDown={onKey}
                ref={(el) => {
                  strip.current[i] = el;
                }}
                className={cx(
                  "t-label flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-full border px-4 text-[0.72rem] whitespace-nowrap",
                  selected ? "border-ink-950 bg-ink-950 text-paper" : "border-ink-200 bg-chalk text-ink-800",
                )}
              >
                <span aria-hidden="true" className={cx("node", !selected && "bg-ink-300")} />
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${active}`} className="min-w-0 lg:col-span-5">
        <p className="t-meta flex items-center gap-3 text-ink-500">
          <span aria-hidden="true">{String(idx + 1).padStart(2, "0")} / 09</span>
          <span aria-hidden="true" className="h-px w-6 bg-ink-300" />
          {current.category}
        </p>
        <h3 className="t-h2 mt-5 text-ink-950">{current.name}</h3>
        <p className="t-h3 mt-5 text-ink-800">{current.line}</p>
        <p className="mt-5 max-w-lg leading-relaxed text-ink-600">{current.body}</p>
        <ul className="mt-8 grid gap-3 border-t border-ink-200 pt-6 sm:grid-cols-2">
          {current.deliver.map((d) => (
            <li key={d} className="flex items-start gap-3 text-[0.95rem] text-ink-800">
              <span aria-hidden="true" className="node mt-2 bg-ink-900" />
              {d}
            </li>
          ))}
        </ul>
        {detailHref ? <ArrowLink href={detailHref} className="mt-10">All capabilities</ArrowLink> : null}
      </div>
    </div>
  );
}
