# Verification 7 — Focus Flow Map

- **Candidate commit:** `7bcf0a7e5ad72b6166b459696a4365bb90a97747`
- **Verified URL:** <https://focus-flow-map.sociobot.in>
- **Demo URL:** <https://focus-flow-map.sociobot.in/?demo=1>
- **Date:** 2026-09-01 UTC
- **Result:** **PASS**

## First read

Cold loading the live landing page answered the required questions in plain words.

- **What it does:** “Map where Tab goes.” It records a keyboard focus route and turns it into a report.
- **Who it is for:** keyboard-only and RSI-affected users.
- **What to do first:** select **Try it with sample data**. The adjacent sentence says that it opens a finished route immediately.

The first screen also shows the three product facts: recording starts on the user’s command, routes use local extension storage, and Markdown/JSON reports are available. The one-click demo opens a six-step sample route and retains the “Demo — sample data, nothing is saved” banner with Reset demo and Start for real controls.

## Declared claims

`.factory/claims.json` exists and contains 17 claims. After `npm ci`, every declared command was run independently against the shipped demo-capable test entry point and passed:

`demo-isolated`, `keyboard-demo`, `mobile-first-view`, `chromium-package`, `explicit-recording`, `local-session-privacy`, `license-request-minimum-data`, `refund-revokes-pro`, `sensitive-redaction`, `markdown-json-export`, `route-checks`, `recorded-route-fields`, `history-limits`, `pro-local-notes`, `pro-price`, `original-image-provenance`, and `no-third-party-runtime`.

One procedural rerun encountered a stopped local preview listener and returned `ERR_CONNECTION_REFUSED` before page loading. Repeating the same declared command from a fresh preview passed, and the complete `npm run check` browser run recorded `passed` with no failed tests. This was a local runner-service interruption, not a product behavior result.

## Local build and product checks

- `npm ci` completed.
- `npm run check` completed: TypeScript check, 13 unit tests, 48 Playwright cases, and production build. Playwright’s final run record is `{"status":"passed","failedTests":[]}`.
- `npm run build` produced `dist/`.
- Representative end-to-end coverage passed: no recording before Start, empty recording stop, forward and backward route steps, input and URL redaction, Markdown/JSON export, free-history boundary of one local session, Pro-history boundary of 30 sessions, private note persistence, invalid license feedback, and recovery with a valid fixture.
- Production static assets: initial page JavaScript is 5,316 bytes raw (2,160 bytes gzip); home CSS is 13,798 bytes raw; the largest mobile hero AVIF is 17,917 bytes. These are within the stated budgets. The Chromium extension package is 91,760 bytes locally.
- `npm audit --omit=dev --audit-level=low` reported 0 production dependency advisories. `npm ci` reports 11 advisories in development dependencies; this does not affect the shipped runtime package.

## Live deployment checks

- Live landing HTML SHA-256 equals the candidate build output: `9f82eac484b37d12c32bd236a6902fff534d7f8d191534a86e0c86ed2a010cab`.
- The live downloaded extension ZIP has different archive metadata bytes, but its expanded file list and SHA-256 for every packaged file exactly match the local candidate build.
- `/`, `/?demo=1`, `/privacy/`, `/terms/`, and a real missing route were checked. The first four return 200; the missing route returns the designed 404 document with HTTP 404.
- `/opt/fleet/lib/verify-url.sh` passed on home, demo, Privacy, and Terms. Its output is retained in `.factory/evidence/verification-7/`. Those pages have titles, `lang="en"`, one `<h1>`, a `<main>`, image alt attributes, and no page or application-console errors.
- Direct live Playwright checks found no serious or critical axe findings on home, demo, Privacy, Terms, or the 404 document. At 390×844, the demo has no horizontal overflow; the navigation opens by keyboard and reports its expanded state. With reduced motion requested, the page reports the reduced-motion preference. Tab reaches Reset demo and review-note controls; Enter changes state; the focus indicator computes to a 3 px outline plus a visible 6 px ring.
- The completed demo reloads while offline after service-worker installation.
- The outgoing request log across home, demo, Privacy, Terms, and 404 contained only `https://focus-flow-map.sociobot.in` resources. No analytics, CDN font, frame, or session-content request was observed. The expected 404 navigation produces the browser’s normal HTTP-404 resource diagnostic; direct 404 document verification has no application error.
- Response headers include HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, restrictive Permissions Policy, and a CSP limiting scripts, fonts, images, and default resources to self. Hashed assets and fonts have `Cache-Control: public, max-age=31536000, immutable`; `sw.js` is `no-cache`.
- This is a static browser extension and landing site. It has no product-operated server endpoint, sign-in flow, or documented per-client API allowance to exercise. Optional license verification is delegated to the Sociobot billing service and was covered by the fixture claim without contacting billing.

## Severity summary

- **Release-blocking:** none.
- **High:** none.
- **Medium:** none.
- **Low:** none.
- **Informational:** development dependency advisories are reported by `npm ci`; the production-only audit is clear.

## Evidence

- `.factory/evidence/verification-7/live-home/verify.json`
- `.factory/evidence/verification-7/live-demo/verify.json`
- `.factory/evidence/verification-7/live-privacy/verify.json`
- `.factory/evidence/verification-7/live-terms/verify.json`
- `test-results/.last-run.json`
