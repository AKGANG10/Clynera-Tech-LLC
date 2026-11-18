import type { VisualKey } from "./visuals";

/**
 * Field notes: point-of-view articles drafted for Clynera Tech on 2026-11-19,
 * awaiting owner review (docs/CONTENT_INVENTORY.md). They argue a view; they
 * cite no statistics and describe no client work.
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
    slug: "start-your-ai-project-with-a-spreadsheet",
    title: "Start your next AI project with a spreadsheet",
    dek: "Before choosing a model, write down the decision you want to make faster.",
    topic: "AI",
    date: "2026-11-19",
    visual: "insight1",
    body: [
      {
        p: "The most useful AI conversations we have do not begin with models, vendors or prompts. They begin with a plain spreadsheet: one row per decision a team makes every week, and a few honest columns next to it.",
      },
      {
        h: "List the decisions, not the dreams",
        p: "Which requests get approved? Which documents need a second look? Which customer is likely to call back angry? Write each decision as a sentence. If you cannot write it down, you cannot measure whether AI made it better.",
      },
      {
        h: "Add four columns",
        p: "How often does it happen? How long does it take today? What does a wrong answer cost? Where does the information live? Ten minutes with these columns usually shows that two or three rows matter far more than the rest.",
      },
      {
        h: "Pick the boring winner",
        p: "The best first project is rarely the most exciting row. It is the frequent, well-documented decision where a mistake is cheap and a person can easily check the answer. That is where a model earns trust quickly, and trust is what the second project needs.",
      },
      {
        h: "Then, and only then, pick the tools",
        p: "With one decision chosen, the technical questions become small and concrete: which data, which model, which review step, which metric. The spreadsheet has done the strategy work. The engineering can finally be about engineering.",
      },
    ],
  },
  {
    slug: "hire-for-the-problem-not-the-stack",
    title: "Hire for the problem, not the stack",
    dek: "A list of tools describes a job badly. The problem describes it well.",
    topic: "Talent",
    date: "2026-11-19",
    visual: "insight2",
    body: [
      {
        p: "Most technology job descriptions read like a shopping list: five languages, three clouds, a framework or two. They attract people who match the list, which is not the same as people who can solve the problem the role exists for.",
      },
      {
        h: "Start with the first ninety days",
        p: "What should this person have fixed, shipped or untangled three months from now? Write that paragraph first. It tells candidates what success looks like, and it tells interviewers what to test.",
      },
      {
        h: "Tools are learnable; judgment is rarer",
        p: "A strong engineer moves between similar tools in weeks. What takes years is knowing when a quick fix will hurt later, how to read an unfamiliar codebase, and when to ask for help. Screening for those habits finds better people than screening for keywords.",
      },
      {
        h: "Choose the engagement after the problem",
        p: "A short, well-defined push suits a contract. An uncertain fit suits contract-to-hire. A role that will shape the platform for years deserves a direct hire. Deciding the contract type first, out of habit, is how teams end up with the right person on the wrong terms.",
      },
      {
        h: "How we work",
        p: "We write roles with the people who will work next to the hire, ask practitioners to run the technical conversations, and recommend the engagement model only once the problem is clear. It takes a little longer up front and saves a great deal later.",
      },
    ],
  },
  {
    slug: "the-cloud-migration-nobody-plans-for",
    title: "The part of a cloud migration nobody plans for",
    dek: "Moving servers is the easy half. Changing how teams work is the rest.",
    topic: "Cloud",
    date: "2026-11-19",
    visual: "insight3",
    body: [
      {
        p: "Cloud migration plans are usually precise about the technology: which workloads move, in what order, on which weekend. They are often vague about the people who will run those workloads the following Monday.",
      },
      {
        h: "The old habits move with the servers",
        p: "If releases were manual before, they will be manual in the cloud, only faster to break. If nobody owned cost before, the first monthly bill will be a surprise. A migration that copies old habits copies old problems at a new price.",
      },
      {
        h: "Decide who owns what, in writing",
        p: "Who approves new infrastructure? Who watches the bill? Who is woken up at night, and with what runbook? These questions take an afternoon to answer and months to fix if they are skipped.",
      },
      {
        h: "Teach while you move",
        p: "The safest migrations pair the people doing the move with the people who will inherit it. Every workload that lands is a lesson in pipelines, monitoring and infrastructure as code. By the last move, the team is running the platform, not watching it.",
      },
      {
        h: "Measure the Monday, not the weekend",
        p: "Success is not the cut-over going quietly. It is the first ordinary week afterwards: releases shipping, alerts making sense and costs where the plan said they would be. Plan for that week from the start.",
      },
    ],
  },
];

export const findInsight = (slug: string) => insights.find((i) => i.slug === slug);

export const readingMinutes = (i: Insight) => Math.max(1, Math.round(i.body.reduce((n, b) => n + b.p.split(/\s+/).length + (b.h?.split(/\s+/).length ?? 0), 0) / 220));

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`));
