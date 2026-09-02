# Polish 5 handoff — Focus Flow Map

- **Work order:** `focus-flow-map-polish-5`
- **Implementation commit:** `c951aa3c848cba5bdf7777f469873e4402557bb6`
- **Deployment:** `538bc601-c310-4d8a-9a74-becb10563e8b`
- **Production:** <https://focus-flow-map.sociobot.in>
- **Demo:** <https://focus-flow-map.sociobot.in/?demo=1>
- **Status:** PASS — all findings from reviews 1–5 are resolved.

## What changed

- Replaced the broad offline download promise with **“Offline. The sample route remains available after your first visit.”**
- Added the `offline-sample-route` claim and one isolated Playwright test. It visits the demo online, switches only its own context offline, reloads, verifies all six rows, toggles review notes, and resets the sample.
- Replaced the extension dashboard’s similar unbounded offline promise with a direct reconnection instruction.
- Updated the README, demo documentation, copy audit, and the 61-character verb-first catalog description.
- Preserved all earlier repairs: first-screen copy, one-click isolated demo, mobile placement, route metadata/focus/404, legal links, local redaction and exports, unavailable Pro state, and the blueprint drafting-sheet identity.
- Added `scripts/verify-live.mjs` for repeatable post-deploy checks of the production routes, demo isolation, mobile bounds, focus, links, headers, offline behavior, and 404.

## Verification

From clean clone `/tmp/focus-flow-map-polish5-final.IsQKt2` at `c951aa3`:

```bash
npm ci
npm run check
npm audit --omit=dev --audit-level=low
unzip -t dist/site/downloads/focus-flow-map-chrome.zip
# Each of the 17 commands in .factory/claims.json was also run separately.
```

Results: 18 unit tests and 50 browser tests passed, with four intentional single-project skips. TypeScript and both builds passed. All 17 claim commands passed. The production dependency audit found zero vulnerabilities. The extension archive passed integrity checking.

Post-deploy checks:

```bash
/opt/fleet/lib/verify-url.sh <route> <evidence-dir>
npx @axe-core/cli <five production routes> --exit
node scripts/verify-live.mjs
```

- Home, demo, Privacy, Terms, and direct 404 checks returned 200 with no console errors. A cold unknown path returned HTTP 404.
- Axe reported zero violations on all five production documents.
- At 390×844, all three first-screen facts end by y=706.36. The first demo row starts at y=596.64.
- The live demo touched only `demo:focus-flow-map:` storage, kept the real-license sentinel, cleared demo state on exit, and made only same-origin requests.
- The live demo reloaded offline with six rows; review-note toggle and Reset demo both worked.
- Mobile Lighthouse scores are 100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO. LCP is 1.1 s, TBT is 0 ms, and CLS is 0.
- Live and local home HTML share SHA-256 `857ffa85fc35f3fda9741cafce2b4a4adb97e49b74dd87ac2e969a4e331f664d`.

Detailed mapping and evidence: [polish-5.md](polish-5.md), [live check](evidence/polish-5-live/live-check.json), and [Lighthouse report](evidence/polish-5-lighthouse-live.json).

## Known gaps and next steps

No acceptance gap remains. Pro sales remain intentionally unavailable until the product owner enables checkout; the product offers no purchase action and keeps the complete free recording/export path available.
