# Clynera Tech website

Marketing site for Clynera Tech LLC (Dallas, Texas): IT services, IT consulting and IT staffing, presented as one living system.

Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4, zod. No animation or 3D libraries: canvas 2D, SVG and CSS.

## Commands

```bash
npm install
npm run dev                 # http://localhost:3000
npm run lint
npm run typecheck
npm run build
npm run test:e2e            # Playwright against the production build (installed Edge; PW_CHANNEL=chromium in CI)
# low memory: E2E_ONLY_MAIN=1 npx playwright test --workers=1 (skips the extra EmailJS servers; run email-delivery.spec.ts separately)
npm run screenshots -- <dir> [routes]
npm run brand:assets        # regenerate logo variants, icons, OG image, finale points
npm run media:import -- "<folder>"   # import generated images into their slots
```

## Layout

- `src/app`: routes (`/`, `/capabilities`, `/work`, `/people`, `/careers`, `/careers/jobs`, `/insights`, `/insights/[slug]`, `/about`, `/contact`, `/privacy`, `/terms`, `/api/inquiry`).
- `src/components`: experience components (hero system, system map, capability map, build sequence, human network, industries world, finale) and shared chapters.
- `src/content`: all copy and facts, separate from components.
- `src/lib/lattice.ts`: the logo's geometry, used by every visual.
- `src/lib/inquiry`: validation, abuse controls and email delivery.

## Docs

`docs/DESIGN_SYSTEM.md`, `docs/DECISIONS.md`, `docs/CONTENT_INVENTORY.md`, `docs/IMAGE_BRIEF.md`, `docs/DEPLOY.md`, `docs/EMAIL_SETUP.md`, `docs/ASSET_LICENSES.md`, `docs/WORK_QUEUE.md`.

## Environment

See `.env.example`. Secrets (EmailJS keys) live only in the hosting platform.
