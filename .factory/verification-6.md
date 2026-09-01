# Independent verification 6 — PASS

**Work order:** `focus-flow-map-verify-6`  
**Candidate:** `e8901c9fbf406cb62d8472b4573bcf56651cc53d` (`main`)  
**Verified:** 2026-09-01  
**Live URL:** <https://focus-flow-map.sociobot.in>  
**Demo:** <https://focus-flow-map.sociobot.in/?demo=1>

## Verdict

**PASS.** Confirmed that the candidate completes the researched job: a user starts a keyboard-focus recording, reviews a numbered local route with useful review notes, and exports a reproducible Markdown or JSON report. Confirmed that the first-read/demo gate, all 15 claim commands, clean repository gates, independent extension flows, privacy boundaries, accessibility checks, offline reload, performance budgets, and deployment identity pass.

No product source was changed during verification. This report, the verification evidence, and `.factory/handoff.md` are the only repository changes from this work order.

## First-read and demo gate

Confirmed on a cold 1440×900 live load:

- **What it does:** “Map where Tab goes.” and “records the focus route and turns it into a report.”
- **Who it is for:** “keyboard-only and RSI-affected users.”
- **What to click first:** **Try it with sample data**; adjacent copy says a finished route opens.

Confirmed that one click opened `/?demo=1`, changed the title to **Demo — Focus Flow Map**, displayed **Demo — sample data, nothing is saved**, and immediately showed a realistic six-step checkout route. Confirmed that **Reset demo** restored the route and **Start for real** removed demo state. Evidence: `evidence/verification-6/live-first-read-desktop.png` and `evidence/verification-6/live-demo-desktop.png`.

## Required claims gate

Confirmed that `.factory/claims.json` exists. After `npm ci`, every listed command was run exactly and passed.

| Claim | Result | Confirmed outcome |
| --- | --- | --- |
| `demo-isolated` | PASS | The six-step sample used only `demo:focus-flow-map:` storage and preserved the real-license sentinel. |
| `keyboard-demo` | PASS | Reset and review-note controls worked with Tab and Enter. |
| `chromium-package` | PASS | The first-screen package URL returned a non-empty Chromium ZIP. |
| `explicit-recording` | PASS | Storage was empty and no recorder was present before the start command. |
| `local-session-privacy` | PASS | Audit content stayed in extension storage; no remote audit request occurred. |
| `license-request-minimum-data` | PASS | The intercepted check used GET, one license query value, no body, and no token header. |
| `sensitive-redaction` | PASS | Query, fragment, encoded email, token fixture, and input value were absent from storage and exports. |
| `markdown-json-export` | PASS | Free Markdown and JSON downloads contained the safe recorded route. |
| `route-checks` | PASS | Jump, hidden target, repeat, stall, and missing-focus-indicator fixtures raised review notes. |
| `recorded-route-fields` | PASS | Every stored step included order, time, direction, element data, safe selector, rectangle, viewport, scroll, visibility, and focus state. |
| `history-limits` | PASS | Free retained one local session; locally licensed Pro retained 30 of 31. |
| `pro-local-notes` | PASS | A Pro audit note persisted in extension-origin local storage. |
| `pro-price` | PASS | The UI states $24 once and points to the correct Sociobot checkout URL without opening it. |
| `original-image-provenance` | PASS | The dated prompt, source, derivative, review record, model, and visual-thesis disclosure are present. |
| `no-third-party-runtime` | PASS | Home and demo used product-hosted scripts/fonts, no frames, no runtime data request, and isolated demo storage. |

Confirmed that each claim ID has exactly one matching test tag. Checked the live copy and README against the manifest; no unsupported customer-facing claim was found.

## Clean-checkout quality gates

| Check | Result | Evidence |
| --- | --- | --- |
| Candidate identity | PASS | `git rev-parse HEAD` returned `e8901c9fbf406cb62d8472b4573bcf56651cc53d`. |
| `npm ci` | PASS | Installed 480 locked packages. |
| `npm run typecheck` | PASS | `wxt prepare` and `tsc --noEmit` completed. |
| `npm test` | PASS | 13 unit checks and 40 browser checks passed; four extension-only cases were intentionally omitted from the mobile project. |
| Exact `npm run build` | PASS | Produced `.output/chrome-mv3`, `dist/site`, and the downloadable ZIP. |
| ZIP integrity | PASS | `unzip -t` found no compressed-data errors. |
| Production dependency check | PASS | `npm audit --omit=dev --audit-level=low` reported zero findings. |

Checked that there is no separate lint script. The development-only dependency scan reported 11 package notices; no affected package is a production dependency.

## Independent end-to-end extension check

Confirmed in a new persistent Chromium profile using the freshly built MV3 extension and live demo:

- Before start, extension storage was empty and the recorder overlay count was zero.
- Start followed by stop saved the boundary case as a valid zero-step session.
- A normal run stored four ordered steps, including forward and reverse movement. Every required route field was present.
- The stored URL was `https://focus-flow-map.sociobot.in/`. Query, fragment, encoded email, token fixture, and input value were absent.
- Recorder overlay buttons measured at least 44 px in both dimensions.
- Markdown (1,292 bytes) and JSON (3,365 bytes) downloaded and contained only the safe route data.
- An empty required license field sent no request. Locally handled inactive and interrupted responses showed clear status text. A later locally handled active response restored Pro state.
- The delete dialog placed focus inside itself. Escape and **Keep session** retained the route; **Delete session** removed it and showed the usable empty state.
- The dashboard had no horizontal overflow or target below 44×44 CSS px at 390 px. Axe found no serious or critical issue.
- No unexpected console or page error occurred. The intentionally interrupted license fixture produced the expected browser connection diagnostic.

All three license requests in this check were handled inside Playwright; no billing service was contacted. Evidence: `evidence/verification-6/extension-qa.json` and the extension screenshots in that directory.

## Live privacy, accessibility, and responsive checks

Confirmed with a new browser context that the home-to-demo-reset-to-exit flow made 43 requests, all to `https://focus-flow-map.sociobot.in`, with no failed request. Confirmed that demo mode read and wrote only `demo:focus-flow-map:state`; the real-license sentinel remained unchanged and the demo key was removed on exit.

Confirmed that `/opt/fleet/lib/verify-url.sh` passed `/`, `/?demo=1`, `/privacy/`, `/terms/`, and `/404.html`: correct title, `lang=en`, one `h1`, a `main` landmark, image alternatives, named buttons, and no console/page error.

Confirmed on desktop and 390×844 mobile:

- Axe found zero serious or critical findings.
- Every rendered link, button, disclosure, input, select, and textarea measured at least 44×44 CSS px.
- The focused demo reset button had a 3 px cream outline and a 6 px coral halo.
- Keyboard Enter reset the demo and hid review notes; the mobile menu opened with Enter, closed with Escape, and returned focus to Menu.
- Route navigation focused and announced the Privacy heading; Back focused and announced the home heading.
- There was no horizontal overflow. At 200% text size, the demo heading and banner remained present without horizontal overflow.
- With reduced motion enabled, page scrolling was automatic and route/station animations were `none`.

The documented single-mode blueprint visual system is present and consistent across the site, recorder, popup, and report. Checked that `.factory/design.md` records its palette, typography, spacing, motion, asset prompt, model, date, and provenance.

## Offline, headers, caching, links, and performance

Confirmed that the active service worker completed `registration.update()`. After an online controlled load, the complete six-step demo reloaded offline with its title and banner intact.

Confirmed live response behavior:

- Home uses `public, must-revalidate, max-age=30`.
- Hashed assets and fonts use one-year immutable caching.
- `sw.js` uses `no-cache`; the ZIP uses `Content-Disposition: attachment`.
- Headers include HSTS, `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, restrictive Permissions Policy, and the deployed Content Security Policy.
- Every internal link found on the home page returned 200. A new unknown path returned the designed page with HTTP 404.
- `robots.txt` and `sitemap.xml` are present. The sitemap lists home, demo, privacy, and terms.

Fresh mobile Lighthouse on the live demo:

| Measure | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| First Contentful Paint | 0.92 s |
| Largest Contentful Paint | 1.22 s |
| Total Blocking Time | 83 ms |
| Cumulative Layout Shift | 0 |

Confirmed a 16 ms keyboard interaction under 4× CPU and mobile-network simulation. Evidence: `evidence/verification-6/lighthouse-live-summary.json`.

Confirmed production budgets:

- Initial site JavaScript: 6,235 B raw / 2,747 B gzip across the three first-load files.
- Main CSS: 13,186 B raw / 3,541 B gzip.
- Self-hosted fonts: 37,476 B total.
- Mobile hero AVIF: 17,917 B.
- Unpacked extension: 91.81 kB.
- Packaged extension ZIP: 65,041 B.

## Deployment identity

Confirmed that 22 served HTML, JavaScript, CSS, font, image, icon, service-worker, sitemap, and robots artifacts match the candidate build byte-for-byte. Confirmed that extracting the live and local ZIP files produced no difference across the complete extension package.

Representative matching SHA-256 values:

| Artifact | SHA-256 |
| --- | --- |
| `/` | `15c0acfc235f5c014b9a3bd12180c47b79f3f1cb6e6605c3d910bcbe7cbae9f8` |
| `/sw.js` | `afef6f7e06b4edaeaf274ffbc85596ab831b5d962eab49ee8935b6f88ee51003` |
| Home JavaScript | `1bc6073c1934852217aa289798b9282feea1b8fef106a2cf27778d5ccdec8d0f` |
| Home CSS | `5b5d069474912220e9cf969f8b7ecb09359132a926bbea6edddbe80522057999` |

The live deployment therefore matches candidate `e8901c9fbf406cb62d8472b4573bcf56651cc53d`.

## Applicability checks

Confirmed that this is a static site plus browser extension, not a library, CLI, signed-in product, or product-owned backend. Consumer-package installation, CLI behavior, SQLite persistence, concurrency, health endpoint, and Entra authority checks do not apply.

Checked the only server URL referenced by the client: the shared Sociobot billing integration. The repository documents no request allowance and owns no server endpoint. **Observed allowance: not applicable.** In accordance with the work-order resource boundary, the shared service was not contacted; request shape and inactive/interrupted/active recovery were checked with local handling.

Checked the missed-feature question. The brief calls for recording, a readable focus map, review notes, and export; all are present. An added model-assisted step would not improve the core local keyboard-review job and is not a missing acceptance feature.

## Defects by severity

- Critical: none.
- Major: none.
- Moderate: none.
- Minor: none.

## Known gap

The direct Chromium package is the v1 distribution. A Chrome Web Store listing remains planned and is accurately described as future work; it does not block the researched job.
