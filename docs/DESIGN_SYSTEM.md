# Design system

## Brand DNA (from the supplied logo)

| Logo feature | Design primitive | Where it is used |
|---|---|---|
| Maze of paths at 45 degrees, turning at right angles | The lattice: a square grid rotated 45 degrees (`src/lib/lattice.ts`) | Hero system, image placeholders, System connectors, Human network lines, Build object |
| Nested diamonds with gaps | Rings (`rings()`) | Hero core, Build "engineering" stage, placeholders |
| Small square at the centre | The core / node marker (`.node`, rotated square) | Labels, lists, buttons, the hero core |
| Dots where paths end | Endpoints | Hero, Build "intelligence", placeholders |
| Arrow breaking out top right | "What's next": the only diagonal arrow | Hero after waking, Build "impact", finale |
| Navy to teal gradient | ink to signal | Graphics only; text never uses gradients |

Personality: curious, confident, technical, human, restrained. The signature object is the lattice in different states: dormant (three points), awake (the maze), separated (scroll), built (Build sequence), reconnected (finale, where 655 points sampled from the logo become the mark).

## Colour

| Token | Value | Use |
|---|---|---|
| ink-950 | #07112f | Dark chapters, primary buttons on light |
| ink-900 | #08143c | Text on light (the logo navy) |
| ink-600 | #3e4a72 | Secondary text on paper (7.65:1) |
| ink-500 | #59648a | Smallest text allowed on paper (5.14:1) |
| ink-300 | #aeb6ce | Secondary text on dark (8.76:1) |
| signal-300 | #3fe0cc | Accent text on dark (10.76:1) |
| signal-700 | #08776d | Accent text on paper (4.80:1) |
| signal-400/500 | #14c9b5 / #02b5a3 | Graphics only |
| tide-500 | #2c7ba8 | Graphics (the gradient's middle) |
| paper / paper-2 / chalk | #f2f1ec / #e8e7e0 / #fbfbf8 | Light chapters and surfaces |

Light and dark chapters alternate (quiet, big, interactive, human, technical, cinematic, editorial, big question). Dark is deep navy, never pure black. No purple gradients, no neon glow, no glass.

## Typography

One family: **Archivo** (variable, SIL Open Font License, self-hosted by next/font). The width axis carries the hierarchy:

| Role | Utility | Width | Notes |
|---|---|---|---|
| Display | `t-display` | 125 | Uppercase, statements only |
| H1 / H2 | `t-h1`, `t-h2` | 125 / 118 | Uppercase |
| H3 | `t-h3` | 108 | Sentence case |
| Lead / body | `t-lead`, body | 100 | |
| Label | `t-label` | 112 | Buttons, tabs |
| Metadata | `t-meta` | 70 | Tiny uppercase, wide tracking |

## Motion

| Level | Duration token | Examples |
|---|---|---|
| Micro | `--dur-micro` 160ms | Button colour, arrow nudge |
| Component | `--dur-component` 320ms | Tabs, header tone, link underline |
| Section | `--dur-section` 700ms | Hero reveal, scene change, stage text |
| Cinematic | `--dur-cinematic` 1400ms | Hero rise, image mask |

Scroll storytelling uses native scrolling with `position: sticky` and one progress hook (`useScrollProgress`); there is no scroll hijacking. Every moving element pauses off-screen. Under reduced motion: no dormant state, sticky sections become static, scenes show still compositions, the finale shows the logo directly. Content never depends on motion.

Purpose of each motion moment: the hero wakes (the visitor starts the system), System separates and reconnects (the value is in the connection), capability scenes explain the capability, Build assembles the mark (how ideas become systems), Industries moves sideways (one connected world), the finale collapses into the logo (everything connects).

## Components

`SystemHero` + `LatticeEngine`, `SystemMap`, `CapabilityMap` + `CapabilityScene`, `BuildSequence`, `HumanNetwork`, `IndustryWorld`, `Visual` (image slot with procedural fallback), `Finale`, `InquiryForm`, chapters in `sections.tsx`, primitives in `ui.tsx`.

Rules: interactive maps use real buttons (tabs pattern, `aria-pressed`), lines and decoration are `aria-hidden`, element ids that could repeat across pages come from `useId()` or a `headingId` prop (React Activity keeps hidden pages in the DOM).
