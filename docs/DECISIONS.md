# Decisions

## ADR-001: Reuse the tested Syntax Flow engineering, not its design (2026-11-19)

**Decision.** The inquiry endpoint, EmailJS adapter, abuse controls, security headers, CSP and E2E harness come from the owner's Syntax Flow project, adapted to Clynera's four topics. Design, copy, visuals and components are new; the brief forbids copying Syntax Flow.

## ADR-002: Static pages with a static CSP (2026-11-19)

Pages are prerendered (Cache Components). Scripts are limited to this origin with `'unsafe-inline'` for the framework bootstrap and the small boot script in `layout.tsx`. No third-party scripts. Revisit when adding authentication or third-party code.

## ADR-003: Native scroll, no GSAP, ScrollTrigger, Lenis or Framer Motion (2026-11-19)

The brief lists these as options. Every scroll sequence here (System, Build, Industries) is a sticky section driven by one progress hook, and reveals use CSS scroll-driven animations. That covers the story without 60 to 100 KB of libraries or scroll hijacking.

## ADR-004: Canvas 2D and SVG instead of WebGL (2026-11-19)

The signature system is line geometry from the logo. Canvas 2D draws it at full frame rate with a small budget (about 200 paths), pauses off-screen and has a still frame for reduced motion. WebGL would add weight without adding meaning. Revisit if a later chapter needs real 3D.

## ADR-005: One font family (2026-11-19)

Archivo variable; the width axis provides display, body and metadata roles. One self-hosted file, no layout shift from late fonts.

## ADR-006: Image slots with procedural fallbacks (2026-11-19)

The owner is generating images with an AI tool. Each placement is a named slot (`src/content/visuals.ts`, `docs/IMAGE_BRIEF.md`); missing images render lattice art in the same composition, so the site is complete without them and improves as they arrive. Realistic people are tagged "Illustration".

## ADR-007: Hero dormant state without hiding content (2026-11-19)

The hero opens on "Start here." and wakes on the first interaction or after 2.6 seconds. The real heading and links are in the HTML from the start; only opacity changes, so search engines and screen readers always get them. No JavaScript, reduced motion or a repeat visit in the same session skip the dormant state.

## ADR-008: Page transitions with React ViewTransition (2026-11-19)

Navigations collapse the page into the clicked point and grow the next page from it (`::view-transition-*(.page)` in `globals.css`). Browsers without the View Transitions API navigate normally; reduced motion disables the animation.

## ADR-009: No analytics (2026-11-19)

No tracking scripts or cookies, matching the privacy notice. If analytics are added, choose a privacy-respecting tool and update the notice first.

## ADR-010: New verbal identity, "Every system is a maze. We find the way through." (2026-11-19)

**Context.** The owner asked for completely different taglines and content, not the launch copy (which reused the creative brief's sample lines and echoed the Syntax Flow site).
**Decision.** The voice comes from the logo itself: a maze with an arrow breaking out. Technology is the maze, Clynera Tech the guide, specialists the people who walk it. Every headline, description, concept, industry line, story stage, principle and article was rewritten. Category words (IT services, IT consulting, IT staffing) stay in titles, metadata and the hero.
**Consequences.** Old URLs keep working: `/company` redirects to `/about`; the three original article slugs redirect to `/insights`.

## ADR-011: Careers with a real job search and no invented openings (2026-11-19)

**Decision.** `/careers` explains how candidates work with us; `/careers/jobs` is a working search (keyword, job type, work style) over `src/content/jobs.ts`. The list is empty because no openings were supplied, so the page says so and offers the talent network. Each future listing is published with JobPosting structured data, which is why only genuine, current vacancies may be added.

## ADR-012: Owner-supplied images, cropped per slot (2026-11-19)

**Decision.** Eight of the eleven supplied images are used, cropped to slot ratios around their subject (crop plan in docs/IMAGE_BRIEF.md). Three were rejected: two show embedded slogans and service claims not supplied by the company ("Internship Programs"), one shows another brand name and invented metrics. Images with realistic people carry the "Illustration" tag.
