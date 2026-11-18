# Email setup (EmailJS)

The contact form posts to `/api/inquiry`. The server validates, rate-limits, de-duplicates and then calls the EmailJS REST API; no key ever reaches the browser.

## Account (supplied 2026-11-19)

- Service ID `service_k3yhmpd`, template ID `template_lcsit4b`. Keys live only in Vercel (see DEPLOY.md).
- In EmailJS, **Account, Security**: enable **"Allow EmailJS API for non-browser applications"** and **"Use Private Key"**. Without the first, EmailJS answers 403.
- The private key was shared in chat once. Rotate it in EmailJS when convenient and update Vercel.

## Template `template_lcsit4b`

The form sends these variables: `subject`, `body`, `reply_to`, `from_name`, `inquiry_type`, `reference`, `submitted_at`, plus aliases `name`, `email`, `title`, `message`, `time`, `phone`, `company`.

Set the template so it notifies the team (if it is EmailJS's stock auto-reply, it would email the visitor instead):

- **To Email:** `hr@clyneratech.com`
- **Reply To:** `{{reply_to}}`
- **Subject:** `{{subject}}`
- **Content:** `{{body}}` (plain text; it holds every field the visitor filled in, one per line)
- **From Name:** `Clynera Tech website`

## Verified 2026-11-19

Non-browser API access enabled; live inquiry CT-TJJDSE52 arrived at hr@clyneratech.com with all fields and the visitor as reply-to.

## Verify

Send one real inquiry from the live site. The email must arrive at hr@clyneratech.com with subject like `Technology inquiry from <name> (CT-XXXXXXXX)`, and Reply must address the visitor. If sending fails, the reason is in `vercel logs --environment production` as `[inquiry] CT-... emailjs rejected: <status> <reason>`.

The request shape is covered by `e2e/email-delivery.spec.ts` against a local mock; only a real send proves the account and template.
