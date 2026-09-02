# Polish round 4 handoff — Focus Flow Map

- **Work order:** `focus-flow-map-polish-4`
- **Base review:** `699662b033409fcddff2434196f975837c072636`
- **Product commits:** `0d1debf`, `9d4dff6`, `c395635`
- **Final deployment:** `dfd7d80e-2587-492a-acc7-baecb08d7a10`
- **Production:** <https://focus-flow-map.sociobot.in>
- **Demo:** <https://focus-flow-map.sociobot.in/?demo=1>
- **Result:** PASS

## What changed

- Removed the unavailable Sociobot checkout action, price, purchase promise, and checkout constant from the site and extension.
- Added a clear **Pro license sales are unavailable** state. It explains that the product owner has not enabled checkout and offers no purchase action.
- Kept existing-license verification for any valid token. Free recording, redaction, downloads, and Markdown and JSON exports remain available.
- Replaced `pro-price` with the outcome-level `pro-unavailable` claim. The tagged test opens the packaged extension and site, proves no checkout action exists, and confirms free outputs remain.
- Updated Terms, README, the claims manifest, copy audit, and the verb-first 61-character catalog description.
- Rechecked every finding from reviews 1–3. Their routing, metadata, focus, demo isolation, mobile layout, 404, legal, terminology, and privacy repairs remain intact.
- Fixed the only additional axe CLI result by making review notes a named section. Site tests now require zero axe violations.

The complete finding-to-change-to-evidence matrix is in [.factory/polish-4.md](polish-4.md).

## Verification

Final clean clone: `/tmp/focus-flow-map-polish4-final.kwILYX` at `c395635`.

```bash
npm ci
# Every command in .factory/claims.json, run separately: 16/16 passed
npm run check
npm audit --omit=dev --audit-level=low
unzip -t dist/site/downloads/focus-flow-map-chrome.zip
```

Results:

- TypeScript passed.
- 18 unit tests passed.
- 50 browser tests passed; four intentional single-project cases skipped.
- Browser coverage includes desktop and 390×844 layouts, keyboard operation, route focus, metadata, zero-violation axe scans, privacy, local redaction, demo isolation, and offline reload.
- Production build produced `dist/site/` and the packaged Manifest V3 extension.
- Extension output: 92.05 kB. Site JavaScript: 5.33 kB raw / 2.15 kB gzip. Site CSS: 13.77 kB raw / 3.62 kB gzip.
- Production dependency audit: zero vulnerabilities. ZIP integrity: passed.

## Production evidence

- The work-order static deploy completed as `dfd7d80e-2587-492a-acc7-baecb08d7a10` against the existing `sf-focus-flow-map` resource.
- `verify-url.sh` passed home, demo, Privacy, Terms, and direct 404 with no console errors. Evidence is under `.factory/evidence/polish-4-live-*`.
- A real missing route returned HTTP 404 with **Page not found.**
- The cold 390×844 home showed the headline, audience, actions, and all three facts. The demo’s first route row began at y=596.64.
- Demo instrumentation touched only `demo:focus-flow-map:` storage, preserved the real-license sentinel, cleared demo state on exit, and made only same-origin requests.
- Home and packaged extension expose zero checkout links and zero Buy-license actions. Free download and export controls remain.
- Axe CLI 4.10.3 found zero violations on home, demo, Privacy, Terms, and 404.
- Mobile Lighthouse scored 100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO. LCP was 1.1 s, TBT 0 ms, and CLS 0.
- Live and local home HTML share SHA-256 `1a404e4a23815e7924bad61a4ba19b04f9dfd0360bb8719e58ac490b011d651d`.

Primary evidence: [final live summary](evidence/polish-4-live/final-live-summary.json), [unavailable Pro screenshot](evidence/polish-4-live/pro-unavailable-desktop.png), [phone home](evidence/polish-4-live/home-first-viewport.png), [phone demo](evidence/polish-4-live/demo-first-viewport.png), and [Lighthouse report](evidence/polish-4-lighthouse-live.json).

## Known gaps and next steps

No acceptance gap remains. Pro sales are intentionally unavailable until the product owner enables billing; the shipped product makes that state explicit and offers no dead action. If sales are enabled later, add a redirect-level checkout claim before restoring any purchase link.
