# Image brief: generated visuals for clyneratech.com

The site is built with 23 image slots. Each slot already shows original lattice art in the right composition, so images can arrive in any order. Prompts are the owner's "Website Image Generation System" (2026-11-19); the prompt numbers below refer to that document.

## Status (2026-11-19)

22 of 23 slots hold the owner's supplied images (sources `images/4.png` to `11.png` from the chat), cropped with `scratchpad/crop-supplied.mjs` and imported with `npm run media:import`:

| Source | Slots |
|---|---|
| Glass architecture, dark left (4) | hero-system-desktop, hero-system-mobile, system-core-01, architecture-digital, industry-world |
| Glass cloud over servers at sunrise (6) | capability-cloud, insight-03, final-cta-horizon |
| Data wave between glass panels (7) | capability-data, insight-01, transition-everything-connects |
| Chip with capability panels (9) | capability-ai |
| Laptop with floating layers (11) | capability-software |
| Three colleagues at a glass model (5) | build-process, people-engineer-01, people-leader-01 |
| Five colleagues at a glass model (10) | talent-network, people-consultant-01, people-architect-01, people-recruiter-01 |
| Woman studying visualizations (8) | people-product-01, insight-02 |

`capability-security` still uses the drawn scene. Replacing any slot: save a new file with the slot's name in `images-inbox` and re-run the import.

## How to deliver

1. Generate the image with the prompt listed.
2. Save it with the **exact file name** below (any of .png, .jpg, .webp) into `Clynera/images-inbox`.
3. Run `npm run media:import -- "../images-inbox"` (or ask the agent). The script converts to WebP, resizes and strips metadata.

Global rules (owner's system): no embedded text, no logos, no fake statistics, no fake brand names, keep the stated side empty for typography.

## Slots

| # | File name | Prompt | Ratio | Where it appears | Keep empty for text | Notes |
|---|---|---|---|---|---|---|
| 1 | `hero-system-desktop` | 2. Hero | 21:9 | Home hero (desktop), behind the live lattice | Left 40% | Revealed through a diamond mask when the hero wakes. Highest priority. |
| 2 | `hero-system-mobile` | 3. Hero mobile | 9:16 | Home hero (phones) | Top half | Separate composition, not a crop. |
| 3 | `transition-everything-connects` | 4. Everything connects | 21:3 | Strip between hero and System | Above and below the band | Full width. |
| 4 | `system-core-01` | 5. System core | 1:1 | Centre of the System chapter (diamond window) | Edges | Shown inside a diamond crop. |
| 5 | `capability-ai` | 6. AI | 4:3 | Capability map window | Left 35% | Shown inside a diamond crop under the animated scene. |
| 6 | `capability-cloud` | 7. Cloud | 4:3 | Capability map window | Left | As above. |
| 7 | `capability-software` | 8. Software | 16:9 | Capability map window, Capabilities page feature | Around the object | |
| 8 | `capability-data` | 9. Data | 21:16 | Capability map window | One third | |
| 9 | `capability-security` | 10. Security | 4:3 | Capability map window | Right | |
| 10 | `talent-network` | 11. Talent | 16:9 | Human network background (home), People page | Left | Realistic people: shown with an "Illustration" tag. |
| 11 | `people-engineer-01` | 12. Portrait series | 2:3 | Hanging frames, People chapter | Slightly off-centre | Tagged "Illustration". |
| 12 | `people-architect-01` | 12. Portrait series | 2:3 | Hanging frames | | Tagged "Illustration". |
| 13 | `people-consultant-01` | 12. Portrait series | 2:3 | Hanging frames | | Tagged "Illustration". |
| 14 | `people-recruiter-01` | 12. Portrait series | 2:3 | Hanging frames | | Tagged "Illustration". |
| 15 | `people-leader-01` | 12. Portrait series | 2:3 | Hanging frames | | Tagged "Illustration". |
| 16 | `people-product-01` | 12. Portrait series (product thinker) | 2:3 | Hanging frames | | Tagged "Illustration". |
| 17 | `architecture-digital` | 13. Digital architecture | 21:16 | Company page | Generous | |
| 18 | `build-process` | 14. Build | 16:9 | Work page opening | Around the progression | |
| 19 | `industry-world` | 15. Industries | 21:3 | Behind the horizontal industries world (desktop) | Above and below | Moves at 30% of the panels' speed. |
| 20 | `insight-01` | 16. Editorial | 4:3 | Article: AI projects | Right | |
| 21 | `insight-02` | 16. Editorial | 4:3 | Article: talent as a system | Left | |
| 22 | `insight-03` | 16. Editorial | 4:3 | Article: adaptive software | Centre | |
| 23 | `final-cta-horizon` | 17. Final CTA | 21:9 | Behind "Everything connects." on every page | Centre stays calm | The logo forms at its point of light. |

Prompt 18 (decorative graphics) is not needed: lines, nodes, frames and markers are drawn in code from the logo's geometry, which keeps them sharp and light.

## Rules the site enforces

- Realistic people are always tagged "Illustration" and never named or captioned as Clynera Tech staff.
- Images never carry information the text does not also carry; every slot has alt text in `src/content/visuals.ts`.
- If a generated image shows text, numbers, logos or brand names, do not import it.
