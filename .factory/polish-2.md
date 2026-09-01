# Polish round 2 — Focus Flow Map

- **Work order:** `focus-flow-map-polish-2`
- **Reviewed candidate:** `e8901c9fbf406cb62d8472b4573bcf56651cc53d`
- **Repair commit:** `b3fff797cee63642e2382e2aa1bd39a345bb7d6b`
- **Deployment:** `bc496a2d-1585-4a64-bfbe-5e68c96dca78`
- **Live URL:** <https://focus-flow-map.sociobot.in>
- **Result:** PASS — every review-2 finding is resolved on the deployed site.

All earlier review and polish reports were re-read. Review-1's route focus, route metadata, license-request, provenance/runtime, recorded-field, and plain-copy fixes remain present and covered by the clean-clone suite.

## Finding map

| Finding | Change made | Automated evidence | Live evidence |
| --- | --- | --- | --- |
| F-2-1 | Compacted the phone demo banner and intro, removed its repeated explanatory paragraphs on small screens, and brought the route sheet directly below the demo heading. | `@claim:mobile-first-view` opens the sample from home at 390×844 and asserts the first route row intersects the viewport. | [Demo first viewport](evidence/polish-2-live-demo/first-viewport-mobile.png) shows numbered steps 1–3 without scrolling. |
| F-2-2 | Added the three required product facts beside the phone primary action, before the illustration; the redundant lower strip is hidden only on small screens. | `@claim:mobile-first-view` asserts every fact intersects the 390×844 home viewport. | [Home first viewport](evidence/polish-2-live-home/first-viewport-mobile.png) shows all three facts. |
| F-2-3 | Removed the unverifiable device, merchant/refund-handler, and future-store promises. Kept the concrete refund result and added a fixture-backed claim. | `@claim:refund-revokes-pro` intercepts a refunded invalid license response and asserts Pro is inactive and its action is hidden. | The deployed price sheet says “A refund stops Pro features”; [Terms check](evidence/polish-2-live-terms/verify.json) is clean. |
| F-2-4 | Replaced the unsupported replay promise with “Review a finished six-step route.” | Full browser copy and semantic suite passes. | [Demo first viewport](evidence/polish-2-live-demo/first-viewport-mobile.png) shows the revised heading and static route. |
| F-2-5 | Rewrote free-tier, route-field, and sample-note copy in plain language across landing, README, privacy, and terms. | `npm test` passes the existing recorded-field, redaction, export, and copy checks; `.factory/copy-audit.md` records the revised text and word counts. | [Home check](evidence/polish-2-live-home/verify.json) has no console errors. |
| F-2-6 | Changed the designed 404 page h1 to “Page not found.” | Route metadata/semantic browser case passes. | [404 check](evidence/polish-2-live-404/verify.json); a cold unknown route returned HTTP 404. |
| F-2-7 | The mobile control now says “Open menu” when collapsed and “Close menu” when expanded, including its accessible name. | `390px navigation opens and closes by keyboard` asserts both names, `aria-expanded`, Escape, and focus return. | [Home first viewport](evidence/polish-2-live-home/first-viewport-mobile.png) shows “Open menu.” |

## Verification

- Fresh clone: `/tmp/focus-flow-map-polish2.6ezb3y`; `npm ci` succeeded.
- Every command in `.factory/claims.json` ran from that clone: all 17 claim commands passed, including the two new claim tests.
- Fresh clone `npm test` passed: 13 unit tests and 48 browser cases across desktop and 390 px projects (four expected extension/single-project skips).
- Fresh clone `npm run build` passed, produced `dist/site`, and `unzip -t dist/site/downloads/focus-flow-map-chrome.zip` reported no errors.
- `npm audit --omit=dev --audit-level=low` reported 0 vulnerabilities.
- `/opt/fleet/lib/verify-url.sh` passed cold live home, demo, privacy, terms, and 404 documents. Each has a title, `lang`, one h1, main landmark, image alt coverage, and no console errors. Evidence is under `.factory/evidence/polish-2-live-*`.
- Live Playwright axe checks at 390×844 found no serious or critical issue on home, demo, privacy, terms, or 404. The standalone axe CLI could not locate Chrome in this worker, so the repository's pinned Playwright browser and axe integration supplied the live check.
- The live home, demo, legal routes, direct 404, and an unknown URL were opened cold after deployment. The unknown URL returned HTTP 404.
