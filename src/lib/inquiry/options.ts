/**
 * Option lists shared by the client form and the server schema, so the
 * values the form can send are exactly the values the server accepts.
 * This file must stay free of server-only imports.
 */

export const topics = ["technology", "talent", "partnership", "careers"] as const;
export type Topic = (typeof topics)[number];

export const areaOptions = [
  { value: "ai", label: "AI" },
  { value: "software", label: "Software" },
  { value: "cloud", label: "Cloud" },
  { value: "data", label: "Data" },
  { value: "security", label: "Cybersecurity" },
  { value: "automation", label: "Automation" },
  { value: "consulting", label: "Consulting" },
  { value: "experience", label: "Digital experience" },
] as const;

export const timelineOptions = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3-months", label: "Within 1 to 3 months" },
  { value: "3-6-months", label: "Within 3 to 6 months" },
  { value: "exploring", label: "Just exploring" },
] as const;

export const headcountOptions = [
  { value: "1", label: "1 person" },
  { value: "2-5", label: "2 to 5 people" },
  { value: "6-10", label: "6 to 10 people" },
  { value: "10-plus", label: "More than 10" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const hiringEngagementOptions = [
  { value: "contract", label: "Contract" },
  { value: "contract-to-hire", label: "Contract-to-hire" },
  { value: "direct-hire", label: "Direct hire" },
  { value: "dedicated-team", label: "Dedicated team" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const workPreferenceOptions = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
  { value: "flexible", label: "Flexible" },
] as const;

export const limits = {
  name: 100,
  email: 254,
  company: 120,
  phone: 40,
  short: 160,
  medium: 1000,
  long: 4000,
  minDetail: 10,
} as const;

/** Submissions faster than this after the form appears are treated as automated. */
export const MIN_FILL_MS = 2500;

export const values = <T extends readonly { value: string }[]>(opts: T) => opts.map((o) => o.value) as [T[number]["value"], ...T[number]["value"][]];

export const labelFor = (opts: readonly { value: string; label: string }[], v: string | undefined) => opts.find((o) => o.value === v)?.label ?? v ?? "";
