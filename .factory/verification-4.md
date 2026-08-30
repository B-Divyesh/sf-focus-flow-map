# Independent verification 4 — FAIL

**Work order:** `focus-flow-map-verify-4`
**Candidate:** `64f44e9ade2a5607ecdafbc008e7e73362d43293` (`main`)
**Verified:** 2026-08-30
**Live URL:** <https://focus-flow-map.sociobot.in>

## Verdict

**FAIL.** The live deployment matches the candidate, the first-read/demo gate passes, all 11 declared claim commands pass after the clean install, and the extension completes its core local record/export job. The candidate nevertheless violates three acceptance requirements:

1. **Release-blocking claim gap:** the live page says **“Install in under a minute”**, but `.factory/claims.json` has no timed-install claim or test. The claims contract says an unlisted claim fails review and quantitative claims must measure the stated number.
2. **Major accessibility defect:** several site and extension links have rendered hit areas below the required 44×44 CSS px.
3. **Moderate paid-flow defect:** a fresh unpaid visitor sees and can focus/click **Copy license for the extension**. The button has `hidden`, but author CSS forces `display:inline-flex`; clicking it does nothing without a valid license.

No product source was changed during verification.

## Claims gate and first read

The untouched clone was exactly at the requested commit and initially had no installed dependencies. After the required clean `npm ci`, every command in `.factory/claims.json` was run separately and passed:

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `demo-isolated` | PASS | First-screen action opened `/?demo=1`; six steps; only `demo:focus-flow-map:state` touched; reset and exit worked. |
| `keyboard-demo` | PASS | Reset and review-note controls operated with Tab and Enter. |
| `chromium-package` | PASS | ZIP response was non-empty and began with `PK`. |
| `explicit-recording` | PASS | Storage was empty and no recorder existed before `START_RECORDING`. |
| `local-session-privacy` | PASS | Session stayed in extension storage; no remote audit-content request. |
| `sensitive-redaction` | PASS | Encoded email, query, hash, and input value were absent from storage and exports. |
| `markdown-json-export` | PASS | Both downloaded packets contained the safe route. |
| `route-checks` | PASS | Jump, hidden, repeat, stall, and missing-indicator fixture checks were raised. |
| `history-limits` | PASS | Free retained 1 session; locally licensed fixture retained 30 of 31. |
| `pro-local-notes` | PASS | Note persisted in extension-origin local storage. |
| `pro-price` | PASS | UI states $24 one-time and points at the expected Sociobot checkout URL without opening it. |

Cold live first read also passes. The first viewport says **“Map where Tab goes.”**, identifies **keyboard-only and RSI-affected users**, explains that it records the focus route into a report, and presents **Try it with sample data** as the primary action. One click opens a finished six-step route with the persistent **Demo — sample data, nothing is saved** banner, **Reset demo**, and **Start for real**.

The separate live privacy capture entered `/?demo=1` directly with a current real-license sentinel. It observed eight same-origin requests, zero cross-origin requests, and exactly one `get` plus one `set`, both for `demo:focus-flow-map:state`. The real sentinel was unchanged.

## Clean checkout gates

| Check | Result | Evidence |
| --- | --- | --- |
| `npm ci` | PASS | 480 locked packages installed. |
| `npm run typecheck` | PASS | WXT prepare and `tsc --noEmit` completed. |
| `npm test` | PASS | Vitest 12/12; Playwright 21 passed and 3 intentional project skips. |
| `npm run build` | PASS | Exact production command produced `.output/chrome-mv3`, the ZIP, and `dist/site`. |
| Production dependency audit | PASS | `npm audit --omit=dev --audit-level=low`: 0 vulnerabilities. |
| Full dependency audit | Advisory | 11 development-tool advisories: 1 low, 2 moderate, 5 high, 3 critical. None are shipped runtime dependencies. |

There is no lint script. One earlier test attempt was invalidated when the verification harness accidentally started `npm run build` concurrently with Playwright and temporarily removed two served files; the required isolated rerun above passed completely. The final production build was rerun alone and passed.

## Independent end-to-end evidence

A clean persistent Chromium profile loaded the freshly built MV3 extension against the live demo.

- Storage was empty before explicit start, and the recorder overlay appeared only after `START_RECORDING`.
- The zero-step boundary saved cleanly with `steps: 0` and rendered a usable report.
- A paced Tab/Shift+Tab run saved five ordered steps, including one backward step; all five rendered in the dashboard.
- The declared test additionally recorded a private input fixture and verified storage plus Markdown/JSON exports contained no input value, query, fragment, or encoded email.
- An intercepted `{valid:false}` license response produced **License no longer active**. An intercepted network failure produced **Could not verify. Check your connection and try again.** No billing request was sent in this test.
- Canceling deletion retained the report; confirming deletion returned to the usable empty state.
- The live ZIP passed `unzip -t`. Its extracted files are identical to the locally built package; only ZIP container timestamps differ.

This is a static site plus browser extension. There is no product-owned backend endpoint, account system, or sign-in flow, so API concurrency, persistence, health identity, Entra authority, and product-owned 429 allowance checks are not applicable. The external hosted billing endpoint was not exercised.

## Accessibility, responsive behavior, and errors

- `/opt/fleet/lib/verify-url.sh` passed live `/` and `/?demo=1`: HTTP 200, `lang=en`, one `h1`, one `main`, no missing image alt, no unlabeled buttons, and no console/page errors.
- Playwright axe found zero serious or critical violations on live desktop and 390×844 demo pages. The clean suite also covers landing, privacy, terms, 404, popup, and extension dashboard.
- Keyboard sweeps found no focus stop without a visible focus treatment. The skip link computed to a 3 px cream outline with 3 px offset and a coral halo.
- At 390 px, Enter opens Menu, Escape closes it, and focus returns to Menu. The demo has no horizontal overflow.
- With reduced motion, computed root scroll behavior is `auto`.
- A 200% CSS zoom check at 1280 px retained the h1, demo controls, and all route rows without horizontal overflow.
- Touch target sizing fails the explicit 44×44 baseline: on the 390 px live demo the header home link is 177×36, while footer Privacy, Terms, and Source links are approximately 53×25, 45×25, and 50×25. The extension dashboard repeats the issue: its home link is 184×30 and Privacy/Terms are 47×15 and 38×15.

## Privacy, headers, caching, PWA, and performance

- The isolated live demo request log is same-origin only. No analytics, CDN font, tracker, or audit-content request occurred.
- Live responses include CSP with `frame-ancestors 'none'`, HSTS, `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, and a restrictive Permissions-Policy.
- Hashed assets and fonts return one-year immutable caching. `sw.js` returns `Cache-Control: no-cache`; HTML revalidates after 30 seconds; the ZIP is served as an attachment.
- An unknown path returns the designed page with HTTP 404.
- The live service worker was activated, `registration.update()` completed, and the full demo reloaded offline with the expected h1 and banner.
- Lighthouse mobile on the live demo: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.2 s, TBT 80 ms, CLS 0.
- Production budgets pass: JS 4,825 B raw / 2,029 B gzip; CSS 13,038 B raw / 3,519 B gzip; fonts 37,476 B total; mobile hero AVIF 17,917 B; unpacked extension 91,655 B; ZIP 64,993 B.

## Deployment identity

Local and live SHA-256 values match exactly for `/`, `/privacy/`, `/terms/`, `/404.html`, `/sw.js`, `/demo-boot.js`, the hashed home JS/CSS, the mobile hero AVIF, and the Plex Sans font. Examples:

| Artifact | SHA-256 |
| --- | --- |
| `/` | `e4cc841a3bb0d8675ae8c8d07e9b22cdd4a9bfee1b857d840f5bece4a6d1f92f` |
| `/sw.js` | `311b22ead64d1fc0b02f9b73e7b55080116054e178f28867b05dc3c7843b932a` |
| home JS | `c65ffddb22348c4732b884197a6db53c618d75bdef3db253f825e7b985d0828c` |
| home CSS | `da1a2808ed3dafcd4c9884d3d35923e75759ecf34c3934c266519a465a9d9da4` |

The live deployment therefore matches candidate `64f44e9ade2a5607ecdafbc008e7e73362d43293`.

## Defects by severity

### Release-blocking — quantitative install claim is absent from the claims manifest

**Reproduction:** open the live home page and scroll to installation. It says **“Install in under a minute.”** Search `.factory/claims.json`; no entry claims or measures installation time. No `@claim:` test asserts completion in under 60 seconds.

**Impact:** this is a visitor-facing quantitative promise outside the mandatory claim gate. The claims contract explicitly makes any unlisted claim a failed review.

**Required repair:** remove the time promise, or add exactly one manifest entry and an observable clean-profile installation test that measures the complete workflow within the stated bound.

### Major — click/touch targets are smaller than 44×44 px

**Reproduction:** inspect visible anchors on the live page at 390×844. Header home is 177×36; footer links are 25 px high. In a clean extension dashboard, home is 184×30 and legal links are 15 px high.

**Impact:** these targets violate the non-negotiable accessibility/design baseline and are harder for RSI-affected and touch users—the product's named audience—to operate.

**Required repair:** give every interactive target a minimum 44×44 CSS px clickable box on site, legal pages, and extension surfaces; add an automated rendered-size assertion at desktop and 390 px.

### Moderate — unpaid visitors see a no-op Copy license button

**Reproduction:** use a fresh browser context at `/`. `#copy-license` has the `hidden` attribute but is visibly rendered at 432×47, is enabled and keyboard-focusable, and clicking it leaves the page and status unchanged.

**Cause:** the author rule `button,a.button{display:inline-flex}` overrides the user-agent rendering of `[hidden]`; there is no global `[hidden]{display:none}` safeguard.

**Impact:** the paid-flow UI offers an action that cannot succeed and implies there is a license available to copy.

**Required repair:** ensure hidden controls use `display:none` (for example `[hidden]{display:none!important}` or a non-overriding button rule) and add a fresh-storage assertion that the copy action is absent until a valid license exists.

## Required re-verification

1. Remove or register/test the “under a minute” claim.
2. Bring all rendered interactive targets to at least 44×44 CSS px across site and extension surfaces.
3. Hide the copy-license action until a valid license is present.
4. Re-run every claim command, isolated `npm test`, exact build, live accessibility/target sweep, privacy request capture, and deployment-identity comparison.
