"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { LatticeEngine, type EngineInput } from "./lattice-engine";
import { Arrow, buttonClass } from "./ui";

/**
 * Home hero. STATE 01 DORMANT: an almost empty field ("Start here").
 * STATE 02 AWAKEN: the first move, scroll or key press (or a short pause)
 * grows the system and reveals the company. Text is server-rendered and in the
 * DOM from the start; only its visibility changes.
 */
const AUTO_WAKE_MS = 2600;

export function SystemHero({ imageDesktop, imageMobile, hasImage }: { imageDesktop: ReactNode; imageMobile: ReactNode; hasImage: boolean }) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"dormant" | "awake">("dormant");

  useEffect(() => {
    const el = root.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobileQuery = matchMedia("(max-width: 1023px)");
    let engine: LatticeEngine;
    try {
      engine = new LatticeEngine(cv, { mobile: mobileQuery.matches, quiet: hasImage });
    } catch {
      return;
    }

    const input: EngineInput = { pointerX: 0, pointerY: 0, pointerActive: false, scroll: 0 };
    let raf = 0;
    let visible = true;
    const woke = document.documentElement.hasAttribute("data-awake");

    const size = () => engine.resize(el.clientWidth, el.clientHeight, mobileQuery.matches);
    size();

    const loop = (now: number) => {
      raf = 0;
      engine.frame(now, input);
      if (visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop);
    };

    const wake = () => {
      if (engine.awake) return;
      engine.wake(performance.now() - (woke ? 2400 : 0));
      setState("awake");
      try {
        sessionStorage.setItem("ct-awake", "1");
      } catch {}
    };

    if (reduced) {
      // One still frame of the finished system; no loop.
      engine.wake(0);
      engine.frame(performance.now(), input, true);
      const ro = new ResizeObserver(() => {
        size();
        engine.frame(performance.now(), input, true);
      });
      ro.observe(el);
      requestAnimationFrame(() => setState("awake"));
      return () => ro.disconnect();
    }

    if (woke) wake();
    const timer = window.setTimeout(wake, AUTO_WAKE_MS);
    const onPointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      input.pointerX = ((e.clientX - r.left) / r.width) * 2 - 1;
      input.pointerY = ((e.clientY - r.top) / r.height) * 2 - 1;
      input.pointerActive = e.pointerType === "mouse" && e.clientY < r.bottom;
      wake();
    };
    const onLeave = () => (input.pointerActive = false);
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      input.scroll = Math.min(1, Math.max(0, -r.top / r.height));
      if (window.scrollY > 4) wake();
    };
    const onKey = () => wake();
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onKey, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onKey, { passive: true });

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      start();
    });
    io.observe(el);
    const onVisibility = () => start();
    document.addEventListener("visibilitychange", onVisibility);
    const ro = new ResizeObserver(() => size());
    ro.observe(el);
    start();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onKey);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [hasImage]);

  return (
    <section
      ref={root}
      data-hero={state}
      data-chapter="01 / Start"
      data-tone="dark"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[max(100svh,40rem)] flex-col overflow-hidden bg-ink-950 text-paper"
    >
      <div aria-hidden="true" className="hero-image absolute inset-0 -z-20">
        <div className="absolute inset-0 hidden lg:block">{imageDesktop}</div>
        <div className="absolute inset-0 lg:hidden">{imageMobile}</div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#07112f_0%,rgb(7_17_47/0.7)_38%,transparent_70%)] max-lg:bg-[linear-gradient(180deg,#07112f_0%,rgb(7_17_47/0.75)_45%,transparent_80%)]" />
      </div>
      <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 -z-10 size-full" />
      {/* Keeps the reading side calm: the system lives on the right (desktop) or below (phones). */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#07112f_0%,rgb(7_17_47/0.92)_30%,rgb(7_17_47/0.4)_48%,transparent_62%)] max-lg:bg-[linear-gradient(180deg,#07112f_0%,rgb(7_17_47/0.94)_48%,rgb(7_17_47/0.3)_66%,transparent_80%)]" />

      {/* STATE 01: dormant. Decorative; the real heading below is always in the document. */}
      <div aria-hidden="true" className="hero-dormant pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="t-meta text-ink-300">Everything starts somewhere.</p>
        <p className="t-display mt-6 text-paper">Start here.</p>
        <p className="t-meta mt-10 flex items-center gap-3 text-ink-400">
          <span className="node anim-pulse" />
          Move, scroll or press any key
        </p>
      </div>

      {/* STATE 02: awake. */}
      <div className="container-x relative flex flex-1 flex-col justify-center pt-[calc(var(--header-h)+2.5rem)] pb-10 max-lg:justify-start">
        <div className="max-w-[44rem] lg:max-w-[48%]">
          <p className="hero-awake t-meta flex items-center gap-3 text-signal-300">
            <span className="node" aria-hidden="true" />
            Technology / Talent / Intelligence
          </p>
          <h1 id="hero-title" className="hero-awake delay-1 t-h1 mt-7 text-paper">
            We build
            <br />
            what&apos;s next.
          </h1>
          <p className="hero-awake delay-2 t-lead mt-8 max-w-xl text-ink-200">Technology, people and intelligence working together to move ambitious ideas forward.</p>
          <p className="hero-awake delay-2 mt-4 max-w-xl text-[0.95rem] text-ink-300">An IT services, IT consulting and IT staffing company in Dallas, Texas.</p>
          <div className="hero-awake delay-2 mt-10 flex flex-wrap gap-3">
            <a href="#system" className={buttonClass("primary", "dark")}>
              Enter the system
              <Arrow className="rotate-90 transition-transform duration-[var(--dur-component)] group-hover:translate-y-1" />
            </a>
            <Link href="/company" className={buttonClass("secondary", "dark")}>
              Meet the company
              <Arrow className="transition-transform duration-[var(--dur-component)] group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-awake delay-2 container-x relative flex items-end justify-between gap-6 pb-8">
        <p className="t-meta text-ink-400">
          Technology <span aria-hidden="true">·</span> People <span aria-hidden="true">·</span> Intelligence <span aria-hidden="true">·</span> Possibility
        </p>
        <p aria-hidden="true" className="t-meta hidden items-center gap-3 text-ink-400 sm:flex">
          01 / Start
          <span className="block h-10 w-px bg-gradient-to-b from-ink-400 to-transparent" />
        </p>
      </div>
    </section>
  );
}

