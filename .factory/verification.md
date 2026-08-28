# Independent verification — FAIL

**Work order:** `focus-flow-map-verify-1`
**Candidate:** `02cfd2de7c7c8e99c4814b2b3bbe8891029ec090` (`main`)
**Verified:** 2026-08-28
**Live URL:** https://focus-flow-map.sociobot.in

## Verdict

**FAIL.** The candidate is functionally strong, but it does not meet the factory release contract: a clean checkout cannot run its declared typecheck or test quality gates, and its service worker cannot reliably update clients. The live host additionally does not apply the cache/security policy shipped in `site/public/_headers`.

No product source was changed during verification. This report and the handoff are the only commit changes.

## Reproduction and automated checks

Fresh `npm ci` completed (production dependency audit: `npm audit --omit=dev --audit-level=low` found **0** vulnerabilities). A full audit without `--omit=dev` reported 11 dependency advisories (1 low, 2 moderate, 5 high, 3 critical), all in development tooling.

| Command / check | Result | Evidence |
| --- | --- | --- |
| `npm run typecheck` immediately after `npm ci` | **FAIL** | `TS5083: Cannot read file '/work/repo/.wxt/tsconfig.json'`; WXT declaration also reports missing `PublicPath`. |
| `npm test` immediately after `npm ci` | **FAIL** | Both Vitest suites fail before tests run: `TSConfckParseError`, unable to resolve `./.wxt/tsconfig.json`. |
| Exact `npm run build` | PASS | Cleans, builds MV3, packages ZIP, and builds `dist/site`. Extension total: 84.79 KB. |
| `npm run typecheck` after build | PASS | `.wxt/tsconfig.json` is generated as a side effect of WXT build. |
| `npm test` after build | PASS | 6 Vitest tests and 12 Playwright desktop/mobile/site/extension tests passed. |
| `npm audit --omit=dev --audit-level=low` | PASS | 0 vulnerabilities. |
| Local mobile Lighthouse production preview | PASS | Performance 99, Accessibility 100; FCP/LCP/Speed Index 1.7 s, TBT 0 ms, CLS 0. |

The failure is reproducible from the commands the README tells a fresh contributor/CI worker to run. Passing only after a prior build does not satisfy the clean-checkout test/typecheck gate.

## End-to-end product evidence

Using the built MV3 package in a clean persistent Chromium profile against the production preview:

- Explicit service-worker start created the on-page, accessible recording ruler. No session existed before the start action.
- A paced `Tab`, `Tab`, `Tab`, `Shift+Tab` route saved four stations: Skip to main content → Focus Flow Map home → How it works → Focus Flow Map home, with the final direction correctly recorded as `backward`.
- A URL containing `email=private@example.com`, a token query string, and a fragment was stored/exported as `http://127.0.0.1:4173/`; neither secret appeared in exported JSON. Input values were not present.
- JSON export downloaded successfully; session deletion opened the native confirmation dialog and keyboard activation of **Keep session** recovered without deleting data.
- Empty dashboard help, normal report map, popup/report axe smoke tests, normal/invalid license flow, and network-error recovery were exercised. An invalid real billing token returned `{"valid":false,"reason":"invalid"}` and the UI announced “License no longer active.” A deliberately aborted retry produced the expected recovery text; its console network error was intentional.

## Accessibility, responsiveness, privacy, and runtime

- Live desktop and 390×844 mobile pages: no page errors, no unintentional console errors, and no serious/critical axe findings.
- Keyboard tab order starts at the skip link and reaches primary navigation, download, evidence controls, purchase, and restore controls. At 390 px the Menu button is focusable and Enter opens a 390 px-wide menu without horizontal overflow.
- Under `prefers-reduced-motion: reduce`, document scrolling is `auto`, decorative transforms resolve to `none`, and transitions reduce to `0.00001s`.
- Live first-load network capture contained only `focus-flow-map.sociobot.in` requests; source inspection confirms no analytics, tracking, third-party runtime scripts, CDN fonts, beacons, or remote session transmission. The only intentional external runtime request is the Sociobot billing verification after a user supplies/returns a license token.
- Bundle budgets pass: site JS 3,282 B raw (1,500 B gzip); CSS 11,502 B raw (3,210 B gzip); local fonts 37,476 B total; mobile hero AVIF 17,917 B. All are below the stipulated budgets.

## Deployment identity and response evidence

The live `index.html`, `assets/home-CZZAooOW.js`, and `assets/home-jqRNZ3AK.css` SHA-256 digests exactly matched the candidate build. The downloaded live extension ZIP archive differed byte-for-byte because archive metadata is non-deterministic, but its fully extracted contents matched the locally built ZIP (`diff -qr` clean). The live ZIP passed `unzip -t`.

The live service worker became active and controlled a reload; an offline reload then rendered the page and heading successfully. This establishes offline shell behavior, but does **not** clear the update defect below.

Live HTTP responses supplied HSTS, `X-Content-Type-Options`, and a strict-origin referrer policy. They did **not** supply CSP or Permissions-Policy. More importantly, every tested response (HTML, hashed JS/CSS, WOFF2, hero AVIF, ZIP, and service worker) had `Cache-Control: public, must-revalidate, max-age=30`; the shipped `_headers` policy specifies immutable one-year caching for `/assets/*` and `/fonts/*`, no-cache for `/sw.js`, `Referrer-Policy: no-referrer`, and Permissions-Policy. The deployment is therefore not applying the candidate's response policy.

## Defects

### P1 — clean checkout cannot run declared quality gates

**Reproduction:** fresh `npm ci`; run `npm run typecheck` or `npm test` before any WXT build.

`tsconfig.json` extends a generated `.wxt/tsconfig.json` but neither a prepare step nor the test/typecheck commands generate it. The result is an immediate typecheck/test failure. CI and a new contributor following README instructions cannot validate the candidate. Run `wxt prepare` (or an equivalent generated-config step) before typecheck/test without masking test failures, and demonstrate the clean sequence passes.

### P1 — service-worker updates can remain permanently stale

`site/public/sw.js` has a fixed `const CACHE = 'focus-flow-map-v1'` and a cache-first fetch handler. Its activate handler only deletes *other* cache names. On an updated deployment, a newly installed worker retains that same cache and continues serving cached `/`, assets, and prior responses before the network. The fixed name prevents an update from invalidating previous shell entries. Offline reload passed, but service-worker update correctness fails. Version the cache from the build/revision and use an update strategy that invalidates old shell entries (then test a v1→v2 update and offline reload).

### P2 — production does not apply its committed cache and browser policy

The deployed headers shown above contradict `site/public/_headers`. Hashed assets and fonts lack immutable caching, `sw.js` lacks no-cache, and CSP/Permissions-Policy are absent. This harms repeat-load performance and leaves the site without its intended browser response restrictions. Configure the deployment platform to honor the generated `_headers` (or provide its equivalent) and recheck actual response headers.

## Required re-verification

1. From a fresh checkout, run `npm ci && npm run typecheck && npm test && npm run build` successfully in that order.
2. Deploy a changed service-worker/cache revision, verify the old client updates to new content, then verify offline reload.
3. Confirm live headers apply immutable caching for hashed assets/fonts, no-cache for `sw.js`, no-referrer policy, Permissions-Policy, and an appropriate CSP.
