# Clynera Tech website: agent instructions

@AGENTS.md

This repository follows the owner's Website & Product Constitution (supplied separately). Project-specific rules:

## Before changing code

- This Next.js version differs from older training data. Read the relevant guide in `node_modules/next/dist/docs/` first.
- Cache Components is on. Hidden pages stay mounted (React Activity), so element ids that could repeat across pages must come from `useId()` or a `headingId` prop; use `getByRole` in tests; no `new Date()` or `Math.random()` in prerendered server code.
- Facts live in `src/content/site.ts`. Never invent clients, metrics, testimonials, certifications, history or people. Never publish the EIN or E-Verify company ID (a test enforces this).
- Visuals come from `src/lib/lattice.ts` (the logo's 45 degree geometry). Do not add a second visual metaphor.

## Done means

```bash
npm run lint && npm run typecheck && npm run build && npm run test:e2e
npm run screenshots -- <scratch-dir> <routes>   # inspect desktop and phone captures
```

## Easy to break

- The inquiry endpoint must never report success for an inquiry that was not delivered.
- `INQUIRY_DELIVERY=log` and `E2E_TEST_MODE` are for local and CI test runs only.
- Hero content must stay in the accessibility tree during the dormant state (opacity only).
- Text in docs, comments and commits: no em dashes.
