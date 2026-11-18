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
  description:
    "Clynera Tech is a technology and talent company in Dallas, Texas. We provide IT services, IT consulting and IT staffing, so the systems you need and the people who run them work as one.",
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
  { href: "/work", label: "Work" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/people", label: "People" },
  { href: "/insights", label: "Insights" },
] as const;

export const secondaryNav = [
  { href: "/company", label: "Company" },
  { href: "/contact", label: "Contact" },
  { href: "/contact?topic=careers", label: "Careers" },
] as const;

export const legalNav = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

/** Contact directions offered at the end of every journey. */
export const contactTopics = [
  { topic: "technology", label: "Technology", line: "Build, modernize or secure a system." },
  { topic: "talent", label: "Talent", line: "Hire engineers, architects and specialists." },
  { topic: "partnership", label: "Partnership", line: "Work with us as a partner or vendor." },
  { topic: "careers", label: "Careers", line: "Join our talent network." },
] as const;
