"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { jobTypeLabel, workModeLabel, type Job, type JobType, type WorkMode } from "@/content/jobs";
import { Arrow, buttonClass, cx } from "./ui";

/**
 * Job search over the roles in src/content/jobs.ts. Filters run in the
 * browser; results update as the visitor types. With no roles listed, it
 * says so plainly and offers the talent network instead.
 */
const controlClass =
  "mt-2 block w-full rounded-[10px] border border-ink-200 bg-chalk px-4 py-3 text-base text-ink-950 placeholder:text-ink-400 hover:border-ink-400 focus:border-ink-900 focus:ring-4 focus:ring-signal-300/40 focus:outline-none";

export function JobSearch({ jobs }: { jobs: Job[] }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [q, setQ] = useState("");
  const [type, setType] = useState<JobType | "">("");
  const [mode, setMode] = useState<WorkMode | "">("");

  const results = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return jobs.filter((j) => {
      if (type && j.type !== type) return false;
      if (mode && j.mode !== mode) return false;
      const hay = [j.title, j.location, j.summary, ...j.skills].join(" ").toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [jobs, q, type, mode]);

  return (
    <div>
      <form role="search" aria-label="Search jobs" onSubmit={(e) => e.preventDefault()} className="grid gap-4 rounded-[var(--radius-panel)] border border-ink-200 bg-paper-2 p-5 sm:p-6 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <label htmlFor={`${id}-q`} className="t-label block text-[0.78rem] text-ink-800">
            Keyword
          </label>
          <input id={`${id}-q`} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Role, skill or city" className={controlClass} />
        </div>
        <div className="lg:col-span-3">
          <label htmlFor={`${id}-type`} className="t-label block text-[0.78rem] text-ink-800">
            Job type
          </label>
          <select id={`${id}-type`} value={type} onChange={(e) => setType(e.target.value as JobType | "")} className={cx(controlClass, "appearance-none")}>
            <option value="">Any type</option>
            {Object.entries(jobTypeLabel).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div className="lg:col-span-3">
          <label htmlFor={`${id}-mode`} className="t-label block text-[0.78rem] text-ink-800">
            Work style
          </label>
          <select id={`${id}-mode`} value={mode} onChange={(e) => setMode(e.target.value as WorkMode | "")} className={cx(controlClass, "appearance-none")}>
            <option value="">Any</option>
            {Object.entries(workModeLabel).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </form>

      <p role="status" className="t-meta mt-8 text-ink-500">
        {jobs.length === 0 ? "No open roles listed right now" : `${results.length} of ${jobs.length} ${jobs.length === 1 ? "role" : "roles"}`}
      </p>

      {jobs.length === 0 ? (
        <div className="mt-6 rounded-[var(--radius-panel)] bg-ink-950 p-8 text-paper sm:p-12">
          <p className="t-h3">There are no public openings at the moment.</p>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-300">
            Many of our roles are filled before they are ever posted. Join the talent network with your skills and preferences, and we will contact you when a matching role
            opens.
          </p>
          <Link href="/contact?topic=careers" className={cx(buttonClass("primary", "dark"), "mt-8")}>
            Join the talent network
            <Arrow className="transition-transform duration-[var(--dur-component)] group-hover:translate-x-1" />
          </Link>
        </div>
      ) : results.length === 0 ? (
        <div className="mt-6 rounded-[var(--radius-panel)] border border-ink-200 p-8">
          <p className="t-h3">No roles match those filters.</p>
          <button
            type="button"
            onClick={() => {
              setQ("");
              setType("");
              setMode("");
            }}
            className={cx(buttonClass("secondary"), "mt-6")}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-ink-200 border-y border-ink-200">
          {results.map((j) => (
            <li key={j.id} id={`job-${j.id}`} className="py-8">
              <details className="group/job">
                <summary className="flex cursor-pointer list-none flex-wrap items-baseline justify-between gap-4 [&::-webkit-details-marker]:hidden">
                  <span>
                    <span className="t-h3 block">{j.title}</span>
                    <span className="t-meta mt-2 block text-ink-500">
                      {jobTypeLabel[j.type]} <span aria-hidden="true">/</span> {workModeLabel[j.mode]} <span aria-hidden="true">/</span> {j.location}
                    </span>
                  </span>
                  <span className="t-label text-[0.75rem] text-signal-700 group-open/job:hidden">View role</span>
                  <span className="t-label hidden text-[0.75rem] text-signal-700 group-open/job:inline">Hide</span>
                </summary>
                <div className="mt-6 grid gap-8 lg:grid-cols-12">
                  <p className="leading-relaxed text-ink-700 lg:col-span-12">{j.summary}</p>
                  <div className="lg:col-span-6">
                    <h3 className="t-label text-[0.78rem]">What you will do</h3>
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-700">
                      {j.responsibilities.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="lg:col-span-6">
                    <h3 className="t-label text-[0.78rem]">What you bring</h3>
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-700">
                      {j.requirements.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="lg:col-span-12">
                    <Link href={`/contact?topic=careers`} className={buttonClass("primary")}>
                      Apply for this role
                      <Arrow />
                    </Link>
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
