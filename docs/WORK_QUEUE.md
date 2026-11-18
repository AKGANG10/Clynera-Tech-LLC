# Work queue

## Evidence (2026-11-19, local production build, Edge)

- Lint, type check, production build: pass.
- Playwright: 74 tests pass, 22 skipped by design (device-specific), desktop 1440x900 and Pixel 7. Covers every route (one h1, metadata, canonical, no console errors), the private identifiers never appearing, 404, headers, sitemap, structured data, hero states (dormant, key wake, auto wake, reduced motion), skip link, mobile menu, no sideways scroll on phones, capability tabs by click and keys, the human network, concept labels, form validation, a successful inquiry, careers consent, articles, the finale, the API's failure-first behaviour and the EmailJS adapter against a mock.
- Lighthouse 13.6 (local `next start`): home 95 mobile / 100 desktop performance, contact 98 / 100; best practices and SEO 100. Accessibility 97 on home before the industry-label contrast fix, 100 on contact. Re-measure on the deployed site.
- Browser checks: hero dormant and awake, System separation and reconnection, Build stages, Industries pinned track, capability hover, finale, mobile menu; desktop and 390px phone.

## Live (2026-11-19)

- https://clyneratech.com on Vercel project `clyneratechllc`. Northwest records A @ 216.198.79.1 and 64.29.17.1, CNAME www to d78caff1d8fc370a.vercel-dns-017.com, published on both authoritative servers and on Google DNS; Vercel reports both domains configured correctly. MX, SPF and DKIM unchanged.
- Let's Encrypt certificates for the apex and www on both Vercel IPs, valid to 2027-02-16. www and http redirect (308) to https://clyneratech.com.
- All routes 200, 404 page for unknown paths, CSP, HSTS and X-Frame-Options present, canonical URLs on clyneratech.com, EIN and E-Verify ID absent.
- Real inquiry CT-TJJDSE52 from the live form arrived at hr@clyneratech.com with all fields (subject, Dallas time, reply-to).

## Next (need Clynera Tech)

1. Review the content listed in CONTENT_INVENTORY.md, including the three articles.
2. Set the GitHub default branch to main (production currently builds from build/initial-site, kept identical to main).

## Soon after launch

- Generated images per IMAGE_BRIEF.md, imported with `npm run media:import`.
- Legal review of privacy and terms (retention, governing law).
- Rotate the EmailJS private key (it was shared in chat).
- DMARC record for clyneratech.com.
- Real case studies, team photos and founding details when available.
