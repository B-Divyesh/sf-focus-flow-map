# Verification 10 — Focus Flow Map

- **Candidate commit:** `7ea36cd53d3034a834ea2915ce9bddb0dbccf357`
- **Verified production URL:** <https://focus-flow-map.sociobot.in/>
- **Demo URL:** <https://focus-flow-map.sociobot.in/?demo=1>
- **Date:** 2 September 2026 UTC
- **Result:** **PASS**

## Cold first read

The fresh live page passes the mandatory first-screen gate. **“Map where Tab
goes.”** states the job. The next sentence names keyboard-only and RSI-affected
users and says the result is a focus-route report. **Try it with sample data**
is the primary action, and the adjacent copy says a finished report opens. One
click opened the six-step sample with the persistent **“Demo — sample data,
nothing is saved”** banner, **Reset demo**, and **Start for real**.

At 390×844, the three product facts ended at y=706.36 and the first sample row
began at y=596.64. Both fit without scrolling.

## Mandatory claims

`.factory/claims.json` exists and contains 17 claims. After `npm ci`, every
listed `test` command was run separately and exactly as declared. All passed.

| Claim | Result | Fresh observable evidence |
| --- | --- | --- |
| `demo-isolated` | PASS | Only `demo:focus-flow-map:` storage was touched; reset and exit worked; the real-license sentinel remained unchanged. |
| `keyboard-demo` | PASS | Tab and Enter reached and operated Reset demo and the review-note toggle. |
| `offline-sample-route` | PASS | A fresh service-worker context reloaded offline with six rows; review notes and reset still worked. |
| `mobile-first-view` | PASS | All three facts and a real sample-route row fit at 390×844. |
| `chromium-package` | PASS | The first-screen ZIP returned 200, began with `PK`, exceeded 50 KB, and passed `unzip -t`. |
| `explicit-recording` | PASS | Extension storage and the recorder overlay were absent before START_RECORDING. |
| `local-session-privacy` | PASS | The recorded session remained in extension storage and no audit content request left the product origin. |
| `license-request-minimum-data` | PASS | Verification was a GET with one `license` query value, no body, and no token header. |
| `sensitive-redaction` | PASS | Email, query, fragment, input value, and sensitive path fixtures were absent from storage and both exports. |
| `markdown-json-export` | PASS | Free Markdown and JSON downloads contained the recorded route. |
| `route-checks` | PASS | Jump, hidden target, repeat, stall, and missing-indicator fixtures each raised the expected review note. |
| `recorded-route-fields` | PASS | Every step contained order, direction, safe selector, label, geometry, page position/movement, visibility, and focus-indicator state. |
| `history-limits` | PASS | Free retained one report; the valid-license fixture retained 30 after 31 saves. |
| `pro-local-notes` | PASS | A private note persisted only in extension-origin local storage. |
| `pro-unavailable` | PASS | Site and extension offered no checkout or purchase action; free exports remained available. |
| `original-image-provenance` | PASS | The dated prompt, source, derivative, accepted review, and visual-thesis disclosure are present. |
| `no-third-party-runtime` | PASS | Home and demo used same-origin runtime assets, local fonts, no frame, no analytics, and no XHR/fetch session submission. |

The live landing page and README were cross-checked against the manifest. The
new offline statement is declared as `offline-sample-route`; no unlisted
visitor-facing product claim was found.

## Clean checkout, test, and build results

- Starting tree: clean at the candidate commit.
- `npm ci`: passed with the lockfile.
- `npm run check`: passed.
  - TypeScript: passed.
  - Vitest: 18/18 tests passed.
  - Playwright: 50 passed; four intentional non-desktop duplicate cases skipped.
  - Exact production build: passed and created `dist/`.
- No lint script exists in `package.json`.
- `npm audit --omit=dev --audit-level=low`: zero production vulnerabilities.
- `unzip -t dist/site/downloads/focus-flow-map-chrome.zip`: all 17 packaged files passed.

The production build reports 5,349 bytes of initial site JavaScript and 13,767
bytes of site CSS. The unpacked extension is 92.07 KB.

## Independent end-to-end product exercise

The package downloaded from production was expanded and loaded into a fresh
Chromium profile, not reused from the local build.

- Its initial dashboard showed the useful empty state and a **Show recording
  steps** action.
- A restricted `chrome-extension:` page produced **Recording unavailable**,
  kept Start disabled, and told the user to open a website and try again.
- The live demo had no session before explicit start. A paced Tab/Shift+Tab run
  saved five steps with `unknown`, `forward`, and `backward` directions.
- The saved page URL excluded the demo query, and each step contained all 12
  documented fields.
- The dashboard rendered one station per saved step. Markdown and JSON exports
  contained the same route and step count.
- Opening the delete dialog and choosing **Keep route report** preserved it.
- No extension audit request went anywhere except the audited product page.
- An empty license form stayed client-side, focused the required field, and
  showed the browser's validation message. A simulated blocked clipboard gave
  the documented Export/Paste recovery instruction.
- One real invalid-token verification returned HTTP 200 with
  `{ "valid": false, "reason": "invalid" }`; the page hid the copy action and
  kept the free download and export explanation available.

These checks cover the normal flow, a one/30-report storage boundary, sensitive
input, empty input, an invalid license, an unsupported page, offline use, and
non-destructive recovery from a delete confirmation.

## Accessibility and responsive behavior

- `/opt/fleet/lib/verify-url.sh` passed live home, demo, Privacy, Terms, and
  direct 404 pages with no console errors.
- Axe CLI 4.10.3 found zero violations on all five live documents.
- Every checked document has `lang="en"`, a title, exactly one h1, a main
  landmark, and image alternatives. The home and legal pages have skip links.
- Independent desktop and 390px checks found no rendered interactive target
  below 44×44 CSS pixels and no horizontal overflow.
- The primary action's keyboard focus treatment computed to a 3px cream
  outline plus a 6px coral halo. Keyboard-only demo and mobile-menu flows
  worked; Escape closed the phone menu and returned focus to its button.
- Under `prefers-reduced-motion: reduce`, animation and transition durations
  computed to `0.00001s`.
- The viewport metadata permits zoom; no `user-scalable=no` or maximum-scale
  restriction is present.
- The design is intentionally single-mode as documented in
  `.factory/design.md`; automated contrast checks passed that treatment.

## Privacy, network, headers, and caching

The cold home and complete demo flow requested only the product document,
self-hosted JS/CSS, two self-hosted fonts, the product mark, and the responsive
hero image. There were no analytics, frames, CDN assets, pings, XHRs, or audit
uploads. Demo storage stayed in its declared namespace.

The only optional external request is license verification. Fresh live
evidence shows an HTTPS GET to
`api.sociobot.in/api/v1/products/focus-flow-map/verify` with the token as the
single query parameter and no request body. The response uses `Cache-Control:
no-store` and allows the production origin through CORS.

Production responses include HSTS, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: no-referrer`, a restrictive CSP with `frame-ancestors
'none'`, and camera/microphone/geolocation disabled. HTML and the ZIP use a
30-second revalidation policy. Hashed JS/CSS/images use one-year immutable
caching; a conditional hashed-asset request returned 304. `sw.js` uses
`no-cache`. A new unknown route returned the designed document with HTTP 404.

This is a static site plus browser extension. It has no product-operated
backend and no sign-in flow. The shared Sociobot verifier has no request
allowance documented by this product, so no unspecified flood was sent to the
shared API and no 429 threshold is claimed. Entra identity is not applicable.

## Service worker, performance, and deployment identity

Calling `registration.update()` completed with the active script at `/sw.js`,
no installing or waiting worker, and one revisioned cache:
`focus-flow-map-1fc815600aff322e`. A subsequent offline reload retained the demo
title, banner, six rows, review-note control, and reset behavior with no errors.

Fresh mobile Lighthouse 13.4.1 results:

| Metric | Result |
| --- | ---: |
| Performance | 99 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | 905 ms |
| LCP | 1,130 ms |
| TBT | 95 ms |
| CLS | 0 |
| Total transfer | 67,171 bytes |

Transferred script was 2,736 bytes, stylesheet 3,738 bytes, fonts 37,637
bytes, and images 18,538 bytes. All are inside the contract budgets. A single
navigation lab run does not produce field INP; TBT and direct keyboard/click
checks showed no interaction delay.

Candidate-to-live identity was established with exact SHA-256 matches:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` local/live | `857ffa85fc35f3fda9741cafce2b4a4adb97e49b74dd87ac2e969a4e331f664d` |
| Home JS local/live | `e5d7f5404cb799d5d76ecc434b80dc57d24c29ed9899ab6d6b0bfe9c83145c4d` |
| Home CSS local/live | `e867793487c5f286e06fd240fafbe6cb335004bfe65074483b0e8522202869a8` |
| `sw.js` local/live | `d9358dcbd9ad88061ac56ba7713b2c7d13de2e59ef727189c04e4c71cf6fbdf2` |

The live ZIP has deployment timestamps, so its archive hash differs. Expanding
the local and live ZIPs produced an empty recursive diff across all 17 files.
The deployed product content therefore matches the candidate.

No AI feature is missing: the brief calls for deterministic, local recording,
redaction, and export. Model use would add network/privacy cost without helping
the core job. Import/export leverage is already present through Markdown and
JSON.

## Defects by severity

- **Release-blocking:** none.
- **High:** none.
- **Medium:** none.
- **Low:** none.
- **Informational:** the full development audit reports 11 advisories (1 low,
  2 moderate, 5 high, 3 critical) in build/test tooling, including WXT's
  Firefox runner and Sharp. The production dependency audit reports zero, and
  none of these packages ships as a live runtime dependency.
