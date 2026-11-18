import type { VisualKey } from "./visuals";

/**
 * Point-of-view articles. Opinion pieces drafted for Clynera Tech on
 * 2026-11-19 and awaiting owner review (docs/CONTENT_INVENTORY.md).
 * They argue a view; they cite no statistics and describe no client work.
 */
export type Block = { h?: string; p: string };

export type Insight = {
  slug: string;
  title: string;
  dek: string;
  topic: string;
  date: string;
  visual: VisualKey;
  body: Block[];
};

export const insights: Insight[] = [
  {
    slug: "why-ai-projects-stall-before-production",
    title: "Why AI projects stall before they reach production",
    dek: "The model is rarely the problem. The system around it usually is.",
    topic: "AI",
    date: "2026-11-19",
    visual: "insight1",
    body: [
      {
        p: "A demo is a promise made under perfect conditions. The data is clean, the questions are friendly and nobody asks what happens when the model is wrong. Production is the opposite of all three.",
      },
      {
        h: "The demo answers the wrong question",
        p: "Most AI pilots are built to answer \"can a model do this?\" The answer is usually yes. The question that decides whether a project ships is different: can this organization run it, every day, with people who trust it? That question is about ownership, data and failure, and a demo is not designed to answer it.",
      },
      {
        h: "Data is a dependency, not an input",
        p: "In a pilot, data is something you export once. In production it is a live dependency with owners, schedules, quality problems and permissions. If nobody owns the pipeline that feeds the model, the model quietly degrades and nobody notices until a customer does.",
      },
      {
        h: "Wrong answers need a destination",
        p: "Every useful AI system is wrong some of the time. The difference between a liability and a tool is what happens next. Uncertain outputs should go somewhere: a review queue, a person, a safe default. Designing that path is unglamorous work, and it is usually the work that was skipped.",
      },
      {
        h: "What we do differently",
        p: "We start with the workflow, not the model. We decide who reviews what, what the system does when it is unsure and how we will know it is drifting. Then we build the smallest version that can run for real, measure it and grow it. It is slower to demo and much faster to ship.",
      },
    ],
  },
  {
    slug: "the-talent-problem-is-a-system-problem",
    title: "The talent problem is actually a system problem",
    dek: "Hiring faster will not fix a team that was never designed.",
    topic: "Talent",
    date: "2026-11-19",
    visual: "insight2",
    body: [
      {
        p: "When a technology roadmap slips, the diagnosis is often the same: we need more people. Sometimes that is true. More often the roadmap is short of something harder to recruit for, which is a team shaped for the work in front of it.",
      },
      {
        h: "A job description is a design document",
        p: "Many roles are written as a list of tools. But tools are the easiest part of a role to learn. The hard parts are the decisions the person will own, the systems they will be accountable for and the people they will depend on. Write those down and the search changes completely.",
      },
      {
        h: "Skills connect, keywords don't",
        p: "A strong data engineer and a strong cloud engineer can look identical on a keyword search and be useless in each other's seats. Good recruiting maps how skills connect to roles, roles to projects and projects to outcomes. That map is what lets the right person find the right work.",
      },
      {
        h: "Capacity and capability are different problems",
        p: "Sometimes a team needs hands for six months. Sometimes it needs a person who will still be shaping the platform in five years. Treating both as \"a hire\" leads to the wrong contract, the wrong expectations and the wrong person. Contract, contract-to-hire and direct hire exist because the problems are different.",
      },
      {
        h: "How we approach it",
        p: "We treat talent as part of the system we are building. The people who define a role are the people who will work with whoever fills it. The screening is done by practitioners. And the engagement model is chosen for the problem, not for convenience.",
      },
    ],
  },
  {
    slug: "what-happens-when-software-becomes-adaptive",
    title: "What happens when software becomes adaptive",
    dek: "Software used to be finished at launch. That is no longer true.",
    topic: "Software",
    date: "2026-11-19",
    visual: "insight3",
    body: [
      {
        p: "For most of its history, software has been a set of fixed instructions. You decided what it should do, you built it, you shipped it and it did exactly that until someone changed the code. Adaptive systems break that contract, and most organizations are not set up for what comes next.",
      },
      {
        h: "Behavior becomes a moving target",
        p: "When parts of a system learn from data, its behavior can change without a release. That is the point, and it is also the risk. Teams need to know what changed, why and whether it was an improvement. Version control for code is no longer enough; you need it for data, models and decisions too.",
      },
      {
        h: "Testing becomes continuous",
        p: "A test suite that passes on launch day says less about an adaptive system than it does about a fixed one. Evaluation has to run all the time, against real situations, with clear thresholds for when a person must step in.",
      },
      {
        h: "Interfaces have to explain themselves",
        p: "If software can make a different suggestion tomorrow than it made today, people need to understand why. Showing confidence, sources and the path to a human is not a nice extra. It is what makes adaptive software usable at work.",
      },
      {
        h: "The opportunity",
        p: "Done well, adaptive software gets better at its job the longer it runs. That is a genuine shift in what technology can do for a business. The organizations that benefit will be the ones that treat it as a system to operate, not a project to finish.",
      },
    ],
  },
];

export const findInsight = (slug: string) => insights.find((i) => i.slug === slug);

export const readingMinutes = (i: Insight) => Math.max(1, Math.round(i.body.reduce((n, b) => n + b.p.split(/\s+/).length + (b.h?.split(/\s+/).length ?? 0), 0) / 220));

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`));
