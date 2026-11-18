"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import markPoints from "@/content/mark-points.json";
import { rng } from "@/lib/lattice";
import { cx } from "./ui";

/**
 * The signature ending. Everything explored on the way down returns as a
 * scattered system, collapses into one point, and that point becomes the
 * Clynera mark; then the real logo takes over. Plays once, when the ending is
 * in view. Reduced motion shows the logo directly.
 */
const POINTS = markPoints as [number, number, number][];
const DURATION = 3600;

const ease = (t: number) => 1 - (1 - t) ** 3;
const easeIn = (t: number) => t * t * t;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

export function Finale({ className }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const host = wrap.current;
    const cv = canvas.current;
    if (!host || !cv) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      requestAnimationFrame(() => setDone(true));
      return;
    }
    const ctx = cv.getContext("2d");
    if (!ctx) {
      requestAnimationFrame(() => setDone(true));
      return;
    }
    let raf = 0;
    let start = 0;
    const r = rng(11);
    // Where each point starts: scattered lattice nodes, the "system" seen earlier.
    const scatter = POINTS.map(() => {
      const u = Math.round((r() - 0.5) * 26);
      const v = Math.round((r() - 0.5) * 26);
      return [(u - v) * 0.11, (u + v) * 0.06] as [number, number];
    });

    const draw = (now: number) => {
      if (!start) start = now;
      const t = clamp01((now - start) / DURATION);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (cv.width !== Math.round(w * dpr)) {
        cv.width = Math.round(w * dpr);
        cv.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const S = Math.min(w, h) * 0.46;
      const collapse = easeIn(clamp01((t - 0.18) / 0.32));
      const grow = ease(clamp01((t - 0.52) / 0.42));
      for (let i = 0; i < POINTS.length; i++) {
        const [mx, my, tone] = POINTS[i];
        const [sx, sy] = scatter[i];
        // scatter -> centre point -> mark
        const x0 = sx * S * 2.2;
        const y0 = sy * S * 2.2;
        const x = grow > 0 ? mx * S * grow : x0 * (1 - collapse);
        const y = grow > 0 ? my * S * grow : y0 * (1 - collapse);
        const g = Math.round(241 * (1 - tone) + 201 * tone);
        const b = Math.round(236 * (1 - tone) + 181 * tone);
        const rr = Math.round(242 * (1 - tone) + 20 * tone);
        ctx.fillStyle = `rgb(${rr} ${g} ${b} / ${0.35 + 0.65 * Math.max(grow, 1 - collapse * 0.4)})`;
        const size = 1.2 + grow * (S / 120);
        ctx.fillRect(cx + x - size / 2, cy + y - size / 2, size, size);
      }
      // The single point, brightest at the moment everything has collapsed.
      const flash = clamp01(1 - Math.abs(t - 0.52) / 0.12);
      if (flash > 0) {
        ctx.fillStyle = `rgb(63 224 204 / ${flash})`;
        ctx.beginPath();
        ctx.arc(cx, cy, 2 + flash * 5, 0, Math.PI * 2);
        ctx.fill();
      }
      if (t < 1) raf = requestAnimationFrame(draw);
      else setDone(true);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          raf = requestAnimationFrame(draw);
        }
      },
      { threshold: 0.45 },
    );
    io.observe(host);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrap} className={cx("relative aspect-square", className)} data-finale={done ? "done" : "pending"}>
      <canvas ref={canvas} aria-hidden="true" className={cx("absolute inset-0 size-full transition-opacity duration-[var(--dur-section)]", done && "opacity-0")} />
      <Image
        src="/brand/clynera-mark-light.png"
        alt=""
        width={512}
        height={512}
        className={cx("absolute inset-[4%] size-[92%] object-contain transition-opacity duration-[var(--dur-section)]", done ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
}
