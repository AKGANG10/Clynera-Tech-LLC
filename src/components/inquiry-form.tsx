"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { contactTopics } from "@/content/site";
import { areaOptions, headcountOptions, hiringEngagementOptions, limits, timelineOptions, topics, workPreferenceOptions, type Topic } from "@/lib/inquiry/options";
import { Arrow, buttonClass, cx } from "./ui";

/**
 * The contact experience's form. Four directions (technology, talent,
 * partnership, careers), each asking only what that conversation needs.
 * The server validates everything again and never reports a false success.
 */
type Errors = Record<string, string>;
type Status = { state: "idle" } | { state: "sending" } | { state: "sent"; reference: string; name: string; email: string } | { state: "failed"; message: string };

const EMAIL = "hr@clyneratech.com";
const PHONE = "+1 (214) 899-0028";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const required: Record<Topic, Record<string, string>> = {
  technology: { message: "Tell us a little about what you want to build (at least 10 characters)." },
  talent: { company: "Enter your company name.", message: "Describe the role or team you need (at least 10 characters)." },
  partnership: { company: "Enter your company name.", message: "Tell us about the partnership you have in mind (at least 10 characters)." },
  careers: { location: "Enter your city and state, or country.", roles: "Tell us which roles you are interested in.", skills: "List your main skills." },
};

const controlClass = (error?: string) =>
  cx(
    "mt-2 block w-full rounded-[10px] border bg-chalk px-4 py-3 text-base text-ink-950 placeholder:text-ink-400",
    "transition-[border-color,box-shadow] duration-[var(--dur-micro)] focus:border-ink-900 focus:ring-4 focus:ring-signal-300/40 focus:outline-none",
    error ? "border-danger" : "border-ink-200 hover:border-ink-400",
  );

function Field({
  id,
  name,
  label,
  optional,
  hint,
  error,
  children,
}: {
  id: string;
  name: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: (props: { id: string; name: string; "aria-invalid"?: true; "aria-describedby"?: string; "aria-required"?: true; className: string }) => ReactNode;
}) {
  const fid = `${id}-${name}`;
  const described = [hint && `${fid}-hint`, error && `${fid}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={fid} className="t-label block text-[0.78rem] text-ink-800">
        {label}
        {optional ? <span className="ml-2 font-normal tracking-normal text-ink-500 normal-case">(optional)</span> : <span aria-hidden="true" className="ml-1 text-danger">*</span>}
      </label>
      {children({ id: fid, name, "aria-invalid": error ? true : undefined, "aria-describedby": described, "aria-required": optional ? undefined : true, className: controlClass(error) })}
      {hint ? (
        <p id={`${fid}-hint`} className="mt-1.5 text-sm text-ink-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${fid}-error`} className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Select({ options, ...p }: { options: readonly { value: string; label: string }[] } & Record<string, unknown>) {
  return (
    <select {...p} defaultValue="">
      <option value="">Select an option</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function InquiryForm() {
  const params = useSearchParams();
  const initial = params.get("topic");
  const [topic, setTopic] = useState<Topic>(topics.includes(initial as Topic) ? (initial as Topic) : "technology");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const form = useRef<HTMLFormElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const done = useRef<HTMLDivElement>(null);
  const started = useRef(0);

  useEffect(() => {
    started.current = performance.now();
  }, []);

  // Follow topic links (?topic=...) while the page stays mounted.
  const [seen, setSeen] = useState(initial);
  if (initial !== seen) {
    setSeen(initial);
    if (topics.includes(initial as Topic)) setTopic(initial as Topic);
  }

  useEffect(() => {
    if (status.state === "sent") done.current?.focus();
  }, [status.state]);

  const validate = (data: Record<string, unknown>) => {
    const out: Errors = {};
    if (!String(data.name ?? "").trim()) out.name = "Enter your name.";
    if (!EMAIL_RE.test(String(data.email ?? "").trim())) out.email = "Enter a valid email address.";
    for (const [field, msg] of Object.entries(required[topic])) {
      const v = String(data[field] ?? "").trim();
      if (!v || (field === "message" && v.length < limits.minDetail)) out[field] = msg;
    }
    if (topic === "careers" && data.consent !== true) out.consent = "Please confirm you have read the privacy notice.";
    return out;
  };

  const showErrors = (errs: Errors) => {
    setErrors(errs);
    requestAnimationFrame(() => summary.current?.focus());
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status.state === "sending") return;
    const fd = new FormData(e.currentTarget);
    const data: Record<string, unknown> = { topic };
    for (const [k, v] of fd.entries()) if (k !== "areas" && k !== "consent" && k !== "topic-choice" && typeof v === "string" && v !== "") data[k] = v;
    if (topic === "technology") data.areas = fd.getAll("areas");
    if (topic === "careers") data.consent = fd.get("consent") === "on";
    data.hp = String(fd.get("hp") ?? "");
    data.elapsedMs = Math.round(performance.now() - started.current);

    const local = validate(data);
    if (Object.keys(local).length) return showErrors(local);
    setErrors({});
    setStatus({ state: "sending" });

    try {
      const res = await fetch("/api/inquiry", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; reference?: string; message?: string; fields?: Errors };
      if (res.ok && body.ok && body.reference) {
        setStatus({ state: "sent", reference: body.reference, name: String(data.name), email: String(data.email) });
        return;
      }
      if (res.status === 400 && body.fields) {
        setStatus({ state: "idle" });
        return showErrors(body.fields);
      }
      setStatus({ state: "failed", message: body.message ?? `Your message could not be sent right now. Please email ${EMAIL} or call ${PHONE}.` });
    } catch {
      setStatus({ state: "failed", message: `We could not reach our server. Check your connection and try again, or email ${EMAIL}.` });
    }
  };

  if (status.state === "sent") {
    return (
      <div ref={done} tabIndex={-1} role="status" className="rounded-[var(--radius-panel)] bg-ink-950 p-8 text-paper outline-none sm:p-12">
        <p className="t-meta flex items-center gap-3 text-signal-300">
          <span aria-hidden="true" className="node" />
          Message received
        </p>
        <p className="t-h2 mt-6">Thanks, {status.name.split(" ")[0]}. You&apos;re on the map.</p>
        <p className="t-lead mt-5 max-w-xl text-ink-200">A guide from our team will reply by email to {status.email}.</p>
        <p className="t-meta mt-8 text-ink-400">Reference {status.reference}</p>
        <button type="button" onClick={() => setStatus({ state: "idle" })} className={cx(buttonClass("secondary", "dark"), "mt-10")}>
          Send another message
        </button>
      </div>
    );
  }

  const errorList = Object.entries(errors);
  const p = { id };

  return (
    <form ref={form} noValidate onSubmit={onSubmit} aria-label="Contact Clynera Tech" className="space-y-10">
      {errorList.length ? (
        <div ref={summary} tabIndex={-1} role="alert" className="rounded-[10px] border border-danger/40 bg-danger/5 p-5 outline-none">
          <p className="font-semibold text-danger">Please check {errorList.length === 1 ? "this field" : `these ${errorList.length} fields`}:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-800">
            {errorList.map(([field, msg]) => (
              <li key={field}>
                <a className="underline" href={`#${id}-${field}`}>
                  {msg}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <fieldset>
        <legend className="t-label text-[0.78rem] text-ink-800">Where are you headed?</legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {contactTopics.map((t) => (
            <label
              key={t.topic}
              className={cx(
                "flex cursor-pointer items-start gap-3 rounded-[10px] border p-4 transition-[border-color,background-color] duration-[var(--dur-micro)] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-signal-300/40",
                topic === t.topic ? "border-ink-950 bg-ink-950 text-paper" : "border-ink-200 bg-chalk hover:border-ink-500",
              )}
            >
              <input type="radio" name="topic-choice" value={t.topic} checked={topic === t.topic} onChange={() => setTopic(t.topic)} className="mt-1 size-4 accent-[#14c9b5]" />
              <span>
                <span className="t-label block text-[0.85rem]">{t.label}</span>
                <span className={cx("mt-1 block text-sm", topic === t.topic ? "text-ink-300" : "text-ink-500")}>{t.line}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field {...p} name="name" label="Full name" error={errors.name}>
          {(a) => <input {...a} type="text" autoComplete="name" maxLength={limits.name} />}
        </Field>
        <Field {...p} name="email" label={topic === "careers" ? "Email" : "Work email"} error={errors.email}>
          {(a) => <input {...a} type="email" autoComplete="email" inputMode="email" maxLength={limits.email} />}
        </Field>
        <Field {...p} name="phone" label="Phone" optional error={errors.phone}>
          {(a) => <input {...a} type="tel" autoComplete="tel" inputMode="tel" maxLength={limits.phone} />}
        </Field>
        {topic !== "careers" ? (
          <Field {...p} name="company" label="Company" optional={topic === "technology"} error={errors.company}>
            {(a) => <input {...a} type="text" autoComplete="organization" maxLength={limits.company} />}
          </Field>
        ) : (
          <Field {...p} name="location" label="Location" hint="City and state, or country" error={errors.location}>
            {(a) => <input {...a} type="text" autoComplete="address-level2" maxLength={limits.short} />}
          </Field>
        )}
      </div>

      {topic === "technology" ? (
        <>
          <fieldset>
            <legend className="t-label text-[0.78rem] text-ink-800">
              Which areas? <span className="ml-1 font-normal tracking-normal text-ink-500 normal-case">(optional)</span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {areaOptions.map((o) => (
                <label key={o.value} className="flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-ink-200 bg-chalk px-4 text-sm has-[:checked]:border-ink-950 has-[:checked]:bg-ink-950 has-[:checked]:text-paper has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-signal-300/40">
                  <input type="checkbox" name="areas" value={o.value} className="size-3.5 accent-[#14c9b5]" />
                  {o.label}
                </label>
              ))}
            </div>
          </fieldset>
          <Field {...p} name="message" label="What are you trying to build or fix?" error={errors.message}>
            {(a) => <textarea {...a} rows={5} maxLength={limits.long} className={cx(a.className, "resize-y")} />}
          </Field>
          <div className="sm:w-1/2">
            <Field {...p} name="timeline" label="Timeline" optional>
              {(a) => <Select {...a} options={timelineOptions} />}
            </Field>
          </div>
        </>
      ) : null}

      {topic === "talent" ? (
        <>
          <Field {...p} name="message" label="Which specialists do you need?" error={errors.message}>
            {(a) => <textarea {...a} rows={5} maxLength={limits.long} className={cx(a.className, "resize-y")} />}
          </Field>
          <div className="grid gap-6 sm:grid-cols-3">
            <Field {...p} name="headcount" label="How many people" optional>
              {(a) => <Select {...a} options={headcountOptions} />}
            </Field>
            <Field {...p} name="engagement" label="Engagement" optional>
              {(a) => <Select {...a} options={hiringEngagementOptions} />}
            </Field>
            <Field {...p} name="location" label="Location or remote" optional>
              {(a) => <input {...a} type="text" maxLength={limits.short} />}
            </Field>
          </div>
        </>
      ) : null}

      {topic === "partnership" ? (
        <>
          <Field {...p} name="website" label="Company website" optional hint="A full https:// link" error={errors.website}>
            {(a) => <input {...a} type="url" inputMode="url" placeholder="https://" maxLength={300} />}
          </Field>
          <Field {...p} name="message" label="What partnership do you have in mind?" error={errors.message}>
            {(a) => <textarea {...a} rows={5} maxLength={limits.long} className={cx(a.className, "resize-y")} />}
          </Field>
        </>
      ) : null}

      {topic === "careers" ? (
        <>
          <Field {...p} name="roles" label="Roles you are interested in" error={errors.roles}>
            {(a) => <input {...a} type="text" maxLength={limits.short * 2} />}
          </Field>
          <Field {...p} name="skills" label="Your main skills" error={errors.skills}>
            {(a) => <textarea {...a} rows={3} maxLength={limits.medium} className={cx(a.className, "resize-y")} />}
          </Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field {...p} name="workPreference" label="Work preference" optional>
              {(a) => <Select {...a} options={workPreferenceOptions} />}
            </Field>
            <Field {...p} name="profileUrl" label="Profile or portfolio link" optional hint="A full https:// link, for example LinkedIn" error={errors.profileUrl}>
              {(a) => <input {...a} type="url" inputMode="url" placeholder="https://" maxLength={300} />}
            </Field>
          </div>
          <Field {...p} name="message" label="Anything else" optional error={errors.message}>
            {(a) => <textarea {...a} rows={3} maxLength={limits.medium * 2} className={cx(a.className, "resize-y")} />}
          </Field>
          <div>
            <label className="flex items-start gap-3 text-[0.95rem] text-ink-800">
              <input
                id={`${id}-consent`}
                type="checkbox"
                name="consent"
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
                className="mt-1 size-4 accent-[#14c9b5]"
              />
              <span>
                I have read the{" "}
                <Link href="/privacy" className="font-semibold underline">
                  privacy notice
                </Link>{" "}
                and agree that Clynera Tech may contact me about roles. We do not accept resumes through this form.
              </span>
            </label>
            {errors.consent ? (
              <p id={`${id}-consent-error`} className="mt-1.5 text-sm font-medium text-danger">
                {errors.consent}
              </p>
            ) : null}
          </div>
        </>
      ) : null}

      {/* Honeypot: hidden from people and assistive technology. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this empty
          <input type="text" name="hp" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status.state === "failed" ? (
        <div role="alert" className="rounded-[10px] border border-danger/40 bg-danger/5 p-5 text-[0.95rem] text-ink-900">
          {status.message}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-6">
        <button type="submit" disabled={status.state === "sending"} aria-busy={status.state === "sending" || undefined} className={cx(buttonClass("primary"), "disabled:opacity-60")}>
          {status.state === "sending" ? "Sending" : "Send my message"}
          <Arrow className="transition-transform duration-[var(--dur-component)] group-hover:translate-x-1" />
        </button>
        <p className="text-sm text-ink-500">
          Required fields are marked <span className="text-danger">*</span>. See our{" "}
          <Link href="/privacy" className="underline">
            privacy notice
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
