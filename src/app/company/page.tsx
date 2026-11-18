import type { Metadata } from "next";
import { StoryTimeline } from "@/components/sections";
import { ButtonLink, Chapter, ChapterLabel, Container, PageIntro } from "@/components/ui";
import { Visual } from "@/components/visual";
import { company, formattedAddress } from "@/content/site";
import { principles } from "@/content/world";

export const metadata: Metadata = {
  title: "Company: About Clynera Tech",
  description: `${company.legalName} is a technology and talent company at ${formattedAddress}. IT services, IT consulting and IT staffing.`,
  alternates: { canonical: "/company" },
};

export default function CompanyPage() {
  const facts = [
    ["Legal name", company.legalName],
    ["Headquarters", formattedAddress],
    ["Phone", company.phone.display],
    ["Email", company.email],
    ["Services", "IT services, IT consulting and IT staffing"],
    ["Employment verification", "E-Verify participant"],
  ] as const;

  return (
    <>
      <PageIntro
        id="company-page-title"
        index="10"
        name="Company"
        title="Why we exist."
        lead="Technology projects rarely fail on technology alone. They stall where a system meets a team that was never set up to own it. Clynera Tech exists to close that gap."
      />

      <Chapter index="10" name="Story" tone="dark" aria-labelledby="company-story-title" className="py-28 sm:py-36">
        <Container>
          <ChapterLabel index="10" name="Story" tone="dark" />
          <h2 id="company-story-title" className="t-h2 mt-6 max-w-[16ch] text-paper">
            The story, as progress.
          </h2>
          <div className="mt-16">
            <StoryTimeline tone="dark" />
          </div>
        </Container>
      </Chapter>

      <Chapter index="10" name="Architecture" aria-label="How the company is organized" className="py-20">
        <Container>
          <Visual name="architecture" sizes="(min-width: 1344px) 1300px, 100vw" />
        </Container>
      </Chapter>

      <Chapter index="10" name="Principles" aria-labelledby="company-principles-title" className="py-24">
        <Container>
          <h2 id="company-principles-title" className="t-h2 text-ink-950">
            What we hold to.
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

      <Chapter index="10" name="Facts" aria-labelledby="facts-title" className="bg-paper-2 py-24">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="facts-title" className="t-h2 text-ink-950">
              The facts.
            </h2>
            <ButtonLink href="/contact" className="mt-10">
              Talk to us
            </ButtonLink>
          </div>
          <dl className="divide-y divide-ink-300 border-y border-ink-300 lg:col-span-8">
            {facts.map(([k, v]) => (
              <div key={k} className="grid gap-2 py-5 sm:grid-cols-3">
                <dt className="t-meta text-ink-500">{k}</dt>
                <dd className="text-ink-900 sm:col-span-2">{v}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Chapter>
    </>
  );
}
