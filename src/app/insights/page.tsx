import type { Metadata } from "next";
import Link from "next/link";
import { Chapter, Container, PageIntro, cx } from "@/components/ui";
import { Visual } from "@/components/visual";
import { formatDate, insights, readingMinutes } from "@/content/insights";

export const metadata: Metadata = {
  title: "Insights: Thinking Out Loud",
  description: "Points of view from Clynera Tech on AI in production, talent as a system, and adaptive software.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  return (
    <>
      <PageIntro id="insights-page-title" index="09" name="Insights" title="Thinking out loud." lead="What we believe about technology, talent and the systems between them." />
      <Chapter index="09" name="Articles" aria-label="Articles" className="pb-32">
        <Container>
          <ol className="grid gap-16 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((a, i) => {
              const lead = i === 0;
              return (
                <li key={a.slug} className={cx(lead && "md:col-span-2 lg:col-span-3")}>
                  <article className={cx("group relative", lead && "grid items-end gap-10 lg:grid-cols-12")}>
                    <Visual name={a.visual} className={cx(lead && "lg:col-span-7")} sizes={lead ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 30vw, 100vw"} />
                    <div className={cx(lead && "lg:col-span-5")}>
                      <p className="t-meta mt-6 text-ink-500">
                        {a.topic} <span aria-hidden="true">/</span> {formatDate(a.date)} <span aria-hidden="true">/</span> {readingMinutes(a)} min read
                      </p>
                      <h2 className={lead ? "t-h2 mt-4 text-[clamp(2rem,3.6vw,3.4rem)]" : "t-h3 mt-3"}>
                        <Link href={`/insights/${a.slug}`} className="after:absolute after:inset-0 group-hover:text-signal-700">
                          {a.title}
                        </Link>
                      </h2>
                      <p className="mt-4 text-ink-600">{a.dek}</p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </Container>
      </Chapter>
    </>
  );
}
