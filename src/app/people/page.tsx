import type { Metadata } from "next";
import { HumanNetwork } from "@/components/human-network";
import { PeopleChapter } from "@/components/sections";
import { ButtonLink, Chapter, ChapterLabel, Container, PageIntro } from "@/components/ui";
import { Visual } from "@/components/visual";

export const metadata: Metadata = {
  title: "Talent: IT Staffing and Technical Recruitment",
  description:
    "IT staffing from Clynera Tech: contract, contract-to-hire, direct hire and dedicated squads for engineering, cloud, data and security roles, screened by practitioners.",
  alternates: { canonical: "/people" },
};

const models = [
  ["Contract", "A specialist for a defined stretch of delivery, ready to start quickly."],
  ["Contract-to-hire", "Work together first, then make it permanent when both sides are sure."],
  ["Direct hire", "A permanent search for roles that will shape your platform for years."],
  ["Dedicated squads", "A small team with its own lead, working inside your process."],
] as const;

export default function PeoplePage() {
  return (
    <>
      <PageIntro
        id="people-page-title"
        index="05"
        name="Talent"
        title="Specialists, matched to the route."
        lead="Clynera Tech is an IT staffing partner as well as a technology company. We find engineers, architects and specialists who have already walked the route your project needs."
      />

      <PeopleChapter index="05" headingId="people-page-roles" link={false} />

      <Chapter index="06" name="Talent" tone="dark" aria-labelledby="people-network-title" className="py-28 sm:py-36">
        <Container>
          <ChapterLabel index="06" name="Matching" tone="dark" />
          <div className="mt-6 grid items-end gap-12 lg:grid-cols-12">
            <h2 id="people-network-title" className="t-h2 text-paper lg:col-span-6">
              Where skills meet the work.
            </h2>
            <div className="lg:col-span-6">
              <Visual name="talent" sizes="(min-width: 1024px) 45vw, 100vw" />
            </div>
          </div>
          <div className="mt-16">
            <HumanNetwork />
          </div>
        </Container>
      </Chapter>

      <Chapter index="06" name="Hiring" aria-labelledby="hiring-title" className="py-28">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <ChapterLabel index="06" name="For employers" />
            <h2 id="hiring-title" className="t-h2 mt-6 text-ink-950">
              Hire for the problem, not the stack.
            </h2>
            <p className="t-lead mt-6 text-ink-600">
              We write each role with the people who will work beside the hire, ask practitioners to run the technical conversations, and suggest the engagement only once
              the problem is clear.
            </p>
            <ButtonLink href="/contact?topic=talent" className="mt-10">
              Request specialists
            </ButtonLink>
          </div>
          <ul className="grid gap-px self-start overflow-hidden rounded-[var(--radius-panel)] bg-ink-200 sm:grid-cols-2 lg:col-span-6">
            {models.map(([n, b]) => (
              <li key={n} className="bg-paper p-7">
                <h3 className="t-h3">{n}</h3>
                <p className="mt-2 text-ink-600">{b}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Chapter>

      <Chapter index="06" name="Careers" tone="dark" aria-labelledby="people-careers-title" className="py-28">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ChapterLabel index="06" name="Careers" tone="dark" />
            <h2 id="people-careers-title" className="t-h2 mt-6 text-paper">
              Looking for your next role?
            </h2>
            <p className="t-lead mt-6 text-ink-300">Search open roles, or join the talent network so we can reach out when the right route opens.</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/careers/jobs" tone="dark">
                Search jobs
              </ButtonLink>
              <ButtonLink href="/careers" variant="secondary" tone="dark">
                Careers at Clynera
              </ButtonLink>
            </div>
          </div>
          <p className="t-meta self-end text-ink-400 lg:col-span-5">Clynera Tech participates in E-Verify.</p>
        </Container>
      </Chapter>
    </>
  );
}
