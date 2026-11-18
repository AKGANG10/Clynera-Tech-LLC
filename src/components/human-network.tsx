"use client";

import { useEffect, useRef, useState } from "react";
import { network } from "@/content/world";
import { diagonalPath } from "@/lib/lattice";
import { cx } from "./ui";

/**
 * WHERE SKILLS MEET THE WORK. Specialists connect to skills, skills to roles,
 * roles to projects, projects to employers and employers to an engagement. Selecting any
 * node lights the paths through it and describes them in text. Lines are
 * computed from the rendered layout, so the same component works as six
 * columns (desktop) and a vertical journey (phones).
 *
 * Illustrative data: archetypes, not real candidates. The section says so.
 */
type Chain = readonly string[];

const edgesOf = (c: Chain): [string, string][] => [
  [c[0], c[1]],
  [c[0], c[2]],
  [c[1], c[3]],
  [c[2], c[3]],
  [c[3], c[4]],
  [c[4], c[5]],
  [c[5], c[6]],
];

const EDGES = Array.from(new Map(network.chains.flatMap(edgesOf).map((e) => [e.join("|"), e])).values());

const an = (w: string) => (/^[aeiou]/i.test(w) ? `an ${w}` : `a ${w}`);
const describe = (c: Chain) => `${c[0]} brings ${c[1]} and ${c[2]} to ${an(c[3])} role on the ${c[4]} for ${an(c[5].toLowerCase())}, as ${an(c[6].toLowerCase())} engagement.`;

export function HumanNetwork() {
  const [selected, setSelected] = useState<string>("Specialist 2");
  const box = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<{ key: string; d: string }[]>([]);

  const chains = network.chains.filter((c) => (c as Chain).includes(selected));
  const lit = new Set(chains.flatMap((c) => edgesOf(c).map((e) => e.join("|"))));
  const litNodes = new Set(chains.flat());

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const layout = () => {
      const base = el.getBoundingClientRect();
      const vertical = window.matchMedia("(max-width: 1023px)").matches;
      const at = (name: string) => el.querySelector<HTMLElement>(`[data-node="${CSS.escape(name)}"]`)?.getBoundingClientRect();
      const next = EDGES.flatMap(([a, b]) => {
        const ra = at(a);
        const rb = at(b);
        if (!ra || !rb) return [];
        const d = vertical
          ? diagonalPath(ra.left + ra.width / 2 - base.left, ra.bottom - base.top, rb.left + rb.width / 2 - base.left, rb.top - base.top)
          : diagonalPath(ra.right - base.left, ra.top + ra.height / 2 - base.top, rb.left - base.left, rb.top + rb.height / 2 - base.top);
        return [{ key: `${a}|${b}`, d }];
      });
      svg.current?.setAttribute("viewBox", `0 0 ${base.width} ${base.height}`);
      setPaths(next);
    };
    const raf = requestAnimationFrame(layout);
    const ro = new ResizeObserver(() => requestAnimationFrame(layout));
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div>
      <div ref={box} className="relative">
        <svg ref={svg} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible" fill="none">
          {paths.map((p) => {
            const on = lit.has(p.key);
            return <path key={p.key} d={p.d} stroke={on ? "#3fe0cc" : "#aeb6ce"} strokeOpacity={on ? 0.95 : 0.14} strokeWidth={on ? 1.8 : 1} className="transition-[stroke,stroke-opacity] duration-[var(--dur-component)]" />;
          })}
        </svg>
        <div className="relative grid gap-y-10 lg:grid-cols-6 lg:gap-x-10">
          {network.columns.map((col) => (
            <div key={col.id}>
              <h3 className="t-meta text-ink-400">{col.name}</h3>
              <ul className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:gap-3">
                {network.nodes[col.id as keyof typeof network.nodes].map((n) => {
                  const on = litNodes.has(n);
                  return (
                    <li key={n}>
                      <button
                        type="button"
                        data-node={n}
                        aria-pressed={selected === n}
                        onClick={() => setSelected(n)}
                        className={cx(
                          "inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-left text-[0.86rem] transition-[background-color,color,border-color] duration-[var(--dur-micro)]",
                          selected === n
                            ? "border-signal-300 bg-signal-300 text-ink-950"
                            : on
                              ? "border-signal-400 bg-ink-900 text-paper"
                              : "border-ink-700 bg-ink-950 text-ink-300 hover:border-ink-400 hover:text-paper",
                        )}
                      >
                        <span aria-hidden="true" className={cx("node", !on && "bg-ink-600")} />
                        {n}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-12 grid gap-6 border-t border-ink-800 pt-8 lg:grid-cols-12">
        <p className="t-meta text-ink-400 lg:col-span-3">Example routes, not real candidates</p>
        <div aria-live="polite" className="space-y-2 text-[1.02rem] leading-relaxed text-ink-200 lg:col-span-9">
          {chains.map((c) => (
            <p key={c.join()}>{describe(c)}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
