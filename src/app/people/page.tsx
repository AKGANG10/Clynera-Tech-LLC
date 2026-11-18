import type { Metadata } from "next";
import { HumanNetwork } from "@/components/human-network";
import { PeopleChapter } from "@/components/sections";
import { ButtonLink, Chapter, ChapterLabel, Container, PageIntro } from "@/components/ui";
import { Visual } from "@/components/visual";

export const metadata: Metadata = {
  title: "People: IT Staffing, Recruitment and Careers",
  description:
    "IT staffing and recruitment from Clynera Tech: contract, contract-to-hire, direct hire and dedicated teams. Technology professionals can join our talent network.",
  alternates: { canonical: "/people" },
};

const models = [
  ["Contract", "Specialists for a defined period of delivery."],
  ["Contract-to-hire", "Work together first, then decide on a permanent role."],
  ["Direct hire", "Permanent hires for roles that will shape your platform."],
  ["Dedicated teams", "A team that plugs into your delivery and rituals."],
] as const;

export default function PeoplePage() {
  return (
    <>
      <PageIntro
        id="people-page-title"
        index="05"
        name="People"
        title="The people are the product."
        lead="Clynera Tech is an IT staffing and recruitment partner as well as a technology company. We connect engineers, architects and specialists to the work that needs them."
      />

      <PeopleChapter index="05" headingId="people-page-roles" link={false} />

      <Chapter index="06" name="Network" tone="dark" aria-labelledby="people-network-title" className="py-28 sm:py-36">
        <Container>
          <ChapterLabel index="06" name="Network" tone="dark" />
          <div className="mt-6 grid items-end gap-12 lg:grid-cols-12">
            <h2 id="people-network-title" className="t-h2 text-paper lg:col-span-6">
              The human network.
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
              Hire for the system you are building.
            </h2>
            <p className="t-lead mt-6 text-ink-600">
              Contract, contract-to-hire and direct-hire recruitment for technology roles. Roles are defined with the people who will work alongside the hire, and screened by
              practitioners.
            </p>
            <ButtonLink href="/contact?topic=talent" className="mt-10">
              Request talent
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

      <Chapter index="06" name="Careers" tone="dark" aria-labelledby="careers-title" className="py-28">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ChapterLabel index="06" name="Careers" tone="dark" />
            <h2 id="careers-title" className="t-h2 mt-6 text-paper">
              Join the network.
            </h2>
            <p className="t-lead mt-6 text-ink-300">
              Technology professionals can join our talent network. Tell us your skills and the work you want, and we will contact you when a role matches. We do not ask for
              resumes or identity documents through this website.
            </p>
            <ButtonLink href="/contact?topic=careers" tone="dark" className="mt-10">
              Join the talent network
            </ButtonLink>
          </div>
          <p className="t-meta self-end text-ink-400 lg:col-span-5">Clynera Tech participates in E-Verify.</p>
        </Container>
      </Chapter>
    </>
  );
}
