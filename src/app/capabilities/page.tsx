import type { Metadata } from "next";
import { CapabilityMap } from "@/components/capability-map";
import { IndustryWorld } from "@/components/industry-world";
import { Chapter, ChapterLabel, Container, PageIntro } from "@/components/ui";
import { Visual } from "@/components/visual";
import { capabilities, engagementModels } from "@/content/capabilities";
import { hasVisual } from "@/lib/visual-server";

export const metadata: Metadata = {
  title: "Capabilities: IT Services, IT Consulting and IT Staffing",
  description:
    "Nine routes through complex technology: AI, software, cloud, data, cybersecurity, automation, consulting, digital experience and IT staffing, from Clynera Tech in Dallas.",
  alternates: { canonical: "/capabilities" },
};

export default function CapabilitiesPage() {
  const images = Object.fromEntries(
    capabilities.filter((c) => c.visual && hasVisual(c.visual)).map((c) => [c.id, <Visual key={c.id} name={c.visual!} sizes="(min-width: 1024px) 40vw, 90vw" rounded={false} />]),
  );
  const groups = ["IT services", "IT consulting", "IT staffing"] as const;

  return (
    <>
      <PageIntro
        id="capabilities-page-title"
        index="03"
        name="Routes"
        title="Pick a route."
        lead="Nine capabilities across IT services, IT consulting and IT staffing. Each one is a route we travel with clients from the first question to a system that runs."
      />

      <Chapter index="03" name="Map" aria-label="Capability map" className="pb-28">
        <Container>
          <CapabilityMap images={images} />
        </Container>
      </Chapter>

      <Chapter index="03" name="Engineering" tone="dark" aria-labelledby="software-feature" className="py-24 sm:py-32">
        <Container className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ChapterLabel index="03" name="Engineering" tone="dark" />
            <h2 id="software-feature" className="t-h2 mt-6 text-paper">
              Built to be handed over.
            </h2>
            <p className="t-lead mt-6 text-ink-300">Small releases, tested and reviewed, documented well enough that your own team can carry on without us.</p>
          </div>
          <div className="lg:col-span-7">
            <Visual name="software" sizes="(min-width: 1024px) 55vw, 100vw" />
          </div>
        </Container>
      </Chapter>

      <Chapter index="03" name="In detail" aria-labelledby="all-capabilities" className="py-28 sm:py-36">
        <Container>
          <h2 id="all-capabilities" className="t-h2 max-w-[18ch] text-ink-950">
            The routes, in plain words.
          </h2>
          {groups.map((g) => (
            <section key={g} aria-labelledby={`group-${g.replace(/\s/g, "-")}`} className="mt-20">
              <h3 id={`group-${g.replace(/\s/g, "-")}`} className="t-meta flex items-center gap-3 border-b border-ink-200 pb-4 text-ink-500">
                <span aria-hidden="true" className="node" />
                {g}
              </h3>
              <ul className="divide-y divide-ink-200">
                {capabilities
                  .filter((c) => c.category === g)
                  .map((c) => (
                    <li key={c.id} className="grid gap-6 py-10 lg:grid-cols-12">
                      <h4 className="t-h3 lg:col-span-3">{c.name}</h4>
                      <div className="lg:col-span-5">
                        <p className="font-semibold text-ink-900">{c.line}</p>
                        <p className="mt-3 leading-relaxed text-ink-600">{c.body}</p>
                      </div>
                      <ul className="space-y-2 lg:col-span-4" aria-label={`${c.name} services`}>
                        {c.deliver.map((d) => (
                          <li key={d} className="flex items-start gap-3 text-[0.95rem] text-ink-800">
                            <span aria-hidden="true" className="node mt-2 bg-ink-900" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </Container>
      </Chapter>

      <Chapter index="03" name="Engagement" aria-labelledby="engage-title" className="bg-paper-2 py-28">
        <Container>
          <h2 id="engage-title" className="t-h2 text-ink-950">
            Four ways to travel with us.
          </h2>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-panel)] bg-ink-200 sm:grid-cols-2 lg:grid-cols-4">
            {engagementModels.map((m, i) => (
              <li key={m.name} className="bg-paper p-8">
                <p aria-hidden="true" className="t-meta text-ink-500">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="t-h3 mt-6">{m.name}</h3>
                <p className="mt-3 leading-relaxed text-ink-600">{m.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Chapter>

      <Chapter index="08" name="Industries" tone="dark" aria-labelledby="cap-industries-title" className="overflow-clip">
        <IndustryWorld headingId="cap-industries-title" band={<Visual name="industries" rounded={false} sizes="170vw" />} />
      </Chapter>
    </>
  );
}
