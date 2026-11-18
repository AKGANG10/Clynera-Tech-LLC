import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export type Tone = "light" | "dark";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("container-x", className)}>{children}</div>;
}

/**
 * A chapter of the journey. `index` and `name` feed the header's progress
 * label ("02 / SYSTEM") and the small label at the top of the section.
 */
export function Chapter({
  index,
  name,
  tone = "light",
  className,
  children,
  ...rest
}: { index: string; name: string; tone?: Tone; className?: string; children: ReactNode } & Omit<ComponentProps<"section">, "className" | "children">) {
  return (
    <section
      data-chapter={`${index} / ${name}`}
      data-tone={tone}
      className={cx("relative", tone === "dark" ? "bg-ink-950 text-paper" : "bg-paper text-ink-900", className)}
      {...rest}
    >
      {children}
    </section>
  );
}

/** Small metadata line: "02 / System". Index is decorative; the name is read. */
export function ChapterLabel({ index, name, tone = "light", className }: { index: string; name: string; tone?: Tone; className?: string }) {
  return (
    <p className={cx("t-meta flex items-center gap-3", tone === "dark" ? "text-ink-300" : "text-ink-500", className)}>
      <span aria-hidden="true" className="node" />
      <span aria-hidden="true">{index}</span>
      <span aria-hidden="true" className={cx("h-px w-8", tone === "dark" ? "bg-ink-600" : "bg-ink-300")} />
      <span>{name}</span>
    </p>
  );
}

export function Meta({ children, className, tone = "light" }: { children: ReactNode; className?: string; tone?: Tone }) {
  return <p className={cx("t-meta", tone === "dark" ? "text-ink-300" : "text-ink-500", className)}>{children}</p>;
}

/** The logo's breakout arrow, simplified to a glyph. */
export function Arrow({ className, diagonal = false }: { className?: string; diagonal?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={cx("size-[1.05em] shrink-0", className)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {diagonal ? <path d="M5 15 15 5M8 5h7v7" /> : <path d="M3 10h13M11 5l5 5-5 5" />}
    </svg>
  );
}

const buttonBase =
  "group t-label inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 text-[0.8rem] transition-[background-color,color,border-color] duration-[var(--dur-micro)]";

export function buttonClass(variant: "primary" | "secondary" = "primary", tone: Tone = "light") {
  if (variant === "primary") {
    return cx(buttonBase, tone === "dark" ? "bg-paper text-ink-950 hover:bg-signal-300" : "bg-ink-950 text-paper hover:bg-signal-700");
  }
  return cx(
    buttonBase,
    "border",
    tone === "dark" ? "border-ink-500 text-paper hover:border-signal-300 hover:text-signal-300" : "border-ink-300 text-ink-900 hover:border-ink-900",
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  tone = "light",
  className,
  diagonal,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  tone?: Tone;
  className?: string;
  diagonal?: boolean;
}) {
  return (
    <Link href={href} className={cx(buttonClass(variant, tone), className)}>
      {children}
      <Arrow diagonal={diagonal} className="transition-transform duration-[var(--dur-component)] ease-[var(--ease-out)] group-hover:translate-x-1" />
    </Link>
  );
}

/** Text link with an arrow, used for "All capabilities" style exits from a section. */
export function ArrowLink({ href, children, tone = "light", className }: { href: string; children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <Link
      href={href}
      className={cx(
        "group t-label inline-flex items-center gap-2 text-[0.8rem]",
        tone === "dark" ? "text-signal-300 hover:text-paper" : "text-signal-700 hover:text-ink-950",
        className,
      )}
    >
      <span className="link-line">{children}</span>
      <Arrow className="transition-transform duration-[var(--dur-component)] group-hover:translate-x-1" />
    </Link>
  );
}

/** Page opening for inner pages: label, title, lead. Light editorial by default. */
export function PageIntro({
  index,
  name,
  title,
  lead,
  children,
  id,
}: {
  index: string;
  name: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  id: string;
}) {
  return (
    <Chapter index={index} name={name} aria-labelledby={id} className="overflow-hidden pt-[calc(var(--header-h)+4rem)] pb-20 sm:pb-28">
      <div aria-hidden="true" className="lattice-bg absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <Container className="relative">
        <ChapterLabel index={index} name={name} />
        <h1 id={id} className="t-h1 mt-8 max-w-[16ch] text-ink-950">
          {title}
        </h1>
        {lead ? <p className="t-lead mt-8 max-w-2xl text-ink-600">{lead}</p> : null}
        {children}
      </Container>
    </Chapter>
  );
}
