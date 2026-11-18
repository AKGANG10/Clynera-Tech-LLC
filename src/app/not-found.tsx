import type { Metadata } from "next";
import { ButtonLink, Chapter, ChapterLabel, Container } from "@/components/ui";

export const metadata: Metadata = { title: "Page not found" };

/** 404: a broken connection, in the same language as the rest of the system. */
export default function NotFound() {
  return (
    <Chapter index="404" name="Not found" tone="dark" aria-labelledby="nf-title" className="flex min-h-[80svh] items-center pt-[var(--header-h)]">
      <Container className="relative">
        <svg viewBox="0 0 400 200" aria-hidden="true" className="w-[min(28rem,80vw)]" fill="none" strokeLinecap="round">
          <path d="M20 160L100 80L160 140" stroke="#aeb6ce" strokeWidth="6" />
          <path d="M240 140L300 80L380 160" stroke="#aeb6ce" strokeWidth="6" />
          <circle cx="200" cy="140" r="7" fill="#3fe0cc" className="anim-pulse" />
        </svg>
        <ChapterLabel index="404" name="Not found" tone="dark" className="mt-10" />
        <h1 id="nf-title" className="t-h1 mt-6 max-w-[14ch] text-paper">
          Dead end.
        </h1>
        <p className="t-lead mt-6 max-w-lg text-ink-300">Even good maps have them. The page may have moved, or the link may be incomplete.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/" tone="dark">
            Back to the entrance
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary" tone="dark">
            Contact us
          </ButtonLink>
        </div>
      </Container>
    </Chapter>
  );
}
