# Independent verification 5 — PASS

**Work order:** `focus-flow-map-verify-5`
**Candidate:** `5b487bd3dc62557542a0af10948a1042d389c471` (`main`)
**Verified:** 2026-08-30
**Live URL:** <https://focus-flow-map.sociobot.in>
**Demo:** <https://focus-flow-map.sociobot.in/?demo=1>

## Verdict

**PASS.** The candidate completes the researched job: a user explicitly starts a keyboard-focus recording, reviews a numbered local route with useful checks, and exports a reproducible Markdown or JSON report. The candidate and live deployment pass the mandatory first-read/demo gate, all 11 claim tests, the clean repository gates, independent extension edge and recovery flows, privacy inspection, accessibility checks, offline reload, performance budgets, and deployment-identity checks.

No product source was changed during verification. Only this report and `.factory/handoff.md` are changed by this work order.

## First-read and demo gate

A cold 1440×1000 live load returned HTTP 200 and answered all three first-screen questions in plain words:

- **What it does:** “Map where Tab goes.” and “records the focus route and turns it into a report.”
- **Who it is for:** “keyboard-only and RSI-affected users.”
- **What to click first:** the primary **Try it with sample data** action; adjacent copy says a finished route opens now.

One click opened `/?demo=1`, changed the title to **Demo — Focus Flow Map**, displayed **Demo — sample data, nothing is saved**, and immediately showed a realistic six-step checkout route. **Reset demo** restored the route, and **Start for real** cleared demo state and returned to the normal page.

## Required claims gate

The clean clone contained `.factory/claims.json`. Before dependency installation, the commands could not start because the clean checkout had no `@playwright/test` or `wxt` binaries. After the required `npm ci`, every manifest command was run verbatim and passed. These were runner-bootstrap errors, not failed product assertions.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `demo-isolated` | PASS | Six-step demo opened from the first screen; only `demo:focus-flow-map:state` was touched; reset and exit worked. |
| `keyboard-demo` | PASS | Reset and review-note controls operated with Tab and Enter. |
| `chromium-package` | PASS | Download returned a non-empty ZIP beginning with `PK`; archive integrity passed. |
| `explicit-recording` | PASS | Extension storage was empty and no recorder existed before `START_RECORDING`. |
| `local-session-privacy` | PASS | Audit content stayed in extension storage and no remote audit request occurred. |
| `sensitive-redaction` | PASS | Encoded email, query, fragment, and input fixture were absent from storage and exports. |
| `markdown-json-export` | PASS | Free Markdown and JSON downloads contained the safe route. |
| `route-checks` | PASS | Jump, hidden, repeat, stall, and missing-focus-indicator fixtures were all raised. |
| `history-limits` | PASS | Free retained one session; locally licensed Pro retained 30 of 31. |
| `pro-local-notes` | PASS | The audit note persisted in extension-origin local storage. |
| `pro-price` | PASS | UI states a $24 one-time purchase and the correct Sociobot checkout destination without opening it. |

The manifest unit check also confirms unique claim IDs and exactly one matching `@claim:<id>` tag for every entry. Landing, legal, extension, and README promises are represented by these claims; the earlier unmeasured installation-time promise is absent.

## Clean-checkout quality gates

| Check | Result | Evidence |
| --- | --- | --- |
| `npm ci` | PASS | 480 locked packages installed. |
| `npm run check` | PASS | TypeScript, all tests, and exact production build completed in sequence. |
| Type check | PASS | `wxt prepare` and `tsc --noEmit` completed. |
| Unit tests | PASS | 5 files, 12/12 tests. |
| Playwright suite | PASS | 25 passed; 3 intentional single-project/mobile skips. |
| Exact `npm run build` | PASS | Produced `.output/chrome-mv3`, `dist/site`, and the downloadable ZIP. |
| ZIP integrity | PASS | `unzip -t` reported no compressed-data errors. |
| Production dependency audit | PASS | `npm audit --omit=dev --audit-level=low`: 0 vulnerabilities. |

There is no lint script. The full development dependency audit reports 11 build/test-tool advisories (1 low, 2 moderate, 5 high, 3 critical); no affected package ships as a production dependency.

## Independent end-to-end extension exercise

A new persistent Chromium profile loaded the freshly built MV3 extension against the live demo URL containing an email-like query and secret fragment.

- Before explicit start, `chrome.storage.local` was empty and the recorder overlay count was zero.
- Start followed immediately by stop saved the boundary case as a valid zero-step session.
- A second run focused a private-value input and two controls, then used Tab and Shift+Tab. Four ordered stations were saved and rendered.
- The stored URL was only `https://focus-flow-map.sociobot.in/`; query, fragment, email fixture, and input value were absent from extension storage.
- Markdown (1,252 bytes) and JSON (3,235 bytes) downloaded successfully and contained the safe URL without any secret fixture.
- A required empty license field was invalid and sent no request. An intercepted invalid verdict showed **License no longer active**. An intercepted network failure showed **Could not verify. Check your connection and try again.** No real billing request was made.
- The delete dialog opened with focus on **Keep session**. Cancel retained the report; confirming deletion emptied storage and restored the usable empty state.
- The 390 px dashboard had no horizontal overflow or target below 44×44 CSS px. Dashboard and popup axe scans had zero serious or critical findings.

The product is a static site plus browser extension. It has no product-owned backend, account, or sign-in, so server concurrency, SQLite persistence, health/build identity, and Entra authority checks are not applicable. The only server endpoint referenced by the client is the shared Sociobot billing service. Repeated rate-limit probing was not performed because the work order forbids connecting to resources outside `sf-focus-flow-map`; no per-client allowance is documented in this repository. Both invalid-license tests intercepted that request locally.

## Live privacy and browser evidence

An instrumented fresh context set a real-license sentinel, entered the demo from the first screen, reset it, and inspected the complete request/storage log:

- 9 observed requests, all to `https://focus-flow-map.sociobot.in`; zero cross-origin or failed requests.
- Exactly one demo-state read and one write on entry, both for `demo:focus-flow-map:state`.
- The real `sb_license:focus-flow-map` sentinel was unchanged.
- No analytics, tracker, third-party font/script, or audit-content transmission occurred.
- No console error or page error occurred on desktop or 390 px mobile.

The separately instrumented extension run also observed no real cross-origin request during recording, storage, export, deletion, and report rendering.

## Accessibility and responsive checks

- `/opt/fleet/lib/verify-url.sh` passed `/` and `/?demo=1`: title, `lang=en`, one `h1`, `main`, image alternatives, button names, and no console/page errors.
- Live axe scans at desktop and 390×844 found zero serious or critical violations.
- Every rendered link, button, disclosure, input, select, and textarea on tested site and extension surfaces measured at least 44×44 CSS px.
- The focused demo reset button had a 3 px cream outline and a 6 px coral halo. Keyboard Enter activated it.
- Mobile Enter opened the menu; Escape closed it and returned focus to Menu.
- Desktop and mobile had no horizontal overflow. At 200% root text size on the 390 px view, the h1 and demo banner remained visible with no horizontal overflow.
- Under `prefers-reduced-motion: reduce`, scroll behavior was `auto` and route animation was `none`.
- The native delete dialog placed focus inside the dialog; the tested cancel and confirmation paths were both operable.

The single-mode blueprint visual system is implemented consistently and documented in `.factory/design.md`, including palette, typography, spacing, motion, original-asset prompt, date, model, and provenance.

## PWA, headers, caching, links, and performance

- The active service worker completed `registration.update()`. After a controlled online load, the full demo reloaded offline with its h1 and demo banner intact.
- Live headers include HSTS, `Content-Security-Policy` with `frame-ancestors 'none'`, `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, and restrictive Permissions-Policy.
- HTML uses `public, must-revalidate, max-age=30`; hashed assets and fonts use one-year immutable caching; `sw.js` uses `no-cache`; the ZIP uses `Content-Disposition: attachment`.
- Every internal link found in the demo returned 200. An unknown route returned the designed 404 page with HTTP 404.
- `robots.txt` permits crawling and points to a sitemap containing home, demo, privacy, and terms.

Live mobile Lighthouse on the demo:

| Category or metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| First Contentful Paint | 1.06 s |
| Largest Contentful Paint | 1.06 s |
| Total Blocking Time | 13.5 ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 1.06 s |

Production assets remain comfortably inside the contract budgets:

- Landing JavaScript: 4,825 B raw / 2,005 B gzip.
- Landing CSS: 13,186 B raw / 3,529 B gzip.
- Legal CSS: 2,326 B raw / 994 B gzip.
- Self-hosted fonts: 37,476 B total.
- Mobile hero AVIF: 17,917 B.
- Unpacked extension: 91,803 B.
- Packaged extension ZIP: 65,031 B.

## Deployment identity

Every served static artifact compared byte-for-byte with the candidate build: HTML routes, service worker, demo boot script, CSS, JavaScript, fonts, images, icons, sitemap, robots file, and legal pages. Representative SHA-256 values:

| Artifact | SHA-256 |
| --- | --- |
| `/` | `a75a8e11e4d506a1edd810e14e89944156282e6c953220fb9807d1a62fda1032` |
| `/sw.js` | `f4ded16a179c95bb1bd6286754a71221fa12c2f126d8cbdc99149e958ed3ab3c` |
| home CSS | `5b5d069474912220e9cf969f8b7ecb09359132a926bbea6edddbe80522057999` |
| home JavaScript | `c65ffddb22348c4732b884197a6db53c618d75bdef3db253f825e7b985d0828c` |

The local and live ZIP container hashes differ because build-time archive metadata changes, but `unzip -t` passed and `diff -qr` over the extracted archives found no difference across all 16 extension files. The live deployment therefore matches candidate `5b487bd3dc62557542a0af10948a1042d389c471`.

## Defects by severity

No critical, major, moderate, or minor product defect was found.

## Known gap

The direct Chromium package is the v1 distribution. A Chrome Web Store listing remains planned and is correctly described as such; it does not block the browser-extension job or this release.
