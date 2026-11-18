/**
 * Company facts. Supplied by Clynera Tech LLC on 2026-11-19.
 * The EIN and E-Verify company ID were also supplied but are deliberately
 * NOT published here or anywhere on the site.
 * Anything not listed here is unknown: do not invent it (see docs/CONTENT_INVENTORY.md).
 */
export const company = {
  legalName: "Clynera Tech LLC",
  shortName: "Clynera Tech",
  category: "IT services, IT consulting and IT staffing",
  tagline: "Every system is a maze. We find the way through.",
  description:
    "Clynera Tech guides organizations through complex technology. IT services, IT consulting and IT staffing from Dallas, Texas: the map, the build and the specialists, from one partner.",
  email: "hr@clyneratech.com",
  phone: { display: "+1 (214) 899-0028", e164: "+12148990028", href: "tel:+12148990028" },
  address: {
    street: "1341 W. Mockingbird Lane, Suite 600W",
    locality: "Dallas",
    region: "TX",
    postalCode: "75247",
    country: "US",
  },
  everify: true,
} as const;

export const formattedAddress = `${company.address.street}, ${company.address.locality}, ${company.address.region} ${company.address.postalCode}`;

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://clyneratech.com").replace(/\/$/, "");

export const mainNav = [
  { href: "/capabilities", label: "Capabilities" },
  { href: "/work", label: "Work" },
  { href: "/people", label: "Talent" },
  { href: "/careers", label: "Careers" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
] as const;

export const secondaryNav = [
  { href: "/careers/jobs", label: "Search jobs" },
  { href: "/contact", label: "Contact" },
] as const;

export const legalNav = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

/** The four ways into a conversation. */
export const contactTopics = [
  { topic: "technology", label: "Technology", line: "Something to build, fix, move or secure." },
  { topic: "talent", label: "Hiring", line: "Specialists for a role, a squad or a deadline." },
  { topic: "partnership", label: "Partnership", line: "Work alongside us as a partner or vendor." },
  { topic: "careers", label: "Careers", line: "Your next role in technology." },
] as const;
