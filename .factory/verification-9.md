# Verification 9 — Focus Flow Map

- **Candidate commit:** `c3956355843b2748dd10a21e3bdbf50bed3e24d1`
- **Verified production URL:** <https://focus-flow-map.sociobot.in/>
- **Demo URL:** <https://focus-flow-map.sociobot.in/?demo=1>
- **Date:** 2026-09-02 UTC
- **Result:** **PASS**

## Cold first read

The cold live page says what it does in plain words: **“Map where Tab goes.”**
It says it is for keyboard-only and RSI-affected users and that it records a
focus route into a route report. The first action is **Try it with sample
data**, and the nearby sentence says that it opens a finished route report.
The three first-screen facts cover explicit recording, local extension
storage, and free Markdown/JSON export. One click opened the persistent
“Demo — sample data, nothing is saved” banner and a six-step sample route.

## Claims and local quality gates

`.factory/claims.json` is present and has 16 entries. From a clean checkout of
the candidate after `npm ci`, I ran **each declared command separately**. All
16 passed:

| Claim IDs | Result |
| --- | --- |
| `demo-isolated`, `keyboard-demo`, `mobile-first-view`, `chromium-package` | PASS |
| `explicit-recording`, `local-session-privacy`, `license-request-minimum-data` | PASS |
| `sensitive-redaction`, `markdown-json-export`, `recorded-route-fields` | PASS |
| `route-checks`, `original-image-provenance` | PASS |
| `history-limits`, `pro-local-notes`, `pro-unavailable`, `no-third-party-runtime` | PASS |

`npm run check` also passed: TypeScript typecheck; 18 Vitest tests; 54
Playwright tests; and the exact production build producing `dist/`. There is
no lint script. The candidate build contains 5,333 bytes initial site JS and
13,767 bytes initial site CSS, well within the stated static-product budgets.
The packaged Chromium extension passed the real persistent-profile recording,
redaction, export, history-boundary, and dashboard/popup accessibility tests.

## Live browser, privacy, and deployment evidence

- On desktop and 390×844, live Playwright found no console or page errors,
  no horizontal overflow, a designed visible keyboard focus ring, and zero
  serious/critical axe violations. Reduced-motion styles reduced durations to
  `0.00001s`.
- The home/demo request log contained only `focus-flow-map.sociobot.in`
  documents, self-hosted scripts, CSS, fonts, SVG, and images: no analytics,
  CDN, frame, XHR/fetch audit submission, or remote session storage request.
- The demo service worker controlled `/?demo=1` and an
  offline reload retained its heading, banner, and all six route rows with no
  errors. Its script is `https://focus-flow-map.sociobot.in/sw.js`.
- Production responses have HSTS, `nosniff`, `Referrer-Policy: no-referrer`,
  and a restrictive self-only CSP with only the documented Sociobot license
  verifier in `connect-src`. Hashed JS/CSS assets are cached for one year with
  `immutable`; `sw.js` is `no-cache`; a missing route returns an actual 404.
- Mobile Lighthouse (fresh live run) reported Performance **100**,
  Accessibility **100**, LCP **1,155 ms**, CLS **0**, and total byte weight
  **67,131 bytes**.
- Candidate-built and live `home-BFTguWiX.js` and `home-BDpKYwam.css` have
  identical SHA-256 values. The live extension ZIP has different archive
  timestamps, but expanding both ZIPs produced an empty recursive diff across
  all 17 files. The deployment therefore matches candidate product content.

This static extension/site has no product-operated server endpoint and no
sign-in flow. Its sole server call is the shared Sociobot token verifier; the
fixture-backed claim proves it is a token-only GET. No documented product
request allowance exists, so driving the shared service to 429 is not an
in-scope product rate-limit test. No Entra or other user identity provider is
present.

## Defects by severity

- **Release-blocking:** none.
- **High:** none.
- **Medium:** none.
- **Low:** none.
- **Informational:** `npm ci` reports 11 dependency advisories; the install
  identifies them during development dependency audit, not as runtime product
  network dependencies.
