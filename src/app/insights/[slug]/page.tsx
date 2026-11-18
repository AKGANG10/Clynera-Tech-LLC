import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLink, Chapter, ChapterLabel, Container } from "@/components/ui";
import { Visual } from "@/components/visual";
import { findInsight, formatDate, insights, readingMinutes } from "@/content/insights";
import { company, siteUrl } from "@/content/site";

export function generateStaticParams() {
  return insights.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = findInsight(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.dek,
    alternates: { canonical: `/insights/${a.slug}` },
    openGraph: { type: "article", title: a.title, description: a.dek, publishedTime: a.date },
  };
}

export default async function InsightPage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const a = findInsight(slug);
  if (!a) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.dek,
    datePublished: a.date,
    author: { "@type": "Organization", name: company.legalName },
    publisher: { "@type": "Organization", name: company.legalName, logo: { "@type": "ImageObject", url: `${siteUrl}/brand/clynera-logo.png` } },
    mainEntityOfPage: `${siteUrl}/insights/${a.slug}`,
  };
  const titleId = `article-${a.slug}`;
  return (
    <Chapter index="09" name="Insights" aria-labelledby={titleId} className="pt-[calc(var(--header-h)+4rem)] pb-28">
      <article>
        <Container className="max-w-4xl">
          <ChapterLabel index="09" name={a.topic} />
          <h1 id={titleId} className="t-h2 mt-8 text-ink-950">
            {a.title}
          </h1>
          <p className="t-lead mt-6 text-ink-600">{a.dek}</p>
          <p className="t-meta mt-8 text-ink-500">
            {company.shortName} <span aria-hidden="true">/</span> <time dateTime={a.date}>{formatDate(a.date)}</time> <span aria-hidden="true">/</span> {readingMinutes(a)} min read
          </p>
        </Container>
        <Container className="mt-14 max-w-6xl">
          <Visual name={a.visual} priority sizes="(min-width: 1152px) 1100px, 100vw" />
        </Container>
        <Container className="mt-16 max-w-3xl">
          <div className="space-y-6 text-[1.12rem] leading-[1.75] text-ink-800">
            {a.body.map((b, i) => (
              <div key={i}>
                {b.h ? <h2 className="t-h3 mt-12 mb-4 text-ink-950">{b.h}</h2> : null}
                <p className={i === 0 ? "t-lead text-ink-900" : undefined}>{b.p}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 border-t border-ink-200 pt-8">
            <ArrowLink href="/insights">All insights</ArrowLink>
          </div>
        </Container>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </Chapter>
  );
}
