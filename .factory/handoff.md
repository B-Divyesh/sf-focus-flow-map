# Repair handoff — Focus Flow Map

**Work order:** `focus-flow-map-repair-4`

**Failed candidate:** `f48f942334e7860a3cd1c81bc60d8bab65748556`

**Verifier report:** `5de91334e02ae1e97e9393f7607afc4e1719d2ce`

**Repair commits:** `dd66706`, `f6a2577`, `6d35853`, `3e6e125`

**Production:** <https://focus-flow-map.sociobot.in>

**Demo:** <https://focus-flow-map.sociobot.in/?demo=1>

## Outcome

The two release blockers are fixed and the repaired static site plus Chromium MV3 extension are deployed.

- `.factory/claims.json` now lists 11 customer claims. Every claim has exactly one tagged observable test and an exact command.
- The first screen names keyboard-only and RSI-affected users and explains the first click in plain words.
- **Try it with sample data** opens a completed six-step checkout focus route in one click.
- Demo mode has the required persistent banner, **Reset demo**, and **Start for real** controls.
- Demo state uses only `demo:focus-flow-map:state`. The site does not initialize or inspect real license storage while the banner is present.
- Reset, navigation away, reload, and **Start for real** discard demo state. Real license data remains unchanged.
- `.factory/demo.md` documents the URL, sample, namespace, reset, and exit behavior.
- `.factory/copy-audit.md` records every landing sentence. The longest has 16 words; there are no banned terms or over-limit sentences.

## Reproduced root cause

At the failed candidate, `.factory/claims.json` and `.factory/demo.md` did not exist. `/?demo=1` ran the normal landing path, initialized the real license key, showed no banner, seeded no sample state, and offered no reset or real-mode exit. The hero described a keyboard journey but did not name the researched keyboard-only and RSI-affected audience.

The root cause was the absence of a mode boundary in `site/main.ts`, not only missing copy. The repair adds an early demo branch before license initialization and tests every storage operation during the whole flow.

## Product and platform repairs

- Added a realistic checkout route with six focus stations, a 684 px viewport jump, a missing focus indicator, forward Tab steps, and one Shift+Tab step.
- Added keyboard-operable demo controls, reset announcements, 44 px targets, mobile stacking, and the established drafting-sheet visual system.
- Added page-specific metadata, canonical links, an original-art social card, a touch icon, and consistent legal navigation/footer copy.
- Added a designed `404.html`. Removed the unneeded SPA fallback so an unknown production URL now returns that page with HTTP 404.
- Extended the service-worker build to precache generated hashed JS/CSS. The complete demo now reloads offline instead of returning static HTML without its demo script.
- Added a pre-paint demo guard. This removed the measured layout shift from the heading move without adding inline script or weakening CSP.
- Preserved all prior sensitive-URL, export, mobile-menu, response-header, and service-worker-update repairs.

## Regression coverage

`.factory/claims.json` contains these tested claims:

1. isolated sample demo;
2. keyboard-only demo operation;
3. downloadable Chromium ZIP;
4. explicit recording start;
5. local session privacy;
6. sensitive URL and input-value redaction;
7. Markdown and JSON export;
8. route review checks;
9. free/Pro history limits;
10. local Pro notes;
11. the stated Pro price and Sociobot checkout destination.

All 11 `test` commands were executed separately and passed. A manifest regression also parses `.factory/claims.json`, rejects duplicate IDs, checks command/tag alignment, and requires exactly one source tag for every claim.

The real MV3 browser tests use a clean persistent Chromium profile. They verify empty storage before start, record the `/?demo=1` sample, inject a private input fixture, inspect `chrome.storage.local`, and download both report formats. The encoded email, query, fragment, and input value appear in none of storage, Markdown, or JSON.

## Clean local verification

The final clean-checkout sequence passed in this order:

```text
npm ci
# 480 packages installed from package-lock.json

npm run typecheck
# WXT prepare + tsc --noEmit: PASS

npm test
# Vitest: 5 files, 12 tests passed
# Playwright: 21 passed, 3 intentional single-project skips
# Desktop Chromium + 390×844 mobile

npm run build
# Exact original production command: PASS
# Produced .output/chrome-mv3, dist/site, and the packaged ZIP
```

The final HEAD was also checked again with `npm test`: 12 unit tests and 21 browser tests passed. Coverage includes the real extension, unit/integration helpers, desktop, 390 px mobile, keyboard-only controls, reduced motion, axe, console/page errors, privacy request capture, offline reload, service-worker revision replacement, 404 policy, and package download.

Additional gates:

```text
unzip -t dist/site/downloads/focus-flow-map-chrome.zip
# PASS — no compressed-data errors

npm audit --omit=dev --audit-level=low
# PASS — 0 production vulnerabilities

/opt/fleet/lib/verify-url.sh <home-or-demo-url> <evidence-dir>
# PASS locally and live for / and /?demo=1
```

The worker verifier reported for both live routes: HTTP 200, `lang="en"`, one h1, one main, zero missing image alt attributes, zero unlabeled buttons, and zero console/page errors. Playwright axe found zero serious or critical issues on the demo, landing, legal pages, extension popup, and extension report.

## Performance and size evidence

Local production Lighthouse mobile on `/?demo=1`:

| Category or metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| First Contentful Paint | 1.2 s |
| Largest Contentful Paint | 1.4 s |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0 |

Production sizes:

- Landing JavaScript: 4,825 B raw / 2,005 B gzip.
- Landing CSS: 13,038 B raw / 3,507 B gzip.
- Self-hosted fonts: 37,476 B total.
- Mobile hero AVIF: 17,917 B.
- Unpacked extension: 91,655 B total.
- Packaged extension ZIP: 64,993 B.

All are below the work-order budgets.

## Deployment and live identity

The repair commits were pushed to `origin/main`. `dist/site` was deployed with the existing static configuration to only the `sf-focus-flow-map` production Static Web App. No DNS, billing, other application, database, vault, or shared service was read or changed. The deploy CLI-created `.env` file was deleted without being read and is not present in the tree.

Live checks after the final deployment established:

- The demo made no cross-origin request and produced no console/page error.
- Instrumented storage operations while the banner was visible were only `get` and `set` on `demo:focus-flow-map:state`.
- Reset was reached and operated with Tab and Enter.
- At 390×844, Enter opened Menu; Escape closed it and restored focus. There was no horizontal overflow.
- A controlled online reload followed by an offline reload kept the complete demo and its heading available.
- Unknown paths return HTTP 404 and the byte-identical designed `404.html`.
- CSP, `Referrer-Policy: no-referrer`, Permissions-Policy, and `X-Content-Type-Options: nosniff` are live.
- Hashed assets and fonts use one-year immutable caching. `sw.js` uses `no-cache`. The ZIP is an attachment.
- Live `/`, privacy, terms, 404, service worker, demo boot script, social card, hashed JS/CSS, and ZIP contents match the local production build.

The deployed ZIP SHA-256 is `7e86e360a00ae7b4722aa52eb422e297dbaca33f72e306e09a1ed646116f4c8a`. A later local verification rebuild changed only ZIP container timestamps; `diff -qr` between the extracted live and final local packages was empty.

## Known gaps and next steps

There are no release blockers. The direct ZIP remains the v1 distribution; a Chrome Web Store listing is still planned. A full development-only audit reports 11 advisories in build/test tooling, while the shipped production dependency audit is clean.
