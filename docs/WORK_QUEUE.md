# Work queue

## Evidence (2026-11-19, local production build, Edge)

- Lint, type check, production build: pass.
- Playwright: 74 tests pass, 22 skipped by design (device-specific), desktop 1440x900 and Pixel 7. Covers every route (one h1, metadata, canonical, no console errors), the private identifiers never appearing, 404, headers, sitemap, structured data, hero states (dormant, key wake, auto wake, reduced motion), skip link, mobile menu, no sideways scroll on phones, capability tabs by click and keys, the human network, concept labels, form validation, a successful inquiry, careers consent, articles, the finale, the API's failure-first behaviour and the EmailJS adapter against a mock.
- Lighthouse 13.6 (local `next start`): home 95 mobile / 100 desktop performance, contact 98 / 100; best practices and SEO 100. Accessibility 97 on home before the industry-label contrast fix, 100 on contact. Re-measure on the deployed site.
- Browser checks: hero dormant and awake, System separation and reconnection, Build stages, Industries pinned track, capability hover, finale, mobile menu; desktop and 390px phone.

## Launch blockers (need Clynera Tech)

1. Import the repo into Vercel and set the environment variables (DEPLOY.md).
2. Add the domain records Vercel shows in Northwest DNS (DEPLOY.md).
3. Configure the EmailJS template and security settings, then one real test inquiry (EMAIL_SETUP.md).
4. Review the content listed in CONTENT_INVENTORY.md, including the three articles.

## Soon after launch

- Generated images per IMAGE_BRIEF.md, imported with `npm run media:import`.
- Legal review of privacy and terms (retention, governing law).
- Rotate the EmailJS private key (it was shared in chat).
- DMARC record for clyneratech.com.
- Real case studies, team photos and founding details when available.
