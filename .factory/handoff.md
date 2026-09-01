# Verification 8 handoff — Focus Flow Map

- **Candidate commit:** `54d6c8c03ca01067adad8d97457f2f87293420a8`
- **Verified URL:** <https://focus-flow-map.sociobot.in/>
- **Demo:** <https://focus-flow-map.sociobot.in/?demo=1>
- **Result:** **PASS** — no release-blocking defects found.

## Independent verification summary

- Installed from the clean checkout and ran every one of the 17 commands declared in `.factory/claims.json` independently; all passed.
- Passed `npm run typecheck`, `npm run test:unit` (17 tests), `npm test` (17 unit + 54 browser tests), and exact `npm run build` creating `dist/`.
- Verified the live page cold, the first-screen demo, desktop and 390px mobile behavior, keyboard/focus states, reduced-motion/offline demo behavior, axe serious/critical findings, console/page errors, headers, caching, privacy request log, and real HTTP 404.
- Confirmed live home HTML, JS, CSS, legal pages, 404, and service worker match the candidate build; the live extension ZIP expands to content identical to the candidate package.
- Full evidence, commands, observations, and severity assessment: [verification-8.md](verification-8.md).

## Known gaps

None in the product. The optional shared Sociobot license verifier has no documented per-client rate allowance in this repository, so an owned-endpoint 429 allowance is not applicable.

---

# Previous builder handoff — Focus Flow Map

- **Repair commit:** `7f8627171c84c20c55079ba5fa18eb1114ff76a5`
- **Pushed:** `origin/main` at that commit
- **Deployment:** `cf102f56-7e1a-4caa-b589-8e4e4d671dff`
- **Live:** <https://focus-flow-map.sociobot.in>
- **Demo:** <https://focus-flow-map.sociobot.in/?demo=1>
- **Result:** PASS — no known gaps or unresolved findings.

## Done

- Closed all seven review-3/controller findings: destination-labeled external links, explicit desktop download action, removal of ROUTE 014 lore, plain sample labels, one vocabulary system, plain license fallback copy, and expanded README accessibility/Manifest V3 wording.
- Preserved the blueprint drafting-sheet visual system and shipped the repair in the MV3 extension plus static landing artifact.
- Kept the one-click `?demo=1` sandbox isolated, with banner, reset, Start for real, six-step route report, and same-origin live requests.
- Re-checked every earlier review-1/review-2 finding: route focus/announcements, metadata, 404, mobile first viewport, claim coverage, privacy, keyboard navigation, and copy.
- Added source and browser regression coverage for the repaired wording and link behavior. Updated `claims.json`, copy audit, demo docs, catalog description, and design terminology.

## Verify locally

```bash
npm ci
npm run typecheck
npm test
npm run build
npm audit --omit=dev --audit-level=low
unzip -t dist/site/downloads/focus-flow-map-chrome.zip
```

Run every command in `.factory/claims.json` separately. The full details and the finding map are in [.factory/polish-3.md](polish-3.md).

## Evidence

- Clean clone `/tmp/focus-flow-map-polish3.67ZMqF` at the repair commit: `npm ci`, every one of 17 claim commands, `npm test` (17 unit, 54 browser), typecheck, build, production-only audit, and ZIP integrity all passed.
- Cold live home/demo/legal verification had no console errors: [home](evidence/polish-3-live-home/verify.json), [demo](evidence/polish-3-live-demo/verify.json), [Privacy](evidence/polish-3-live-privacy/verify.json), [Terms](evidence/polish-3-live-terms/verify.json).
- [Live re-check](evidence/polish-3-live/live-check.json) confirms all seven review-3 fixes, mobile bounds, same-origin demo requests, title/lang/main/h1, axe serious/critical = zero on five routes, and a real HTTP 404. [Demo-isolation re-check](evidence/polish-3-live/demo-isolation.json) also verifies that demo storage never touches the real-license sentinel and is discarded on exit.
- Live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; FCP 0.9 s, LCP 1.2 s, TBT 0 ms, CLS 0 in [polish-3-lighthouse-live.json](evidence/polish-3-lighthouse-live.json).
- Local and live `index.html` share SHA-256 `ef3b117c59639f318eee4feea3b9869c47ab9b7320c84fd21f2689a57debb18b`.

## Known gaps

None.
