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
