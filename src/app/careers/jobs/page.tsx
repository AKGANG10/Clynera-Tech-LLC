import type { Metadata } from "next";
import { JobSearch } from "@/components/job-search";
import { ArrowLink, Chapter, ChapterLabel, Container } from "@/components/ui";
import { jobs } from "@/content/jobs";
import { company, siteUrl } from "@/content/site";

export const metadata: Metadata = {
  title: "Search Jobs: Open Technology Roles",
  description: "Search open contract, contract-to-hire and full-time technology roles placed by Clynera Tech, or join the talent network.",
  alternates: { canonical: "/careers/jobs" },
};

const employmentType = { contract: "CONTRACTOR", "contract-to-hire": "CONTRACTOR", "full-time": "FULL_TIME" } as const;

export default function JobsPage() {
  // Google JobPosting data for real, listed roles only.
  const postings = jobs.map((j) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: j.title,
    description: [j.summary, ...j.responsibilities, ...j.requirements].join(" "),
    datePosted: j.posted,
    ...(j.validThrough ? { validThrough: j.validThrough } : {}),
    employmentType: employmentType[j.type],
    hiringOrganization: { "@type": "Organization", name: company.legalName, sameAs: siteUrl },
    ...(j.mode === "remote"
      ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "United States" } }
      : { jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: j.location, addressCountry: "US" } } }),
    identifier: { "@type": "PropertyValue", name: company.shortName, value: j.id },
    url: `${siteUrl}/careers/jobs#job-${j.id}`,
  }));

  return (
    <Chapter index="C" name="Search jobs" aria-labelledby="jobs-title" className="pt-[calc(var(--header-h)+4rem)] pb-28">
      <Container>
        <ArrowLink href="/careers" className="mb-10">
          Careers
        </ArrowLink>
        <ChapterLabel index="C" name="Search jobs" />
        <h1 id="jobs-title" className="t-h1 mt-8 max-w-[14ch] text-ink-950">
          Open roles.
        </h1>
        <p className="t-lead mt-6 max-w-2xl text-ink-600">Search technology roles placed by Clynera Tech. Every listing is a real, current opening.</p>
        <div className="mt-14">
          <JobSearch jobs={jobs} />
        </div>
      </Container>
      {postings.map((p) => (
        <script key={p.identifier.value} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(p).replace(/</g, "\\u003c") }} />
      ))}
    </Chapter>
  );
}
