# Verification 8 — Focus Flow Map

- **Candidate commit:** `54d6c8c03ca01067adad8d97457f2f87293420a8`
- **Verified URL:** <https://focus-flow-map.sociobot.in/>
- **Demo URL:** <https://focus-flow-map.sociobot.in/?demo=1>
- **Date:** 2026-09-01 UTC
- **Result:** **PASS**

## First read

Freshly opening the live page makes the product clear without setup:

- It does: “Map where Tab goes.” It records a focus route and makes a route report.
- It is for: keyboard-only and RSI-affected users.
- First action: **Try it with sample data**; the adjacent copy says a finished route report opens immediately.

The first screen contains the three stated facts (recording begins on command, reports use local extension storage, and Markdown/JSON exports are free). One click opens the six-step sample report and its persistent **Demo — sample data, nothing is saved** banner, with Reset demo and Start for real controls.

## Required claim checks

`.factory/claims.json` is present with 17 entries. From this clean checkout, after `npm ci`, I ran every command it declares independently. All passed:

| Claim IDs | Result |
| --- | --- |
| `demo-isolated`, `keyboard-demo`, `mobile-first-view`, `chromium-package` | PASS |
| `explicit-recording`, `local-session-privacy`, `sensitive-redaction`, `markdown-json-export`, `recorded-route-fields` | PASS |
| `license-request-minimum-data`, `refund-revokes-pro` | PASS |
| `route-checks`, `original-image-provenance` | PASS |
| `history-limits`, `pro-local-notes`, `pro-price`, `no-third-party-runtime` | PASS |

The e2e claim command log is `/tmp/ffm-claim-commands.log` for this verification session; its final status is `PASS`. The unit claim commands passed separately. The claims exercise the shipped demo/test entry point, real MV3 extension profile, local storage, report export downloads, and fixture-backed license outcomes.

## Local quality gates

- `npm ci` — PASS (the install reports 11 dependency advisories, all in development dependencies).
- `npm run typecheck` — PASS.
- `npm run test:unit` — PASS: 17 tests in 7 files.
- `npm test` — PASS: 17 unit tests and 54 Playwright tests; final Playwright record was `{"status":"passed","failedTests":[]}`.
- `npm run build` — PASS and created `dist/`.
- There is no lint script in `package.json`.

The production site bundle is 5,333 bytes of initial JS (2,150 bytes gzip) and 13,798 bytes CSS (3,640 bytes gzip). The mobile hero AVIF is 17,917 bytes. These are inside the static-product budgets. The production MV3 extension output totals 92.13 KB before ZIP packaging.

Representative end-to-end coverage passed for explicit recording, no recording before start, redaction of input values/query/hash/sensitive paths, forward and backward route steps, route checks, Markdown and JSON downloads, free one-session and Pro 30-session boundaries, local notes, inactive/refunded license recovery, and no remote audit-content request.

## Live deployment and browser QA

- Cold `verify-url.sh` checks passed for home, demo, Privacy, and Terms: each was HTTP 200 with title, `lang="en"`, exactly one `<h1>`, `<main>`, no missing image `alt`, and no console/page error.
- Live Playwright plus axe found **zero serious or critical** violations on desktop home/demo and the 390×844 demo. Keyboard Tab exposed a solid visible focus outline on interactive controls; the demo’s Reset and review-notes controls work with Enter in the independent claim check.
- At 390×844 the three facts are fully inside the first viewport (their bottoms were 655, 681, and 706 px) and the first demo route row is visible after one click (597–665 px). There is no horizontal overflow.
- The live demo installed a service worker and reloaded offline with all six rows and the demo banner still present. Under reduced motion, computed root scrolling was `auto`; the motion stylesheet applies the reduced-motion override and the full suite includes its responsive/reduced-motion coverage.
- The home-to-demo outgoing-request log contained only `https://focus-flow-map.sociobot.in` document, self-hosted script, CSS, font, SVG, and image requests. It contained no analytics, CDN font, frame, XHR/fetch audit submission, or console/page error.
- Response headers include HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, a restrictive Permissions Policy, and a self-only CSP with the explicit Sociobot license-verification origin in `connect-src`. Hashed JS/CSS/image assets are `max-age=31536000, immutable`; `sw.js` is `no-cache`; missing routes return a real HTTP 404.

## Deployment identity

The live home HTML is byte-identical to `dist/site/index.html` from the candidate build:

`ef3b117c59639f318eee4feea3b9869c47ab9b7320c84fd21f2689a57debb18b`

Live JS, CSS, Privacy, Terms, 404, and service-worker bytes also match the candidate build. The live extension ZIP differs at archive level because its ZIP timestamps are from deployment, but expanding both archives produced an empty recursive diff: all 22 packaged extension files have identical names and contents.

## Endpoint allowance and sign-in

This static browser extension/site has no product-operated server endpoint or sign-in flow. Its only server URL is the shared Sociobot license verifier. The repository documents no per-client request allowance for that external service, so no rate-limit allowance can be observed or product endpoint can be driven to 429 without testing a shared service outside this product’s ownership. The fixture-backed claim confirms the verifier request is a token-only GET with no body; a single non-sensitive invalid-token request returned the expected 200 invalid response. No user authentication is implemented, so no non-Entra sign-in provider is present.

## Defects by severity

- **Release-blocking:** none.
- **High:** none.
- **Medium:** none.
- **Low:** none.
- **Informational:** `npm ci` reports 11 advisories in dev dependencies. The production artifact has no runtime dependencies beyond its own static assets.

