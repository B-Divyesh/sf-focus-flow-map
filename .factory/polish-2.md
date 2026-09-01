# Polish round 2 retry — Focus Flow Map

- **Work order:** `focus-flow-map-polish-2-retry1`
- **Reviewed candidate:** `30d3a3d40c737e6c2f4e7423db42d152a6c5478d`
- **Code repair commit:** `7af344e7bdd5cc83a1ab817e529ee16df4434559`
- **Deployment:** `3d4513ee-4b3b-459f-a5ca-2de61d6ec2a8`
- **Live URL:** <https://focus-flow-map.sociobot.in>
- **Result:** PASS — the controller regression and every review-1/review-2 finding are closed.

## Controller regression

| Finding | Change made | Automated evidence | Live evidence |
| --- | --- | --- | --- |
| Controller retry — 390 px test lost the menu button after activation | The responsive test now locates the stable `#menu-button` identity. It separately asserts the visible and accessible names before opening, after Enter, and after Escape. It also asserts `aria-expanded`, panel visibility, 44 px targets, and focus return. | `390px navigation opens and closes by keyboard` passes in both `desktop-chromium` and `mobile-390`. The clean-clone full suite passed 44 cases with four intentional project skips. | [Live check](evidence/polish-2-retry-live/live-check.json) records Open → Close → Open, the panel state, and focus return at 390×844. [First viewport](evidence/polish-2-retry-live/home-first-viewport.png) shows the control. |

## Review 2 finding map

| Finding | Change made | Automated evidence | Screenshot and live evidence |
| --- | --- | --- | --- |
| F-2-1 — phone demo lacked route data in its first viewport | Compacted the phone demo banner and intro and placed the route sheet directly after the heading. | `@claim:mobile-first-view` asserts that the first row intersects 390×844 after one click. | [Demo first viewport](evidence/polish-2-retry-live/demo-first-viewport.png); [live check](evidence/polish-2-retry-live/live-check.json) records row y=652.8 and six rows at <https://focus-flow-map.sociobot.in/?demo=1>. |
| F-2-2 — phone facts were below the first viewport | Added a compact three-line fact list before the phone illustration and hides only the duplicated lower strip. | `@claim:mobile-first-view` asserts all three facts fit within 390×844. | [Home first viewport](evidence/polish-2-retry-live/home-first-viewport.png); the live bounds are y=633.3–706.4 in [live-check.json](evidence/polish-2-retry-live/live-check.json). |
| F-2-3 — four undeclared license/distribution claims | Removed the device, payment-handler, and future-store statements. Replaced the refund sentence with tested product behavior. | `@claim:refund-revokes-pro` intercepts a refunded fixture response and proves Pro is disabled while the free page remains. | The live pricing sheet says “A refund stops Pro features.” Retired text is absent in [live-check.json](evidence/polish-2-retry-live/live-check.json). |
| F-2-4 — unsupported replay promise | Replaced “Replay” with “Review a finished six-step route.” | The site suite checks the sample and its six route rows. | The revised heading is recorded in [live-check.json](evidence/polish-2-retry-live/live-check.json) and visible in the [demo screenshot](evidence/polish-2-retry-live/demo-first-viewport.png). |
| F-2-5 — vague or technical copy | Rewrote free-tier, recorded-field, and focus-outline wording across the landing page, README, Privacy, and Terms. | The full copy/claims suite passes; [.factory/copy-audit.md](copy-audit.md) has no >22-word or banned-word flag. | The live demo note says “The browser detected no focus outline on Place order.” Retired wording is absent in [live-check.json](evidence/polish-2-retry-live/live-check.json). |
| F-2-6 — metaphorical 404 heading | Changed the heading to “Page not found.” | The 404 semantic and metadata cases pass in both browser projects. | A cold unknown URL returns HTTP 404 with the new heading in [live-check.json](evidence/polish-2-retry-live/live-check.json). |
| F-2-7 — menu label did not name its result | The button says “Open menu” when closed and “Close menu” when open, visually and accessibly. | The repaired 390 px keyboard test passes in both projects and checks Enter, Escape, state, target size, and focus return. | [Live check](evidence/polish-2-retry-live/live-check.json) records both names and states at 390×844. |

## Review 1 carry-forward map

| Finding | Current implementation | Evidence |
| --- | --- | --- |
| F-1-1 — route focus | Every page h1 has `tabindex="-1"`; cold navigation and Back focus and announce the new heading. | `route changes move focus to the new h1 and announce it`; live values in [live-check.json](evidence/polish-2-retry-live/live-check.json). |
| F-1-2 — route metadata | Home, demo, Privacy, Terms, 404, and unknown-route rendering retain route-specific titles, descriptions, canonical, Open Graph, Twitter, favicon, and touch icon data. | Ten metadata cases pass across both projects; live route matrix in [live-check.json](evidence/polish-2-retry-live/live-check.json). |
| F-1-3 — license-request claim | `license-request-minimum-data` remains declared and fixture-tested. | The claim command proves one GET query token, no body, and no token header. |
| F-1-4 — provenance/runtime claims | `original-image-provenance` and `no-third-party-runtime` remain declared and tested. | Both claim commands pass; the live cold flow made no external request in [live-check.json](evidence/polish-2-retry-live/live-check.json). |
| F-1-5 — recorded route fields | `recorded-route-fields` remains declared and checks every stored field and redacted locator. | Its clean-clone extension claim command passes. |
| F-1-6 — unexplained terms | The report/manual-check and payment/refund wording remains plain and the retired terms remain absent. | Copy audit passes and the live retired-copy scan is empty. |

## Verification evidence

- Clean clone: `/tmp/focus-flow-map-polish2-retry.nO2WGY`, checked out at `7af344e7bdd5cc83a1ab817e529ee16df4434559`; `npm ci` succeeded.
- All 17 commands in [.factory/claims.json](claims.json) passed individually.
- Clean-clone `npm run check` passed typecheck, 13 unit tests, 44 browser tests, four intentional project skips, and the production build.
- `npm audit --omit=dev --audit-level=low` found 0 production vulnerabilities.
- `unzip -t dist/site/downloads/focus-flow-map-chrome.zip` found no archive errors. The extension build totals 91.76 kB; site JS is 5.32 kB raw and CSS is 16.13 kB raw.
- `/opt/fleet/lib/verify-url.sh` passed cold live home, demo, Privacy, Terms, and direct 404 documents. Evidence: [home](evidence/polish-2-retry-live-home/verify.json), [demo](evidence/polish-2-retry-live-demo/verify.json), [Privacy](evidence/polish-2-retry-live-privacy/verify.json), [Terms](evidence/polish-2-retry-live-terms/verify.json), and [404](evidence/polish-2-retry-live-404/verify.json).
- Live Playwright/axe checks found no serious or critical issue and no horizontal overflow on all five routes at 390×844. The isolated live demo also survived an offline reload with all six rows.
- Live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0. Report: [polish-2-retry-lighthouse-live.json](evidence/polish-2-retry-lighthouse-live.json).
- Home build/deploy SHA-256 matched: `9f82eac484b37d12c32bd236a6902fff534d7f8d191534a86e0c86ed2a010cab`.

No finding of any severity remains open.
