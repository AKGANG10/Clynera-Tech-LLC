"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav, secondaryNav } from "@/content/site";
import { Arrow, buttonClass, cx } from "./ui";

/**
 * Navigation that is part of the journey: it takes the tone of the chapter
 * beneath it and shows where the visitor is ("02 / SYSTEM").
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [state, setState] = useState<{ tone: "light" | "dark"; chapter: string; solid: boolean }>(() => ({
    // The home page opens on a dark chapter; render the matching header on the server too.
    tone: pathname === "/" ? "dark" : "light",
    chapter: "",
    solid: false,
  }));
  const menu = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const probe = 36;
      let tone: "light" | "dark" = "light";
      let chapter = "";
      for (const el of document.querySelectorAll<HTMLElement>("main [data-chapter]")) {
        const r = el.getBoundingClientRect();
        if (r.height && r.top <= probe && r.bottom > probe) {
          tone = el.dataset.tone === "dark" ? "dark" : "light";
          chapter = el.dataset.chapter ?? "";
        }
      }
      const solid = window.scrollY > 24;
      setState((s) => (s.tone === tone && s.chapter === chapter && s.solid === solid ? s : { tone, chapter, solid }));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    raf = requestAnimationFrame(read);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Pages swap under the header on navigation; read again once they have painted.
    const t = window.setTimeout(read, 400);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  // Close the menu after navigating.
  useEffect(() => {
    menu.current?.close();
  }, [pathname]);

  const dark = state.tone === "dark";
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-[var(--z-header)] transition-[background-color,color,box-shadow] duration-[var(--dur-component)]",
        dark ? "text-paper" : "text-ink-900",
        state.solid && (dark ? "bg-ink-950/88 shadow-[0_1px_0_rgb(174_182_206/0.12)]" : "bg-paper/92 shadow-[0_1px_0_rgb(8_20_60/0.08)]"),
      )}
    >
      <div className="container-x flex h-[var(--header-h)] items-center gap-6">
        <Link href="/" className="relative block h-9 w-[124px] shrink-0" aria-label="Clynera Tech, home">
          <Image src="/brand/clynera-logo.png" alt="" width={124} height={36} priority className={cx("absolute inset-0 h-9 w-auto transition-opacity duration-[var(--dur-component)]", dark && "opacity-0")} />
          <Image src="/brand/clynera-logo-light.png" alt="" width={124} height={36} priority className={cx("absolute inset-0 h-9 w-auto transition-opacity duration-[var(--dur-component)]", !dark && "opacity-0")} />
        </Link>

        <p aria-hidden="true" className={cx("t-meta hidden min-w-0 flex-1 truncate xl:block", dark ? "text-ink-300" : "text-ink-500")}>
          {state.chapter}
        </p>

        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-8">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cx("t-label link-line py-2 text-[0.78rem]", isActive(item.href) && "bg-[length:100%_1px]")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/contact" className={cx(buttonClass("primary", dark ? "dark" : "light"), "min-h-11 px-5 text-[0.74rem] max-sm:hidden")}>
          Start a project
          <Arrow className="transition-transform duration-[var(--dur-component)] group-hover:translate-x-1" />
        </Link>

        <button
          type="button"
          onClick={() => menu.current?.showModal()}
          className="t-label -mr-2 ml-auto inline-flex min-h-11 items-center gap-2 px-2 text-[0.78rem] sm:ml-0 lg:hidden"
          aria-haspopup="dialog"
        >
          Menu
          <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 7h14M3 13h9" />
          </svg>
        </button>
      </div>

      <dialog
        ref={menu}
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-ink-950 p-0 text-paper backdrop:bg-ink-950/60 open:flex open:flex-col"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className="container-x flex h-[var(--header-h)] shrink-0 items-center justify-between">
          <Image src="/brand/clynera-logo-light.png" alt="Clynera Tech" width={124} height={36} className="h-9 w-auto" />
          <button type="button" onClick={() => menu.current?.close()} className="t-label -mr-2 inline-flex min-h-11 items-center gap-2 px-2 text-[0.78rem]">
            Close
            <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="m5 5 10 10M15 5 5 15" />
            </svg>
          </button>
        </div>
        <nav aria-label="Menu" className="container-x flex flex-1 flex-col justify-center gap-10 pb-10">
          <ul className="space-y-2">
            {mainNav.map((item, i) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className="t-h2 flex items-baseline gap-4 py-1 aria-[current=page]:text-signal-300">
                  <span aria-hidden="true" className="t-meta text-ink-400">
                    0{i + 1}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {secondaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="t-label text-[0.82rem] text-ink-300 hover:text-paper">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact" className={cx(buttonClass("primary", "dark"), "self-start")}>
            Start a project
            <Arrow />
          </Link>
        </nav>
      </dialog>
    </header>
  );
}
