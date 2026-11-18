import type { Metadata } from "next";
import { ButtonLink, Chapter, ChapterLabel, Container, PageIntro } from "@/components/ui";
import { jobs } from "@/content/jobs";

export const metadata: Metadata = {
  title: "Careers: Technology Roles and Talent Network",
  description:
    "Find contract, contract-to-hire and full-time technology roles through Clynera Tech, or join the talent network for engineering, cloud, data, security and AI roles.",
  alternates: { canonical: "/careers" },
};

const steps = [
  { name: "Share your route", body: "Tell us your skills, the work you want next and how you like to work. A short form, no resume upload." },
  { name: "We map the match", body: "A practitioner reviews your profile against open and upcoming roles, not a keyword filter." },
  { name: "Meet the team", body: "Interviews are with the people you would actually work with, so both sides know what to expect." },
  { name: "Start well", body: "Clear terms, a clear first week, and employment eligibility confirmed through E-Verify." },
] as const;

const families = [
  "Software engineering",
  "Cloud and DevOps",
  "Data and analytics",
  "Cybersecurity",
  "AI and machine learning",
  "QA and test automation",
  "Product and UX design",
  "Project and delivery management",
] as const;

const types = [
  { name: "Contract", body: "Defined projects with a clear start and finish." },
  { name: "Contract-to-hire", body: "Try the team and the work before committing." },
  { name: "Full-time", body: "Permanent roles with long-term ownership." },
] as const;

export default function CareersPage() {
  const open = jobs.length;
  return (
    <>
      <PageIntro
        id="careers-page-title"
        index="C"
        name="Careers"
        title="Find your next route."
        lead="Clynera Tech places engineers, architects and data, cloud and security specialists in contract, contract-to-hire and full-time roles across the United States."
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/careers/jobs">{open ? `Search ${open} open ${open === 1 ? "role" : "roles"}` : "Search jobs"}</ButtonLink>
          <ButtonLink href="/contact?topic=careers" variant="secondary">
            Join the talent network
          </ButtonLink>
        </div>
      </PageIntro>

      <Chapter index="C" name="How it works" tone="dark" aria-labelledby="careers-steps-title" className="py-28">
        <Container>
          <ChapterLabel index="C" name="How it works" tone="dark" />
          <h2 id="careers-steps-title" className="t-h2 mt-6 max-w-[16ch] text-paper">
            Four steps, no guesswork.
          </h2>
          <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.name} className="border-t border-ink-700 pt-6">
                <p aria-hidden="true" className="t-meta text-signal-300">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="t-h3 mt-4 text-paper">{s.name}</h3>
                <p className="mt-3 leading-relaxed text-ink-300">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Chapter>

      <Chapter index="C" name="Roles" aria-labelledby="careers-families-title" className="py-28">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="careers-families-title" className="t-h2 text-ink-950">
              Roles we recruit for.
            </h2>
            <p className="t-lead mt-6 text-ink-600">If your work lives in one of these areas, we would like to know you, even before the right role is posted.</p>
          </div>
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:col-span-7">
            {families.map((f) => (
              <li key={f} className="flex items-center gap-3 border-b border-ink-200 py-4 text-[1.02rem] text-ink-900">
                <span aria-hidden="true" className="node" />
                {f}
              </li>
            ))}
          </ul>
        </Container>
      </Chapter>

      <Chapter index="C" name="Engagements" aria-labelledby="careers-types-title" className="bg-paper-2 py-24">
        <Container>
          <h2 id="careers-types-title" className="t-h2 text-ink-950">
            Three ways to work.
          </h2>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-panel)] bg-ink-200 md:grid-cols-3">
            {types.map((t) => (
              <li key={t.name} className="bg-paper p-8">
                <h3 className="t-h3">{t.name}</h3>
                <p className="mt-2 text-ink-600">{t.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-14 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <h3 className="t-label text-[0.82rem] text-ink-900">What we ask for</h3>
              <p className="mt-3 text-ink-600">Your name, email, location, the roles you want, your main skills and, if you like, a link to a profile or portfolio.</p>
            </div>
            <div className="lg:col-span-6">
              <h3 className="t-label text-[0.82rem] text-ink-900">What this website never asks for</h3>
              <p className="mt-3 text-ink-600">Resumes, identity documents, bank details or payment of any kind. If someone asks for these in our name, please email hr@clyneratech.com.</p>
            </div>
          </div>
        </Container>
      </Chapter>
    </>
  );
}
