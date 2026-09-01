# Focus Flow Map visual thesis

## Direction: blueprint drafting sheet

Focus audits are routes through an interface. The visual system treats each route as a technical drawing: measured, numbered, annotated, and ready to hand to another person. It borrows the usefulness of an architect's field sheet without imitating CAD software. Fine grid lines establish scale; cream paper panels hold the evidence; electric coral marks the current focus like a grease-pencil correction. The result should feel calm enough for an RSI-affected auditor and specific enough to read as an evidence tool, not another generic accessibility dashboard.

This is an intentionally single-mode treatment. A consistent midnight drafting field makes the extension overlay, popup, report, and landing site read as one product and keeps focus outlines predictable across arbitrary host pages. Cream evidence sheets provide the light reading surface within that field.

## Tokens

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Drafting field | `--ink-950` | `#071B26` | Page and overlay background |
| Deep line | `--ink-900` | `#0B2938` | Raised fields |
| Rule | `--blue-700` | `#225B72` | Grid and separators |
| Muted rule | `--blue-500` | `#4B849A` | Secondary UI outlines |
| Paper | `--paper-100` | `#F4EFD9` | Evidence cards and primary text on dark |
| Paper shadow | `--paper-300` | `#CDC6AB` | Muted text on dark |
| Signal | `--signal-400` | `#FF8066` | Active focus, primary action |
| Signal dark | `--signal-800` | `#702316` | Text on paper warning fields |
| Success | `--ok-400` | `#77D5AC` | Complete/save state |
| Warning | `--warn-300` | `#F4CB73` | Page jump and caution |
| Danger | `--danger-300` | `#FF9B92` | Error or suspected trap |

All body pairings meet WCAG AA: paper on ink is above 12:1, ink on paper above 12:1, signal on ink above 6:1. Signal is always paired with an icon, label, or shape.

## Type and spacing

- Display and body: `IBM Plex Sans`, locally subset as WOFF2, with system-ui fallback. Its engineered construction fits the drafting metaphor while remaining highly readable.
- Data and labels: `IBM Plex Mono`, locally subset as WOFF2, with ui-monospace fallback. Use tabular figures for step numbers, coordinates, and timestamps.
- Scale: 12px metadata, 14px labels, 16px body minimum, 20px h3, 26px h2, clamp(38px, 7vw, 72px) h1.
- Reading measure: 62 characters. Line height: 1.55 body, 1.08 display.
- Spacing follows a 4px base: 4, 8, 12, 16, 24, 32, 48, 72.
- Corners are restrained (2–12px) and used to distinguish paper notes from controls. Touch targets are at least 44px.

## Interaction grammar

- Primary action: a coral rectangular button with a small crosshair marker; verbs are explicit ("Start recording", "Export issue packet").
- Focus: a 3px paper outline plus 3px coral offset halo, visible on every field and control.
- Route steps: numbered circular stations connected by a ruled line. Page jumps use a double-rule break and a written page-movement label so color is never the sole signal.
- Recording state: a fixed, compact drafting ruler on the audited page shows step count and stop action. It never captures keystrokes or values.
- Empty/error/offline states: written as clipped field notes with one next action. Offline affects license verification only; free recording and exports remain available.
- Demo state: a cream drafting notice remains visible above a completed six-station route. Reset and exit controls use the same measured button grammar.
- Destructive actions name the object, confirm before deletion, and offer no ambiguous icon-only action.

## Motion policy

Interface transitions last 160–220ms and use opacity plus a 4px translation, suggesting a sheet placed on a table. Route lines draw once when a map appears; the recording marker has a slow, non-flashing 1.8s opacity pulse. Under `prefers-reduced-motion: reduce`, all transforms, smooth scrolling, pulses, and line drawing become instant/static. Nothing loops except the recording marker, and it is nonessential.

## Asset plan and provenance

- Hero illustration: an original raster editorial still of a dimensional blueprint sheet showing a numbered keyboard focus route, viewport frames, and measuring tools. It clarifies the output artifact without pretending to be a screenshot. Ship as responsive AVIF/WebP, with a PNG source retained under `assets/src/`.
- Icons and logo: hand-authored inline SVG using simple crosshair, arrow, file, and route geometry. No external icon library.
- Grid texture: CSS gradients, deterministic and code-native.

### Hero prompt sheet

Use case: `stylized-concept`

Asset type: responsive landing-page hero illustration.

Primary request: an editorial still life of a midnight-blue architectural drafting sheet that maps a keyboard Tab journey through a website as a sequence of numbered coral and cream focus stations connected by fine ruled paths, with two subtle viewport frames and one clear scroll-jump break.

World and materials: tactile blueprint paper, translucent vellum, a slim metal ruler, tiny registration crosses, crisp ink and subtle paper grain.

Composition: wide 3:2 landscape, oblique top-down view, the route rises from lower left to upper right, ample calm negative space, no human hands.

Light and lens: soft raking studio light, restrained shadows, 50mm editorial product lens, sharp primary sheet with gentle depth toward edges.

Palette words: midnight drafting blue, warm cream paper, electric coral marks, desaturated teal rules, small mint completion point.

Negative list: no text, no letters, no watermark, no logos, no brand marks, no browser chrome, no readable UI, no people, no neon gradient, no floating glass cards, no clutter.

Generated with the factory image model (`factory-image`, Azure AI Foundry) on 2026-08-27. The asset is original to Focus Flow Map and used under the product's MIT distribution. The final prompt is stored beside the source image in `assets/src/hero-blueprint.json`.

The 1200×630 social card is a center crop of the approved hero WebP. The 180×180 touch icon is resized from the hand-authored product mark. Both derivatives were produced locally with Sharp on 2026-08-30; no additional model or third-party asset was used.
