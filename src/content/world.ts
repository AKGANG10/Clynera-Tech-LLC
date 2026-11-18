/**
 * Industries, concept work, people and the company story.
 * Everything here describes problems, approaches and intentions. Nothing is a
 * claim about past clients, results or headcount (see docs/CONTENT_INVENTORY.md).
 */

/** `hue` tints the dark industries environment while that industry is in view. */
export const industries = [
  {
    id: "finance",
    name: "Financial services",
    problem: "Legacy cores, manual reconciliation and rising compliance load.",
    technology: "Event-driven integration, data platforms and audit-ready automation.",
    possibility: "Products that ship weekly while every change stays traceable.",
    hue: "#10264f",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    problem: "Records split across systems and staff buried in paperwork.",
    technology: "Interoperable data, secure portals and document AI with human review.",
    possibility: "More time with patients, less time with forms.",
    hue: "#0b2f3a",
  },
  {
    id: "retail",
    name: "Retail",
    problem: "Inventory, channels and customers that never quite line up.",
    technology: "Unified commerce data, demand signals and fast storefronts.",
    possibility: "One view of stock and customer, in every channel.",
    hue: "#2a2236",
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    problem: "Plant data that stays on the plant floor.",
    technology: "Connected operations, cloud data pipelines and predictive maintenance.",
    possibility: "Problems seen before they stop the line.",
    hue: "#1b2533",
  },
  {
    id: "technology",
    name: "Technology",
    problem: "Roadmaps that outgrow the team building them.",
    technology: "Platform engineering, dedicated teams and specialist hiring.",
    possibility: "Capacity that grows with the product, not behind it.",
    hue: "#151f4f",
  },
  {
    id: "professional",
    name: "Professional services",
    problem: "Knowledge locked in documents, inboxes and individual heads.",
    technology: "Search and assistant systems, workflow automation and client portals.",
    possibility: "Expertise that scales beyond the people who hold it.",
    hue: "#251e3d",
  },
  {
    id: "startups",
    name: "Startups",
    problem: "Too much to build and too few people to build it.",
    technology: "Product engineering, cloud foundations and first technical hires.",
    possibility: "A product and a team that can survive their own success.",
    hue: "#0d2e2c",
  },
  {
    id: "public",
    name: "Public sector",
    problem: "Services that must work for everyone, on any device.",
    technology: "Accessible digital services, secure data sharing and modernization.",
    possibility: "Public services that feel as simple as they should.",
    hue: "#1f2a2e",
  },
] as const;

/** Conceptual examples. Labelled CONCEPT / EXPLORATION wherever shown: not client work. */
export const concepts = [
  {
    id: "intake",
    title: "Claims intake that reads itself",
    field: "Insurance and healthcare",
    problem: "Every claim arrives as a mix of forms, scans and emails that staff re-key by hand.",
    approach: "Document AI extracts and classifies each submission; uncertain fields go to a review queue instead of being guessed.",
    technology: ["Document AI", "Python", "Event queues", "Review console"],
    outcome: "Designed to shorten triage and leave an audit trail for every decision a model makes.",
  },
  {
    id: "supply",
    title: "One view of the supply chain",
    field: "Manufacturing and retail",
    problem: "Orders, inventory and shipments live in four systems that disagree.",
    approach: "A cloud data platform reconciles the sources nightly, then in near real time, with data-quality checks at every step.",
    technology: ["Cloud data warehouse", "Streaming pipelines", "dbt-style models", "Dashboards"],
    outcome: "Designed so planners trust one number instead of arguing about four.",
  },
  {
    id: "team",
    title: "A hiring engine for a scaling team",
    field: "Technology companies",
    problem: "A product roadmap needs twelve engineers; recruiting delivers two a quarter.",
    approach: "Role definitions written with the engineering leads, technical screening by practitioners and a blended contract-to-hire model.",
    technology: ["Skills mapping", "Technical screening", "Contract-to-hire", "Onboarding playbooks"],
    outcome: "Designed to add capacity in weeks while keeping the bar for permanent hires.",
  },
  {
    id: "migration",
    title: "A cloud move without a weekend outage",
    field: "Any organization on aging infrastructure",
    problem: "A critical application runs on hardware nobody wants to touch.",
    approach: "Infrastructure as code, a parallel environment and traffic shifted gradually behind health checks, with a tested way back.",
    technology: ["Terraform", "Containers", "CI/CD", "Observability"],
    outcome: "Designed to make the cut-over boring, which is the point.",
  },
] as const;

/** The people behind the systems (roles we work through, not named staff). */
export const roles = [
  { id: "engineer", name: "Engineers", line: "Write the code that has to work at 3 a.m.", visual: "engineer" },
  { id: "architect", name: "Architects", line: "Decide what the system is, and what it isn't.", visual: "architect" },
  { id: "consultant", name: "Consultants", line: "Turn a business problem into a plan.", visual: "consultant" },
  { id: "recruiter", name: "Recruiters", line: "Know the difference between a keyword and a skill.", visual: "recruiter" },
  { id: "leader", name: "Leaders", line: "Own the outcome, not just the timeline.", visual: "leader" },
  { id: "product", name: "Product thinkers", line: "Keep asking who this is for.", visual: "product" },
] as const;

/** Further roles named in the editorial composition (no images). */
export const moreRoles = ["Designers", "Data specialists", "Operators", "Security analysts"] as const;

/**
 * The Human Network: an illustrative graph. People are anonymized archetypes,
 * not real candidates; the section is labelled as an example.
 */
export const network = {
  columns: [
    { id: "people", name: "People" },
    { id: "skills", name: "Skills" },
    { id: "roles", name: "Roles" },
    { id: "projects", name: "Projects" },
    { id: "companies", name: "Companies" },
    { id: "opportunity", name: "Opportunity" },
  ],
  nodes: {
    people: ["Person A", "Person B", "Person C", "Person D"],
    skills: ["Python", "AWS", "React", "Data modeling", "Security", "Kubernetes"],
    roles: ["Data engineer", "Cloud architect", "Front-end engineer", "Security analyst"],
    projects: ["Data platform", "Cloud migration", "Customer portal", "Identity rollout"],
    companies: ["Healthcare provider", "Fintech startup", "Retail group", "Public agency"],
    opportunity: ["Contract", "Contract-to-hire", "Direct hire"],
  },
  /** Each chain runs person → skill → skill → role → project → company → opportunity. */
  chains: [
    ["Person A", "Python", "Data modeling", "Data engineer", "Data platform", "Healthcare provider", "Contract-to-hire"],
    ["Person B", "AWS", "Kubernetes", "Cloud architect", "Cloud migration", "Fintech startup", "Contract"],
    ["Person C", "React", "Python", "Front-end engineer", "Customer portal", "Retail group", "Direct hire"],
    ["Person D", "Security", "AWS", "Security analyst", "Identity rollout", "Public agency", "Contract"],
  ],
} as const;

/** Company story, told as progress. Only facts the company supplied, plus stated beliefs. */
export const story = [
  {
    stage: "Where we started",
    title: "Dallas, Texas.",
    body: "A technology and talent company, built around one idea: the value is in the connection between systems and the people who run them.",
  },
  {
    stage: "What we learned",
    title: "Systems fail at the seams.",
    body: "Technology work rarely stalls on the technology alone. It stalls where a system meets a team that was never set up to own it.",
  },
  {
    stage: "What we built",
    title: "One practice, two halves.",
    body: "IT services, IT consulting and IT staffing under one roof, so one partner is accountable for the system and for the team behind it.",
  },
  {
    stage: "Where we are",
    title: "1341 W. Mockingbird Lane.",
    body: "Suite 600W, Dallas. Our services are available to organizations across the United States, and we participate in E-Verify.",
  },
  {
    stage: "Where we're going",
    title: "Systems that adapt.",
    body: "AI as infrastructure, talent as a network and software that keeps learning after launch. That is the work we want to be known for.",
  },
] as const;

/** Principles that shape delivery. */
export const principles = [
  { name: "Proof over promises", body: "We show working software and real evidence, never borrowed numbers." },
  { name: "People own systems", body: "Every system we build has a team ready to run it." },
  { name: "Security by default", body: "Access, data and failure are designed in on day one." },
  { name: "Plain language", body: "If a decision cannot be explained simply, it is not ready." },
] as const;
