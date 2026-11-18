/**
 * Open roles shown on /careers/jobs. Add real, approved openings only: each
 * entry is published with Google JobPosting structured data, so it must be a
 * genuine vacancy with accurate details. Remove a role as soon as it closes.
 *
 * Empty on purpose (2026-11-19): no openings have been supplied yet, and the
 * page shows an honest empty state with a way to join the talent network.
 */
export type JobType = "contract" | "contract-to-hire" | "full-time";
export type WorkMode = "remote" | "hybrid" | "onsite";

export type Job = {
  id: string;
  title: string;
  type: JobType;
  mode: WorkMode;
  /** City and state, or "United States" for remote roles. */
  location: string;
  /** Short skill tags used by search. */
  skills: string[];
  summary: string;
  responsibilities: string[];
  requirements: string[];
  /** ISO date the role was posted. */
  posted: string;
  /** Optional ISO date after which the role is no longer shown. */
  validThrough?: string;
};

export const jobs: Job[] = [];

export const jobTypeLabel: Record<JobType, string> = {
  contract: "Contract",
  "contract-to-hire": "Contract-to-hire",
  "full-time": "Full-time",
};

export const workModeLabel: Record<WorkMode, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};
