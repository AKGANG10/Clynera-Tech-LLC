import type { Metadata } from "next";
import { BuildSequence } from "@/components/build-sequence";
import { CapabilityMap } from "@/components/capability-map";
import { HumanNetwork } from "@/components/human-network";
import { IndustryWorld } from "@/components/industry-world";
import { ContactChapter, InsightsChapter, PeopleChapter, StoryTimeline, WorkChapter } from "@/components/sections";
import { SystemHero } from "@/components/system-hero";
import { SystemMap } from "@/components/system-map";
import { ArrowLink, Chapter, ChapterLabel, Container } from "@/components/ui";
import { Visual } from "@/components/visual";
import { capabilities } from "@/content/capabilities";
import { hasVisual } from "@/lib/visual-server";

export const metadata: Metadata = {
  title: { absolute: "Clynera Tech | IT Services, IT Consulting and IT Staffing in Dallas" },
  alternates: { canonical: "/" },
};

/**
 * The journey: dormant, awaken, discover, connect, build, prove, act.
 * Rhythm: quiet hero, big statement, interactive map, cinematic build,
 * human people, technical network, editorial work, cinematic industries,
 * editorial insights, story, quiet question, signature ending (footer).
 */
export default function Home() {
  const capabilityImages = Object.fromEntries(
    capabilities.filter((c) => c.visual && hasVisual(c.visual)).map((c) => [c.id, <Visual key={c.id} name={c.visual!} sizes="(min-width: 1024px) 40vw, 90vw" rounded={false} />]),
  );

  return (
    <>
      <SystemHero
        hasImage={hasVisual("heroDesktop")}
        imageDesktop={<Visual name="heroDesktop" priority rounded={false} className="!absolute inset-0 !aspect-auto size-full" sizes="100vw" />}
        imageMobile={<Visual name="heroMobile" rounded={false} className="!absolute inset-0 !aspect-auto size-full" sizes="100vw" />}
      />

      {/* Transition: everything connects. A cinematic strip between the dark hero and the light system. */}
      <div aria-hidden="true" className="bg-ink-950">
        <Visual name="connects" rounded={false} sizes="100vw" className="max-sm:!aspect-[21/7]" />
      </div>

      <Chapter id="system" index="02" name="System" aria-labelledby="system-title">
        <SystemMap core={<Visual name="core" rounded={false} sizes="(min-width: 1024px) 22rem, 46vw" />} />
      </Chapter>

      <Chapter index="03" name="Capabilities" aria-labelledby="capabilities-title" className="border-t border-ink-200 py-28 sm:py-36">
        <Container>
          <ChapterLabel index="03" name="Capabilities" />
          <h2 id="capabilities-title" className="t-h2 mt-6 max-w-[16ch] text-ink-950">
            What we build.
          </h2>
          <p className="t-lead mt-6 max-w-2xl text-ink-600">IT services, IT consulting and IT staffing, as one map. Choose a capability to see how it works.</p>
          <div className="mt-16">
            <CapabilityMap images={capabilityImages} detailHref="/capabilities" />
          </div>
        </Container>
      </Chapter>

      <Chapter index="04" name="Build" tone="dark" aria-labelledby="build-title">
        <BuildSequence />
      </Chapter>

      <PeopleChapter />

      <Chapter index="06" name="Network" tone="dark" aria-labelledby="network-title" className="overflow-hidden py-28 sm:py-36">
        <div aria-hidden="true" className="absolute inset-0 opacity-30">
          <Visual name="talent" rounded={false} className="!absolute inset-0 !aspect-auto size-full" sizes="100vw" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#07112f_10%,rgb(7_17_47/0.6)_60%,rgb(7_17_47/0.85))]" />
        </div>
        <Container className="relative">
          <ChapterLabel index="06" name="Network" tone="dark" />
          <h2 id="network-title" className="t-h2 mt-6 max-w-[14ch] text-paper">
            The human network.
          </h2>
          <p className="t-lead mt-6 max-w-2xl text-ink-300">
            Recruiting is a system, not a search. People connect to skills, skills to roles, roles to projects, and projects to the companies and opportunities that need
            them. Choose any point to follow its paths.
          </p>
          <div className="mt-16">
            <HumanNetwork />
          </div>
          <ArrowLink href="/people" tone="dark" className="mt-12">
            Talent and careers
          </ArrowLink>
        </Container>
      </Chapter>

      <WorkChapter index="07" />

      <Chapter index="08" name="Industries" tone="dark" aria-labelledby="industries-title" className="overflow-clip">
        <IndustryWorld index="08" band={<Visual name="industries" rounded={false} sizes="170vw" />} />
      </Chapter>

      <InsightsChapter index="09" />

      <Chapter index="10" name="Company" aria-labelledby="story-title" className="border-t border-ink-200 bg-paper-2 py-28 sm:py-36">
        <Container>
          <ChapterLabel index="10" name="Company" />
          <h2 id="story-title" className="t-h2 mt-6 max-w-[18ch] text-ink-950">
            Built around one idea.
          </h2>
          <div className="mt-16">
            <StoryTimeline />
          </div>
          <ArrowLink href="/company" className="mt-14">
            About Clynera Tech
          </ArrowLink>
        </Container>
      </Chapter>

      <ContactChapter index="11" />
    </>
  );
}
