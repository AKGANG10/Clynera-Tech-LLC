import Link from "next/link";
import { insights, formatDate, readingMinutes } from "@/content/insights";
import { contactTopics } from "@/content/site";
import { concepts, moreRoles, roles, story } from "@/content/world";
import { Arrow, ArrowLink, ButtonLink, Chapter, ChapterLabel, Container, cx } from "./ui";
import { Visual } from "./visual";

/*
 * Server-rendered chapters shared by the home page and inner pages. Each
 * answers one question: who builds it, can you prove it, what do you believe,
 * why do you exist, what happens next.
 */

/** People: technology is built by people. Hanging editorial frames at different heights. */
export function PeopleChapter({ index = "05", headingId = "people-title", link = true }: { index?: string; headingId?: string; link?: boolean }) {
  // Wire lengths (rem): a gallery wall of frames hung at different heights.
  const drops = [2, 8, 4, 11, 2.5, 6.5];
  return (
    <Chapter index={index} name="People" aria-labelledby={headingId} className="overflow-hidden py-28 sm:py-40">
      <Container>
        <ChapterLabel index={index} name="People" />
        <h2 id={headingId} className="t-display mt-10 max-w-[12ch] text-ink-950">
          Technology is built by <span className="text-signal-700">people.</span>
        </h2>
        <p className="t-lead mt-10 max-w-xl text-ink-600">
          After all the systems, this is the part that decides whether they work. The people we work through, and the people we place, are the product.
        </p>
      </Container>

      <div className="container-x mt-20">
        <ul className="grid grid-cols-2 gap-x-5 gap-y-12 border-t border-ink-300 md:grid-cols-3 lg:grid-cols-6">
          {roles.map((r, i) => (
            <li key={r.id} className="relative" style={{ ["--drop" as string]: `${drops[i]}rem` }}>
              <div className="relative">
                {/* The wire the frame hangs from. */}
                <span aria-hidden="true" className="mx-auto block h-[var(--drop)] w-px bg-ink-300 max-md:h-8" />
                <Visual name={r.visual} sizes="(min-width: 1024px) 16vw, 45vw" className="shadow-[var(--shadow-lift)]" />
                <p className="t-label mt-4 text-[0.82rem] text-ink-950">{r.name}</p>
                <p className="mt-1 text-[0.92rem] leading-snug text-ink-600">{r.line}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="t-meta mt-16 text-ink-500">
          Also: {moreRoles.join(" · ")}
          {link ? (
            <>
              {" "}
              <span aria-hidden="true">/</span>{" "}
              <Link href="/people" className="link-line text-signal-700">
                Meet the network
              </Link>
            </>
          ) : null}
        </p>
      </div>
    </Chapter>
  );
}

/** Work: ideas are easy, execution isn't. Concepts are labelled as concepts. */
export function WorkChapter({ index = "06", headingId = "work-title", limit = 3, full = false }: { index?: string; headingId?: string; limit?: number; full?: boolean }) {
  return (
    <Chapter index={index} name="Work" aria-labelledby={headingId} className="overflow-hidden bg-chalk py-28 sm:py-36">
      <Container>
        <ChapterLabel index={index} name="Work" />
        <h2 id={headingId} className="sr-only">
          Ideas are easy. Execution isn&apos;t.
        </h2>
        <p aria-hidden="true" className="t-display slide-in-left mt-10 text-ink-950">
          Ideas are easy.
        </p>
        <p aria-hidden="true" className="t-display slide-in-right mt-2 text-right text-signal-700">
          Execution isn&apos;t.
        </p>
      </Container>

      <Container className="mt-24">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ink-200 pb-6">
          <h3 className="t-h2 text-[clamp(1.8rem,3.4vw,3.2rem)] text-ink-950">What we can build</h3>
          <p className="t-meta rounded-full border border-ink-300 px-3 py-1.5 text-ink-600">Concept / Exploration, not client work</p>
        </div>
        <ol className="divide-y divide-ink-200">
          {concepts.slice(0, limit).map((c, i) => (
            <li key={c.id} className="rise grid gap-8 py-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="t-meta text-ink-500">
                  <span aria-hidden="true">{String(i + 1).padStart(2, "0")} / </span>
                  {c.field}
                </p>
                <h4 className="t-h3 mt-4 max-w-sm text-ink-950">{c.title}</h4>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technology">
                  {c.technology.map((t) => (
                    <li key={t} className="t-meta rounded-full bg-paper-2 px-3 py-1.5 text-ink-700">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <dl className="grid gap-6 sm:grid-cols-3 lg:col-span-8">
                {(
                  [
                    ["Problem", c.problem],
                    ["Approach", c.approach],
                    ["Intended outcome", c.outcome],
                  ] as const
                ).map(([k, v], j) => (
                  <div key={k} className="relative border-t-2 border-ink-900 pt-4">
                    {j < 2 ? <Arrow className="absolute top-[-0.6rem] -right-3 hidden size-4 bg-chalk text-ink-900 sm:block" /> : null}
                    <dt className={cx("t-meta", j === 2 ? "text-signal-700" : "text-ink-500")}>{k}</dt>
                    <dd className="mt-3 leading-relaxed text-ink-700">{v}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ol>
        {!full ? <ArrowLink href="/work" className="mt-6">How we work</ArrowLink> : null}
      </Container>
    </Chapter>
  );
}

/** Insights: thinking out loud, laid out like a magazine. */
export function InsightsChapter({ index = "08", headingId = "insights-title" }: { index?: string; headingId?: string }) {
  const [lead, ...rest] = insights;
  return (
    <Chapter index={index} name="Insights" aria-labelledby={headingId} className="py-28 sm:py-36">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <ChapterLabel index={index} name="Insights" />
            <h2 id={headingId} className="t-h2 mt-6 text-ink-950">
              Thinking out loud.
            </h2>
          </div>
          <ArrowLink href="/insights">All insights</ArrowLink>
        </div>
        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <article className="group relative lg:col-span-7">
            <Visual name={lead.visual} sizes="(min-width: 1024px) 55vw, 100vw" />
            <p className="t-meta mt-6 text-ink-500">
              {lead.topic} <span aria-hidden="true">/</span> {formatDate(lead.date)} <span aria-hidden="true">/</span> {readingMinutes(lead)} min read
            </p>
            <h3 className="t-h3 mt-3 max-w-xl text-[clamp(1.6rem,2.6vw,2.4rem)] text-ink-950">
              <Link href={`/insights/${lead.slug}`} className="after:absolute after:inset-0 group-hover:text-signal-700">
                {lead.title}
              </Link>
            </h3>
            <p className="mt-3 max-w-lg text-ink-600">{lead.dek}</p>
          </article>
          <div className="grid gap-10 lg:col-span-5">
            {rest.map((a) => (
              <article key={a.slug} className="group relative grid grid-cols-5 gap-5">
                <Visual name={a.visual} className="col-span-2" sizes="(min-width: 1024px) 16vw, 40vw" />
                <div className="col-span-3">
                  <p className="t-meta text-ink-500">
                    {a.topic} <span aria-hidden="true">/</span> {readingMinutes(a)} min read
                  </p>
                  <h3 className="t-label mt-2 text-[1.05rem] leading-snug tracking-normal normal-case">
                    <Link href={`/insights/${a.slug}`} className="after:absolute after:inset-0 group-hover:text-signal-700">
                      {a.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-[0.92rem] text-ink-600">{a.dek}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </Chapter>
  );
}

/** Company: the story as progress. */
export function StoryTimeline({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <ol className="relative grid gap-10 lg:grid-cols-5 lg:gap-6">
      <span aria-hidden="true" className={cx("absolute top-[0.3rem] right-0 left-0 hidden h-px lg:block", dark ? "bg-ink-700" : "bg-ink-300")} />
      {story.map((s, i) => (
        <li key={s.stage} className="relative">
          <span aria-hidden="true" className={cx("node relative", i === story.length - 1 ? "bg-signal-500" : dark ? "bg-paper" : "bg-ink-900")} />
          <p className={cx("t-meta mt-6", dark ? "text-ink-400" : "text-ink-500")}>{s.stage}</p>
          <h3 className={cx("t-h3 mt-3", dark ? "text-paper" : "text-ink-950")}>{s.title}</h3>
          <p className={cx("mt-3 text-[0.96rem] leading-relaxed", dark ? "text-ink-300" : "text-ink-600")}>{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

/** The contact experience: everything goes quiet, one question. */
export function ContactChapter({ index = "10" }: { index?: string }) {
  return (
    <Chapter index={index} name="Contact" aria-labelledby="ask-title" className="py-36 sm:py-52">
      <Container className="text-center">
        <h2 id="ask-title" className="t-display mx-auto max-w-[11ch] text-ink-950">
          So, what are we building?
        </h2>
        <ButtonLink href="/contact" className="mt-14">
          Start a conversation
        </ButtonLink>
        <ul className="mx-auto mt-16 flex max-w-3xl flex-wrap justify-center gap-x-10 gap-y-4">
          {contactTopics.map((t) => (
            <li key={t.topic}>
              <Link href={`/contact?topic=${t.topic}`} className="group t-label inline-flex items-center gap-2 text-[0.85rem] text-ink-700 hover:text-ink-950">
                <span aria-hidden="true" className="node bg-ink-300 transition-colors group-hover:bg-signal-500" />
                <span className="link-line">{t.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Chapter>
  );
}
