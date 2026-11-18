import type { ReactNode } from "react";
import { Chapter, ChapterLabel, Container } from "./ui";

/** Layout for legal pages. `draft` shows a notice until counsel approves the text. */
export function LegalPage({ id, title, updated, draft = true, children }: { id: string; title: string; updated: string; draft?: boolean; children: ReactNode }) {
  return (
    <Chapter index="§" name="Legal" aria-labelledby={id} className="pt-[calc(var(--header-h)+4rem)] pb-28">
      <Container className="max-w-3xl">
        <ChapterLabel index="§" name="Legal" />
        <h1 id={id} className="t-h2 mt-8 text-ink-950">
          {title}
        </h1>
        <p className="mt-4 text-sm text-ink-500">Last updated: {updated}</p>
        {draft ? (
          <div role="note" className="mt-8 rounded-[10px] border border-ink-300 bg-paper-2 p-5">
            <p className="font-semibold text-ink-900">Draft for legal review</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-600">
              This text describes how the website currently works. It has not yet been reviewed by legal counsel.
            </p>
          </div>
        ) : null}
        <div className="mt-10 space-y-8 leading-relaxed text-ink-800 [&_h2]:t-h3 [&_h2]:text-ink-950 [&_li]:mt-2 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </Container>
    </Chapter>
  );
}
