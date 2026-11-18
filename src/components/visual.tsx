import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { useId } from "react";
import { visualSrc, visuals, type VisualKey } from "@/content/visuals";
import { rings, svgPath, walkers, type UV } from "@/lib/lattice";
import { cx } from "./ui";

/**
 * One image slot. Renders the imported file when it exists (checked at build
 * time, so pages stay static) and otherwise original lattice art composed with
 * the same visual weight, so the layout never waits on an asset.
 */
export function Visual({
  name,
  className,
  sizes = "100vw",
  priority = false,
  rounded = true,
  imageClassName,
}: {
  name: VisualKey;
  className?: string;
  sizes?: string;
  priority?: boolean;
  rounded?: boolean;
  imageClassName?: string;
}) {
  const slot = visuals[name];
  const src = visualSrc(name);
  const exists = existsSync(path.join(process.cwd(), "public", src));
  const [w, h] = slot.ratio;
  const position = { right: "70% 50%", left: "30% 50%", bottom: "50% 75%", center: "50% 50%", band: "50% 50%" }[slot.weight];

  return (
    <figure
      className={cx("relative overflow-hidden", rounded && "rounded-[var(--radius-frame)]", slot.tone === "dark" ? "bg-ink-950" : "bg-paper-2", className)}
      style={{ aspectRatio: `${w} / ${h}` }}
      data-visual={name}
      data-visual-state={exists ? "image" : "art"}
    >
      {exists ? (
        <Image src={src} alt={slot.alt} fill sizes={sizes} priority={priority} className={cx("object-cover", imageClassName)} style={{ objectPosition: position }} />
      ) : (
        <SlotArt name={name} />
      )}
      {exists && slot.people ? (
        <figcaption className="t-meta tag-illustration">Illustration</figcaption>
      ) : null}
    </figure>
  );
}

/** Procedural stand-in: the lattice, gathered where the image's subject would be. */
export function SlotArt({ name, className }: { name: VisualKey; className?: string }) {
  const slot = visuals[name];
  const [rw, rh] = slot.ratio;
  const W = 1000;
  const H = Math.round((W * rh) / rw);
  const dark = slot.tone === "dark";
  const seed = [...name].reduce((n, c) => n * 31 + c.charCodeAt(0), 7) >>> 0;
  const focus: Record<typeof slot.weight, [number, number]> = {
    right: [0.7, 0.5],
    left: [0.3, 0.5],
    bottom: [0.5, 0.7],
    center: [0.5, 0.5],
    band: [0.5, 0.5],
  };
  const [fx, fy] = focus[slot.weight];
  const cx0 = W * fx;
  const cy0 = H * fy;
  const unit = Math.max(10, Math.min(W, H) / 22);
  const bound = slot.weight === "band" ? 5 : 7;
  const ringSet = slot.weight === "band" ? [] : rings([2, 4, 6], seed);
  const paths = walkers({ seed, count: slot.weight === "band" ? 60 : 34, bound, runs: [2, 6], run: [1, 3] });
  const ink = dark ? "#aeb6ce" : "#26346a";
  // Unique per instance: hidden (Activity) pages keep their SVGs in the DOM too.
  const id = `sa-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  // A band stretches the structure horizontally across the frame.
  const bandScale = slot.weight === "band" ? `translate(${W / 2} ${H / 2}) scale(${W / (unit * bound * 2 * 1.5)} 0.55) translate(${-W / 2} ${-H / 2})` : undefined;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={cx("absolute inset-0 size-full", className)}>
      <defs>
        <radialGradient id={`${id}-glow`} cx={fx} cy={fy} r="0.6">
          <stop offset="0" stopColor={dark ? "#1c5f8c" : "#ffffff"} stopOpacity={dark ? 0.55 : 0.9} />
          <stop offset="1" stopColor={dark ? "#07112f" : "#e8e7e0"} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-tone`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor={dark ? "#4a9ac0" : "#08143c"} />
          <stop offset="1" stopColor="#14c9b5" />
        </linearGradient>
        <pattern id={`${id}-grid`} width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0H48" stroke={ink} strokeOpacity={dark ? 0.08 : 0.07} strokeWidth="1" />
          <path d="M0 0V48" stroke={ink} strokeOpacity={dark ? 0.08 : 0.07} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={dark ? "#07112f" : "#e8e7e0"} />
      <rect width={W} height={H} fill={`url(#${id}-grid)`} />
      <rect width={W} height={H} fill={`url(#${id}-glow)`} />
      <g transform={bandScale} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {paths.map((p, i) => (
          <path
            key={i}
            d={svgPath(p.points, unit * (p.layer === 0 ? 1.5 : 1), cx0, cy0)}
            stroke={p.layer === 2 ? `url(#${id}-tone)` : ink}
            strokeOpacity={p.layer === 0 ? 0.18 : p.layer === 1 ? 0.35 : 0.9}
            strokeWidth={p.layer === 2 ? 3 : 1.5}
          />
        ))}
        {ringSet.map((pts: UV[], i) => (
          <path key={`r${i}`} d={svgPath(pts, unit, cx0, cy0)} stroke={`url(#${id}-tone)`} strokeWidth={unit * 0.42} strokeOpacity="0.95" />
        ))}
        {paths
          .filter((p) => p.end && p.layer === 2)
          .map((p, i) => {
            const [u, v] = p.points[p.points.length - 1];
            const x = cx0 + (u - v) * unit * Math.SQRT1_2;
            const y = cy0 + (u + v) * unit * Math.SQRT1_2;
            return <circle key={`n${i}`} cx={x} cy={y} r={unit * 0.22} fill={dark ? "#3fe0cc" : "#08143c"} />;
          })}
        {slot.weight !== "band" ? (
          <rect x={cx0 - unit * 0.6} y={cy0 - unit * 0.6} width={unit * 1.2} height={unit * 1.2} transform={`rotate(45 ${cx0} ${cy0})`} fill="#14c9b5" />
        ) : null}
      </g>
    </svg>
  );
}
