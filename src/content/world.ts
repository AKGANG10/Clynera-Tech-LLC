/**
 * Industries, concept work, people and the company story, in the brand voice:
 * every system is a maze, and we find the way through.
 * Everything here describes problems, approaches and intentions. Nothing is a
 * claim about past clients, results or headcount (see docs/CONTENT_INVENTORY.md).
 */

/** `hue` tints the dark industries environment while that industry is in view. */
export const industries = [
  {
    id: "finance",
    name: "Financial services",
    problem: "Every change needs three approvals and a spreadsheet nobody trusts.",
    technology: "Event-driven integration, governed data and automated controls.",
    possibility: "Faster releases with an audit trail that writes itself.",
    hue: "#10264f",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    problem: "Clinicians typing the same details into four screens.",
    technology: "Interoperable records, secure portals and document capture with review.",
    possibility: "Shorter queues and more attention on the patient in the room.",
    hue: "#0b2f3a",
  },
  {
    id: "retail",
    name: "Retail",
    problem: "The website says in stock; the shelf says otherwise.",
    technology: "Unified inventory data, demand signals and quick storefronts.",
    possibility: "One honest stock count across every channel.",
    hue: "#2a2236",
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    problem: "Machines report problems that no one sees until the line stops.",
    technology: "Connected sensors, cloud pipelines and maintenance forecasting.",
    possibility: "Repairs scheduled before the breakdown, not after.",
    hue: "#1b2533",
  },
  {
    id: "technology",
    name: "Technology",
    problem: "The roadmap grows faster than the hiring plan.",
    technology: "Platform engineering, embedded squads and specialist search.",
    possibility: "Release dates that hold, with a team that scales alongside them.",
    hue: "#151f4f",
  },
  {
    id: "professional",
    name: "Professional services",
    problem: "The best answers live in someone's inbox.",
    technology: "Knowledge search, assistants, client portals and workflow automation.",
    possibility: "Expertise that is findable by everyone, not just its author.",
    hue: "#251e3d",
  },
  {
    id: "startups",
    name: "Startups",
    problem: "A product to ship, investors to update and two engineers.",
    technology: "Lean product builds, cloud foundations and first key hires.",
    possibility: "A stack and a team ready for the next funding round.",
    hue: "#0d2e2c",
  },
  {
    id: "public",
    name: "Public sector",
    problem: "Services that must work for every resident, on any device, first time.",
    technology: "Accessible web services, secure data sharing and careful modernization.",
    possibility: "Public services as easy as the apps people already use.",
    hue: "#1f2a2e",
  },
] as const;

/** Conceptual examples. Labelled "Concept, not client work" wherever shown. */
export const concepts = [
  {
    id: "helpdesk",
    title: "An IT help desk that answers before the ticket",
    field: "Operations and internal IT",
    problem: "Most tickets are password resets, access requests and the same handful of questions.",
    approach: "An assistant trained on the internal knowledge base handles the routine requests and hands anything unusual to a person with full context attached.",
    technology: ["Knowledge search", "Workflow automation", "Identity integration", "Ticketing APIs"],
    outcome: "Designed to give the support team back the hours spent on repeats.",
  },
  {
    id: "scheduling",
    title: "Appointments without the phone tag",
    field: "Healthcare and clinics",
    problem: "Patients wait on hold to book, reschedule or ask a basic question.",
    approach: "A secure, accessible portal for booking and reminders, connected to the existing scheduling system rather than replacing it.",
    technology: ["Patient portal", "Scheduling integration", "SMS and email reminders", "Accessibility testing"],
    outcome: "Designed to free front-desk staff for the conversations that need a person.",
  },
  {
    id: "squad",
    title: "A ready-made squad for a hard deadline",
    field: "Software and technology companies",
    problem: "A launch date is fixed, and the team needed to hit it does not exist yet.",
    approach: "A dedicated squad of engineers, a QA specialist and a delivery lead, screened by practitioners and working inside the client's own process.",
    technology: ["Squad staffing", "Technical screening", "Delivery leadership", "Knowledge handover"],
    outcome: "Designed to add delivery capacity quickly and hand the knowledge back at the end.",
  },
  {
    id: "reconcile",
    title: "Month-end close in hours, not days",
    field: "Finance teams",
    problem: "Payments, invoices and bank records are matched by hand every month.",
    approach: "Automated pipelines match records nightly, flag only the true exceptions and log every decision for the auditors.",
    technology: ["Data pipelines", "Matching rules", "Exception queue", "Audit logging"],
    outcome: "Designed to shrink the close and make every adjustment traceable.",
  },
] as const;

/** The guides behind the systems (roles we work through, not named staff). */
export const roles = [
  { id: "engineer", name: "Engineers", line: "Lay the paths and keep them clear.", visual: "engineer" },
  { id: "architect", name: "Architects", line: "Draw the map before anyone walks it.", visual: "architect" },
  { id: "consultant", name: "Consultants", line: "Spot the dead ends early.", visual: "consultant" },
  { id: "recruiter", name: "Recruiters", line: "Find the person who has walked this route before.", visual: "recruiter" },
  { id: "leader", name: "Delivery leads", line: "Keep the whole party moving in one direction.", visual: "leader" },
  { id: "product", name: "Product people", line: "Ask where the customer is trying to go.", visual: "product" },
] as const;

/** Further roles named in the editorial composition (no images). */
export const moreRoles = ["Designers", "Data engineers", "Cloud operators", "Security analysts", "QA specialists"] as const;

/**
 * Where skills meet the work: an illustrative graph. Specialists are
 * anonymized archetypes, not real candidates; the section says so.
 */
export const network = {
  columns: [
    { id: "people", name: "Specialists" },
    { id: "skills", name: "Skills" },
    { id: "roles", name: "Roles" },
    { id: "projects", name: "Projects" },
    { id: "companies", name: "Employers" },
    { id: "opportunity", name: "Engagement" },
  ],
  nodes: {
    people: ["Specialist 1", "Specialist 2", "Specialist 3", "Specialist 4"],
    skills: ["Java", "Azure", "TypeScript", "SQL", "Terraform", "Identity"],
    roles: ["Backend engineer", "Platform engineer", "Full-stack developer", "IAM engineer"],
    projects: ["Payments API", "Azure landing zone", "Booking portal", "Access review"],
    companies: ["Regional bank", "Logistics firm", "Clinic group", "University"],
    opportunity: ["Contract", "Contract-to-hire", "Direct hire"],
  },
  /** Each chain runs specialist, skill, skill, role, project, employer, engagement. */
  chains: [
    ["Specialist 1", "Java", "SQL", "Backend engineer", "Payments API", "Regional bank", "Contract-to-hire"],
    ["Specialist 2", "Azure", "Terraform", "Platform engineer", "Azure landing zone", "Logistics firm", "Contract"],
    ["Specialist 3", "TypeScript", "SQL", "Full-stack developer", "Booking portal", "Clinic group", "Direct hire"],
    ["Specialist 4", "Identity", "Azure", "IAM engineer", "Access review", "University", "Contract"],
  ],
} as const;

/** The company story, as a route. Only supplied facts plus stated beliefs. */
export const story = [
  {
    stage: "The starting point",
    title: "Dallas, Texas.",
    body: "Clynera Tech is a technology and talent company with one job: find the clearest way through complex technology work.",
  },
  {
    stage: "The pattern we saw",
    title: "Projects get lost, not beaten.",
    body: "Technology rarely fails outright. It gets stuck between teams, vendors and decisions that nobody owns.",
  },
  {
    stage: "Our answer",
    title: "Guides, not just builders.",
    body: "IT services, IT consulting and IT staffing from one partner, so the map, the build and the people come from the same place.",
  },
  {
    stage: "Today",
    title: "1341 W. Mockingbird Lane.",
    body: "Suite 600W, Dallas. Our services are available to organizations across the United States, and we participate in E-Verify.",
  },
  {
    stage: "Next",
    title: "Shorter routes.",
    body: "Smarter tooling, sharper specialists and AI used where it removes steps. The goal stays the same: less maze, more progress.",
  },
] as const;

/** How we hold ourselves to the work. */
export const principles = [
  { name: "Show, then tell", body: "Working software and real evidence come before slides and promises." },
  { name: "Leave a map behind", body: "Every system we touch ends better documented than we found it." },
  { name: "Secure from line one", body: "Access, data and failure modes are designed in, never patched on." },
  { name: "Say it simply", body: "If a plan needs jargon to sound good, it is not a good plan yet." },
] as const;
