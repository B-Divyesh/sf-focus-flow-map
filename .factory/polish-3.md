# Polish round 3 — Focus Flow Map

- **Work order:** `focus-flow-map-polish-3`
- **Reviewed candidate:** `b8f7e23479e562eb9c33a87cebc4fd54508f0b87`
- **Repair commit:** `7f8627171c84c20c55079ba5fa18eb1114ff76a5`
- **Deployment:** `cf102f56-7e1a-4caa-b589-8e4e4d671dff`
- **Live:** <https://focus-flow-map.sociobot.in>
- **Demo:** <https://focus-flow-map.sociobot.in/?demo=1>
- **Result:** PASS — all review-1, review-2, review-3, and controller findings are closed.

## Review 3 and controller findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 external destinations | Named every external site destination in visible or accessible link text: Sociobot checkout, GitHub source, GitHub issues; did the same in the extension dashboard. | `external site links name their destination and say they leave the product`; `plain product language > names every external website destination`; live [check](evidence/polish-3-live/live-check.json) lists all three labels. |
| F-3-2 desktop Download | Changed the desktop header to **Download extension**, matching the mobile menu. | `site uses the same download label…`; [desktop screenshot](evidence/polish-3-live/home-desktop.png); live check records `desktopDownload: 1`. |
| F-3-3 ROUTE 014 | Replaced the decorative number with **Example focus route**. | `site uses the same download label…`; `plain product language > keeps the sample…`; [desktop screenshot](evidence/polish-3-live/home-desktop.png); live count is zero. |
| F-3-4 sample shorthand | Replaced HTML tag, `y`, `px`, and viewport shorthand with Link/Button/Text field, page position, Tab, and page-movement labels. | `site uses the same download label…`; [phone demo](evidence/polish-3-live/demo-mobile.png); live check records all labels and first row `y=596.64`. |
| F-3-5 inconsistent terms | Standardized the customer vocabulary: **focus route** for the sequence, **route report** for the result, **review notes** for checks, across the site, legal pages, README, and extension dashboard. | `plain product language > uses focus route, route report, and review notes`; [live check](evidence/polish-3-live/live-check.json). |
| F-3-6 license fallback copy | Rewrote stale-license and blocked-copy messages with a familiar next step. | `license fallback messages give a familiar next step`; [live check](evidence/polish-3-live/live-check.json) records both exact messages. |
| F-3-7 README abbreviations | Changed “axe checks” to “automated accessibility checks”; expanded the first product-facing use to **Manifest V3 (MV3)** and used **Manifest V3 extension** in Architecture. | `plain product language > expands development abbreviations in reader-facing README copy`. |

## Earlier findings retained and re-verified

| Finding | Change retained | Evidence |
| --- | --- | --- |
| F-1-1 route focus | Every route h1 is focusable; `route-focus.js` focuses and announces it on navigation and Back. | `route changes move focus to the new h1 and announce it` passes. |
| F-1-2 route metadata | Home, demo, Privacy, Terms, and 404 have their own canonical, Open Graph, Twitter, icon, and title metadata. | All five `has complete route-specific metadata` cases pass; live check records titles, canonical URLs, h1s, and language. |
| F-1-3 license minimum data | Declared `license-request-minimum-data` and fixture-tested the GET token-only request. | `@claim:license-request-minimum-data` passed separately in the clean clone. |
| F-1-4 provenance/runtime claims | Declared original-image and third-party-runtime claims and test them from a fresh context. | `@claim:original-image-provenance` and `@claim:no-third-party-runtime` passed; live demo requests are same-origin in [live-check.json](evidence/polish-3-live/live-check.json), and [demo-isolation.json](evidence/polish-3-live/demo-isolation.json) verifies the real-license sentinel stays unchanged while demo storage is discarded on exit. |
| F-1-5 recorded fields | Declared every recorded field and check it in a controlled extension capture. | `@claim:recorded-route-fields` passed separately in the clean clone. |
| F-1-6 unexplained terms | Replaced the retired report/payment jargon and now reject retired wording in copy tests. | The current [copy audit](copy-audit.md) and `plain product language` test pass. |
| F-2-1 phone demo data | Phone demo layout puts the route sheet directly under its heading. | `@claim:mobile-first-view` passed; live first demo row is at y=596.64 in [demo screenshot](evidence/polish-3-live/demo-mobile.png). |
| F-2-2 phone product facts | Phone-only fact strip appears before the illustration. | `@claim:mobile-first-view` passed; live facts occupy y=633.30–706.36 in [home screenshot](evidence/polish-3-live/home-mobile.png). |
| F-2-3 undeclared claims | The complete 17-entry claims manifest covers every current product claim. | Every claim command passed separately from a clean clone. |
| F-2-4 unsupported replay | Replaced the replay promise with a literal route-report review heading. | The product says “Review a six-step route report”; `site uses the same download label…` checks the rendered heading. |
| F-2-5 vague copy | Rewrote field/free-tier/focus wording and added the terminology regression test. | The refreshed [copy audit](copy-audit.md) has no banned terms or sentence over 22 words. |
| F-2-6 404 lore | Replaced the metaphor with **Page not found.** and retained a working return link. | The live unknown URL returns HTTP 404 and no serious/critical axe finding in [live-check.json](evidence/polish-3-live/live-check.json). |
| F-2-7 menu label / controller retry | Menu uses explicit Open menu/Close menu states with keyboard close and focus return. | `390px navigation opens and closes by keyboard` passes label, `aria-expanded`, Escape, focus return, and 44 px controls. |

## Verification

- Fresh clone: `/tmp/focus-flow-map-polish3.67ZMqF` at `7f8627171c84c20c55079ba5fa18eb1114ff76a5`; `npm ci` succeeded.
- Every command in [claims.json](claims.json) ran separately and passed: 17 of 17 claims.
- Clean clone: `npm test` passed 17 unit tests and 54 browser tests; `npm run typecheck` and `npm run build` passed.
- `npm audit --omit=dev --audit-level=low`: 0 vulnerabilities. `unzip -t dist/site/downloads/focus-flow-map-chrome.zip`: passed.
- Cold live `verify-url.sh` checks pass for home, demo, Privacy, and Terms: [home](evidence/polish-3-live-home/verify.json), [demo](evidence/polish-3-live-demo/verify.json), [Privacy](evidence/polish-3-live-privacy/verify.json), [Terms](evidence/polish-3-live-terms/verify.json). The custom live check additionally verifies real HTTP 404, console cleanliness, all reviewed wording, mobile bounds, demo isolation requests, and axe on five routes. The separate [demo-isolation re-check](evidence/polish-3-live/demo-isolation.json) proves no real storage is read or written while demo is active, its data is discarded on exit, and all requests are same-origin.
- Live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; FCP 0.9 s, LCP 1.2 s, TBT 0 ms, CLS 0. Report: [polish-3-lighthouse-live.json](evidence/polish-3-lighthouse-live.json).
- The deployed home HTML SHA-256 matches local `dist/site/index.html`: `ef3b117c59639f318eee4feea3b9869c47ab9b7320c84fd21f2689a57debb18b`.

No finding remains open.
