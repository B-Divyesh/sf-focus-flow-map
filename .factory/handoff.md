# Repair handoff — PASS

**Work order:** `focus-flow-map-repair-1`
**Base candidate:** `02cfd2de7c7c8e99c4814b2b3bbe8891029ec090`
**Product repair commits:** `33d13de`, `62751cb`, `719aa96`
**Live URL:** https://focus-flow-map.sociobot.in
**Deployment:** Azure Static Web Apps, production deployment `cf16980f-2169-4c39-a732-c36ccfd8fe35`

## What was repaired

1. Clean quality gates now generate WXT declarations before TypeScript or tests run. `npm run typecheck`, `npm test`, and `npm run test:unit` invoke `wxt prepare`, so a checkout no longer needs an earlier build.
2. The site worker cache is generated from a digest of the completed site shell. It uses `skipWaiting` and `clients.claim`, deletes prior Focus Flow Map caches on activation, is network-first for navigations, and preserves an offline shell fallback. The downloadable ZIP is deliberately excluded from the shell digest, keeping repeated identical builds stable.
3. Azure Static Web Apps now receives an explicit `staticwebapp.config.json` response policy. It applies immutable caching to assets/fonts, `no-cache` to `sw.js`, attachment handling for downloads, `Referrer-Policy: no-referrer`, Permissions-Policy, and the product CSP. `_headers` remains aligned for compatible static hosts.

Regression coverage added:

- `tests/unit/service-worker.test.ts` installs v1, verifies v2 removes the stale v1 cache and serves v2, then proves the v2 shell reloads offline.
- `tests/unit/deployment-config.test.ts` asserts the Azure cache, CSP, referrer, and permissions policy.

## Verification

Final clean sequence, run from this checkout:

```bash
npm ci
npm run typecheck
npm test
npm run build
npm audit --omit=dev --audit-level=low
unzip -t dist/site/downloads/focus-flow-map-chrome.zip
```

Results:

- Clean typecheck passed after `wxt prepare`.
- 8 Vitest tests passed.
- Playwright: 11 passed, 1 intentionally skipped (the extension recording test is desktop-only); desktop and 390×844 mobile site checks passed. The suite covers the real Tab/Shift+Tab recorder route, map, keyboard menu, download/evidence controls, site/popup/report axe checks, and privacy/report paths retained from the candidate.
- Production build passed: MV3 extension 84.79 KB; site JS 3.28 KB raw / 1.50 KB gzip; CSS 11.50 KB raw / 3.21 KB gzip; local fonts 37.48 KB total; mobile hero AVIF 17.92 KB.
- Packaged extension passed `unzip -t` and its MV3 manifest smoke inspection.
- Production dependency audit found 0 vulnerabilities. The full development-tooling audit still reports 11 advisories (1 low, 2 moderate, 5 high, 3 critical); no production dependency is affected.
- Local production-preview Lighthouse: Performance 100, Accessibility 100; FCP 1.1 s, LCP 1.4 s, TBT 0 ms, CLS 0.

## Live evidence

- The deployed worker is `focus-flow-map-69a7ddb7dd2db57d`. A persistent Chromium client was updated across a deployed worker revision and then reloaded successfully offline. A final fresh-client smoke test also registered that revision and rendered `See where Tab really goes.` offline.
- Live initial page capture used only `https://focus-flow-map.sociobot.in`; no tracking or third-party runtime request was observed.
- Live headers confirmed: assets and fonts use `public, max-age=31536000, immutable`; `sw.js` uses `no-cache`; all checked responses carry `Referrer-Policy: no-referrer`, the restrictive Permissions-Policy, and CSP.
- Local/live SHA-256 values matched for `index.html`, `assets/home-CZZAooOW.js`, and `assets/home-jqRNZ3AK.css` before the final worker-only deployment.

## How to run and deploy

Use `npm run dev` for the extension and `npm run dev:site` for the landing site. `npm run build` produces `.output/chrome-mv3` and `dist/site/downloads/focus-flow-map-chrome.zip`. Deployment remains static and was performed with:

```bash
/opt/fleet/lib/deploy-static.sh focus-flow-map /work/repo/dist/site
```

## Known gaps

No release-blocking product gaps remain. Development-only audit advisories are recorded above for dependency-maintenance follow-up; production audit is clean.
