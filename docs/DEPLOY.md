# Deploy (Vercel) and domain (Northwest)

## 1. Import the repository

Vercel, **Add New, Project**, import `AKGANG10/Clynera-Tech-LLC`. Framework: Next.js (detected). Root directory: the repository root. No build settings to change.

## 2. Environment variables (Production)

| Name | Value | Sensitive |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://clyneratech.com` | No |
| `INQUIRY_DELIVERY` | `emailjs` | No |
| `EMAILJS_SERVICE_ID` | `service_k3yhmpd` | No |
| `EMAILJS_TEMPLATE_ID` | `template_lcsit4b` | No |
| `EMAILJS_PUBLIC_KEY` | the EmailJS Public Key | No |
| `EMAILJS_PRIVATE_KEY` | the EmailJS Private Key | **Yes** |

Never commit the keys. Without them the contact form refuses with a clear message (HTTP 503) instead of pretending to send. New variables apply only after a redeploy.

## 3. Domain

DNS snapshot before any change (2026-11-19, via 8.8.8.8): nameservers `ns1/ns2.hosting.businessidentity.llc` (Northwest); `MX 1 smtp.google.com`; SPF `v=spf1 include:_spf.google.com ~all`; DKIM at `google._domainkey`; no DMARC; **no A or www records**. Website records are therefore purely additive.

1. Vercel project, **Settings, Domains**: add `clyneratech.com` and `www.clyneratech.com` (redirect www to the apex).

   Done 2026-11-19 on project `clyneratechllc` (team akhil-0dac). Records Vercel requires (from `vercel domains verify`):

   | Type | Host | Value |
   |---|---|---|
   | A | @ | 216.198.79.1 |
   | A | @ | 64.29.17.1 |
   | CNAME | www | d78caff1d8fc370a.vercel-dns-017.com |

   The app redirects www to the apex itself (next.config.ts).
2. Vercel shows the exact records to create. Add those, and only those, in Northwest's DNS editor (typically an `A` record for `@` and a `CNAME` for `www`). Use the values Vercel shows for this project.
3. Do not change nameservers, MX, SPF or DKIM records. Google Workspace mail depends on them.
4. Optional, recommended: add `_dmarc` TXT `v=DMARC1; p=none; rua=mailto:hr@clyneratech.com`, then tighten later.

## 4. Smoke test after each production deploy

- `/`, `/capabilities`, `/work`, `/people`, `/insights`, `/company`, `/contact` return 200.
- `https://www.clyneratech.com` redirects to `https://clyneratech.com`.
- Response headers include `Content-Security-Policy` and `Strict-Transport-Security`.
- One real inquiry through `/contact` arrives at hr@clyneratech.com (see EMAIL_SETUP.md).

Rollback: Vercel, Deployments, previous deployment, **Promote to Production**.
