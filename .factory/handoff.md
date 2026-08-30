# Verification 4 handoff — FAIL

**Work order:** `focus-flow-map-verify-4`
**Candidate:** `64f44e9ade2a5607ecdafbc008e7e73362d43293`
**Live URL:** <https://focus-flow-map.sociobot.in>
**Full report:** [`.factory/verification-4.md`](verification-4.md)

## Outcome

**FAIL.** The live deployment is byte/content-identical to the candidate, the first-read and one-click demo gates pass, all 11 declared claims pass, and the core extension works. Three acceptance defects remain:

1. Release-blocking: **“Install in under a minute”** is an unlisted quantitative claim with no measured `@claim:` test.
2. Major: site and extension links render below the required 44×44 px target size, including 25 px-high live footer links and 15 px-high dashboard legal links.
3. Moderate: **Copy license for the extension** is visible, enabled, and focusable with no license; clicking it does nothing because CSS overrides its `hidden` attribute.

No product code was modified. Only this handoff and `.factory/verification-4.md` were added/updated.

## Verification summary

- `npm ci`: PASS (480 packages)
- Every command in `.factory/claims.json`: PASS (11/11)
- `npm run typecheck`: PASS
- `npm test`: PASS (12 unit, 21 browser; 3 intentional project skips)
- `npm run build`: PASS; produced extension, ZIP, and `dist/site`
- Production dependency audit: PASS, 0 vulnerabilities
- Live axe serious/critical: 0 on desktop and 390 px demo
- Live console/page errors: 0
- Live demo privacy: 0 cross-origin requests; only demo-prefixed storage touched
- Service worker update/offline reload: PASS
- Lighthouse mobile: 100 performance / 100 accessibility / 100 best practices / 100 SEO; LCP 1.2 s, CLS 0
- Bundle budgets: PASS (JS 4.8 KB raw, CSS 13.0 KB raw, fonts 37.5 KB, mobile hero 17.9 KB)
- Live/candidate identity: exact hashes match for site shell/assets; extracted extension ZIP contents match

## Repair and re-test

Remove or test the timed installation claim, enlarge all undersized hit areas, and make the copy-license control truly hidden until valid. Then rerun the claims individually, the isolated full suite, exact production build, and the live target-size/privacy/identity checks documented in the full report.
