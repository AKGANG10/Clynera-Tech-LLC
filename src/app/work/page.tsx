import type { Metadata } from "next";
import { BuildSequence } from "@/components/build-sequence";
import { WorkChapter } from "@/components/sections";
import { Chapter, Container, PageIntro } from "@/components/ui";
import { Visual } from "@/components/visual";
import { principles } from "@/content/world";

export const metadata: Metadata = {
  title: "Work: How We Find the Route",
  description: "How Clynera Tech takes a project from first question to running system, with concept routes we are ready to run. Concepts are labelled; no borrowed case studies.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <PageIntro
        id="work-page-title"
        index="07"
        name="Proof"
        title="Proof beats promises."
        lead="We will not borrow other people's case studies or invent our own. Here is exactly how we work, and the kinds of routes we are ready to run, each one labelled as a concept."
      >
        <div className="mt-16">
          <Visual name="build" priority sizes="(min-width: 1344px) 1300px, 100vw" />
        </div>
      </PageIntro>

      <Chapter index="04" name="Blueprint" tone="dark" aria-labelledby="work-build-title">
        <BuildSequence headingId="work-build-title" />
      </Chapter>

      <WorkChapter index="07" headingId="work-concepts-title" limit={4} full />

      <Chapter index="07" name="Rules" aria-labelledby="principles-title" className="py-28">
        <Container>
          <h2 id="principles-title" className="t-h2 text-ink-950">
            The rules we travel by.
          </h2>
          <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p) => (
              <li key={p.name} className="border-t-2 border-ink-900 pt-5">
                <h3 className="t-h3">{p.name}</h3>
                <p className="mt-3 leading-relaxed text-ink-600">{p.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Chapter>
    </>
  );
}
