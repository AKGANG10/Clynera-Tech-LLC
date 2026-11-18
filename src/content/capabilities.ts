import type { VisualKey } from "./visuals";

/**
 * What Clynera Tech does, written as routes through a maze (the brand idea,
 * taken from the logo). Each entry says what the service is and how it is
 * delivered; none makes a claim about past clients or results.
 * Category words (IT services, IT consulting, IT staffing) stay explicit.
 */
export type CapabilityId = "ai" | "software" | "cloud" | "data" | "security" | "automation" | "talent" | "consulting" | "experience";

export type Capability = {
  id: CapabilityId;
  name: string;
  category: "IT services" | "IT consulting" | "IT staffing";
  line: string;
  body: string;
  deliver: string[];
  visual?: VisualKey;
};

export const capabilities: Capability[] = [
  {
    id: "ai",
    name: "AI",
    category: "IT services",
    line: "Useful before it is impressive.",
    body: "We pick the one decision AI can genuinely speed up, prove it on your own data, and only then wire it into daily work with review steps, logging and a plan for when the model is unsure.",
    deliver: ["Opportunity scoring and quick proofs", "Search, summarizing and assistants over your documents", "Evaluation sets and drift monitoring", "Human sign-off where it matters"],
    visual: "ai",
  },
  {
    id: "software",
    name: "Software",
    category: "IT services",
    line: "Code your next team will thank you for.",
    body: "Web platforms, internal tools, APIs and integrations shipped in small, tested releases, with the documentation and handover that let your people own it after we leave.",
    deliver: ["Product and platform engineering", "API design and system integration", "Legacy rewrites done in slices", "Automated testing and code review"],
    visual: "software",
  },
  {
    id: "cloud",
    name: "Cloud",
    category: "IT services",
    line: "Infrastructure you never have to think about.",
    body: "Architecture, migration and DevOps on AWS, Azure or Google Cloud: everything defined as code, every release through a pipeline, every cost visible before the invoice arrives.",
    deliver: ["Landing zones and migrations", "Infrastructure as code", "Build and release pipelines", "Monitoring, alerting and cost tuning"],
    visual: "cloud",
  },
  {
    id: "data",
    name: "Data",
    category: "IT services",
    line: "One number everyone agrees on.",
    body: "We trace where your figures come from, clean up the path, and give teams a single source they can query, report on and trust in meetings.",
    deliver: ["Warehouse and lakehouse builds", "Pipelines and data integration", "Dashboards and self-serve reporting", "Quality checks and data ownership"],
    visual: "data",
  },
  {
    id: "security",
    name: "Cybersecurity",
    category: "IT services",
    line: "Locks fitted while the walls go up.",
    body: "Security reviews, identity and access, and secure design built into the project plan, so protection never becomes the reason a launch slips.",
    deliver: ["Risk and posture assessments", "Identity, access and least privilege", "Secure design reviews", "Incident readiness and playbooks"],
    visual: "security",
  },
  {
    id: "automation",
    name: "Automation",
    category: "IT services",
    line: "Retire the copy-and-paste jobs.",
    body: "We find the repetitive steps people quietly hate, automate them across the tools you already pay for, and keep a person in charge of the exceptions.",
    deliver: ["Workflow discovery", "Integration and workflow automation", "Scripted and robotic process automation", "Exception queues and audit logs"],
  },
  {
    id: "talent",
    name: "Talent",
    category: "IT staffing",
    line: "Specialists who arrive ready.",
    body: "IT staffing for engineering, data, cloud and security roles: contract, contract-to-hire and direct hire, or a dedicated squad that joins your sprint on day one.",
    deliver: ["Contract and contract-to-hire", "Direct-hire search", "Dedicated delivery squads", "Practitioner-led technical screening"],
  },
  {
    id: "consulting",
    name: "Consulting",
    category: "IT consulting",
    line: "A map before the money moves.",
    body: "IT consulting for the decisions that are expensive to undo: platform choices, architecture, roadmaps and the delivery plan that turns them into dates.",
    deliver: ["Technology roadmaps", "Architecture reviews and second opinions", "Program recovery and delivery leadership", "Vendor and platform selection"],
  },
  {
    id: "experience",
    name: "Digital experience",
    category: "IT services",
    line: "Screens that explain themselves.",
    body: "Product design and front-end engineering for sites, portals and dashboards, built accessible and fast on every screen, with a design system that keeps it consistent.",
    deliver: ["Research and UX design", "Design systems", "Accessible front-end builds", "Speed and Core Web Vitals work"],
  },
];

/** One object, seven states: the route from a question to a running system. */
export const buildStages = [
  { id: "question", name: "Question", body: "We start with the problem in one sentence and the person who feels it most." },
  { id: "blueprint", name: "Blueprint", body: "Boundaries, data, integrations and risks get drawn before anyone opens an editor." },
  { id: "prototype", name: "Prototype", body: "Something real to click within days, so feedback arrives while change is cheap." },
  { id: "build", name: "Build", body: "Short, reviewed, tested increments. Every path in the maze gets laid properly." },
  { id: "learn", name: "Learn", body: "Data and AI switch on where they sharpen a decision, measured against the old way." },
  { id: "launch", name: "Launch", body: "Live with monitoring, rollback and runbooks, then scaled out as demand shows up." },
  { id: "grow", name: "Grow", body: "The arrow leaves the maze: results tracked, the next route already sketched." },
] as const;

/** How clients can work with us. */
export const engagementModels = [
  { name: "Outcome projects", body: "A fixed goal, a named team and milestones you can check us against." },
  { name: "Embedded engineers", body: "Our people inside your squads, your tools and your stand-ups." },
  { name: "Advisory sprints", body: "Two to six weeks of focused architecture or strategy work before a big commitment." },
  { name: "IT staffing", body: "Contract, contract-to-hire and direct-hire placements for technology roles." },
] as const;
