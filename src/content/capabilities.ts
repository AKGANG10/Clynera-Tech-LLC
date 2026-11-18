import type { VisualKey } from "./visuals";

/**
 * What Clynera Tech builds. Descriptions say what the service is and how it is
 * delivered; they make no claims about past clients or results.
 * Category words (IT services, IT consulting, IT staffing) are kept explicit
 * so visitors and search engines can tell what kind of company this is.
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
    line: "Intelligence as infrastructure for better decisions.",
    body: "We design and build AI that earns its place in a workflow: document understanding, prediction, search and assistants, with evaluation, human review and fallbacks designed in from the start.",
    deliver: ["Use-case discovery and feasibility", "Retrieval and assistant systems", "Model evaluation and monitoring", "Human review and audit trails"],
    visual: "ai",
  },
  {
    id: "software",
    name: "Software",
    category: "IT services",
    line: "Products engineered to last longer than the launch.",
    body: "Web platforms, internal tools, APIs and integrations, built with tested, typed, maintainable code and handed over with documentation your team can own.",
    deliver: ["Web and product engineering", "APIs and integrations", "Modernization of legacy systems", "Quality engineering and test automation"],
    visual: "software",
  },
  {
    id: "cloud",
    name: "Cloud",
    category: "IT services",
    line: "Infrastructure that scales without drama.",
    body: "Cloud architecture, migration and DevOps: infrastructure as code, delivery pipelines, observability and cost control, on the provider that fits your constraints.",
    deliver: ["Cloud architecture and migration", "Infrastructure as code", "CI/CD and release engineering", "Observability and cost reviews"],
    visual: "cloud",
  },
  {
    id: "data",
    name: "Data",
    category: "IT services",
    line: "Signals that become decisions.",
    body: "Data platforms, pipelines and analytics that turn scattered records into one trusted view, with the governance needed to keep it trusted.",
    deliver: ["Data platforms and warehouses", "Pipelines and integration", "Analytics and reporting", "Data quality and governance"],
    visual: "data",
  },
  {
    id: "security",
    name: "Cybersecurity",
    category: "IT services",
    line: "Protection designed in, not bolted on.",
    body: "Security reviews, secure architecture, identity and access, and the practical controls that let teams move quickly without widening the attack surface.",
    deliver: ["Security assessments", "Identity and access management", "Secure architecture reviews", "Monitoring and response planning"],
    visual: "security",
  },
  {
    id: "automation",
    name: "Automation",
    category: "IT services",
    line: "Remove the work nobody should be doing by hand.",
    body: "Workflow and process automation across the tools you already use, with clear ownership, error handling and a person in the loop where judgment matters.",
    deliver: ["Process mapping", "Workflow and integration automation", "Robotic and scripted automation", "Exception handling and reporting"],
  },
  {
    id: "talent",
    name: "Talent",
    category: "IT staffing",
    line: "The right people, connected to the right work.",
    body: "IT staffing and recruitment for technology roles: contract, contract-to-hire and direct hire, plus dedicated teams that plug into your delivery.",
    deliver: ["Contract and contract-to-hire", "Direct hire", "Dedicated delivery teams", "Technical screening"],
  },
  {
    id: "consulting",
    name: "Consulting",
    category: "IT consulting",
    line: "Business problems, turned into systems.",
    body: "IT consulting that starts with the outcome: technology strategy, architecture, roadmaps and program leadership that connect decisions to delivery.",
    deliver: ["Technology strategy and roadmaps", "Architecture advisory", "Program and delivery leadership", "Vendor and platform selection"],
  },
  {
    id: "experience",
    name: "Digital experience",
    category: "IT services",
    line: "Interfaces people understand the first time.",
    body: "Product design and front-end engineering for websites, portals and dashboards: accessible, fast and consistent across every screen size.",
    deliver: ["Product and UX design", "Design systems", "Accessible front-end engineering", "Performance optimization"],
  },
];

/** One object, seven states: how an idea becomes a system. */
export const buildStages = [
  { id: "idea", name: "Idea", body: "Every system starts as a point: a problem worth solving and a person who owns it." },
  { id: "architecture", name: "Architecture", body: "We give the idea a structure: boundaries, data, integrations and the constraints that matter." },
  { id: "design", name: "Design", body: "Shape and surface. Journeys, interfaces and states, designed before a line of production code." },
  { id: "engineering", name: "Engineering", body: "The paths are built: typed, tested, reviewed code that the next team can read." },
  { id: "intelligence", name: "Intelligence", body: "Signals start to move. Data and AI where they improve a decision, never as decoration." },
  { id: "deployment", name: "Deployment", body: "The system goes live and scales out, with monitoring, rollback and runbooks in place." },
  { id: "impact", name: "Impact", body: "It breaks out of the diagram and into the business. Then we measure, learn and build what's next." },
] as const;

/** How clients can engage. */
export const engagementModels = [
  { name: "Project delivery", body: "A defined outcome, a cross-functional team and a plan you can hold us to." },
  { name: "Team extension", body: "Engineers and specialists who join your team, your tools and your rituals." },
  { name: "Advisory", body: "Architecture, strategy and second opinions before the expensive decisions." },
  { name: "Staffing", body: "Contract, contract-to-hire and direct-hire recruitment for technology roles." },
] as const;
