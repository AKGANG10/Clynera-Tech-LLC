import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiryForm } from "@/components/inquiry-form";
import { Chapter, ChapterLabel, Container } from "@/components/ui";
import { company, formattedAddress } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact: Talk to a Guide",
  description: `Tell Clynera Tech where your technology, hiring or partnership is stuck. ${formattedAddress}. ${company.phone.display}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Chapter index="11" name="Contact" aria-labelledby="contact-title" className="pt-[calc(var(--header-h)+4rem)] pb-28">
      <Container className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ChapterLabel index="11" name="Next step" />
          <h1 id="contact-title" className="t-h1 mt-8 text-ink-950">
            Tell us where you&apos;re stuck.
          </h1>
          <p className="t-lead mt-8 max-w-md text-ink-600">Pick a direction, add a few lines, and a guide from our team will reply by email.</p>
          <dl className="mt-14 space-y-6 border-t border-ink-200 pt-8">
            <div>
              <dt className="t-meta text-ink-500">Email</dt>
              <dd className="mt-1">
                <a className="link-line text-lg font-semibold text-ink-950" href={`mailto:${company.email}`}>
                  {company.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="t-meta text-ink-500">Phone</dt>
              <dd className="mt-1">
                <a className="link-line text-lg font-semibold text-ink-950" href={company.phone.href}>
                  {company.phone.display}
                </a>
              </dd>
            </div>
            <div>
              <dt className="t-meta text-ink-500">Office</dt>
              <dd className="mt-1 text-ink-800">
                {company.address.street}
                <br />
                {company.address.locality}, {company.address.region} {company.address.postalCode}
              </dd>
            </div>
          </dl>
        </div>
        <div className="lg:col-span-7">
          <Suspense fallback={<p className="text-ink-500">Loading the form.</p>}>
            <InquiryForm />
          </Suspense>
        </div>
      </Container>
    </Chapter>
  );
}
