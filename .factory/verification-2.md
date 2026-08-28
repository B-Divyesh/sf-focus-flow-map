# Independent verification 2 — FAIL

**Work order:** `focus-flow-map-verify-2`
**Candidate:** `b705ea29572fbcc177fc50b8f93ebbe855ecdf47` (`main`)
**Verified:** 2026-08-28
**Live URL:** <https://focus-flow-map.sociobot.in>

## Verdict

**FAIL.** The candidate builds, tests, deploys, and performs the core focus-map job well, but it does not meet the researched brief's privacy constraint to redact sensitive URLs. A recording retains an email address embedded in a URL path and exports it as part of the recorded page URL. This is a release-blocking privacy defect.

No product source was changed during this verification. This report and the updated handoff are the only changes.

## Clean-checkout quality gates

Fresh checkout at the candidate, followed by `npm ci`:

| Check | Result | Fresh evidence |
| --- | --- | --- |
| `npm ci` | PASS | Installed 480 packages. Full development audit reports 11 advisories; see note below. |
| `npm run typecheck` | PASS | Runs `wxt prepare`, then `tsc --noEmit`. |
| `npm test` | PASS | Vitest: 4 files / 8 tests. Playwright: 11 passed, 1 expected desktop-only skip. This covers desktop and 390×844 site routes, the MV3 recorder, popup/dashboard axe smoke tests, service-worker cache behavior, and privacy/report helpers. |
| `npm run build` | PASS | Exact production build created `.output/chrome-mv3`, `dist/site`, and `dist/site/downloads/focus-flow-map-chrome.zip`. |
| `unzip -t dist/site/downloads/focus-flow-map-chrome.zip` | PASS | All MV3 package entries passed integrity testing. |
| `npm audit --omit=dev --audit-level=low` | PASS | 0 production dependency vulnerabilities. |

There is no lint script in `package.json`. A full `npm audit` reports 11 advisories (1 low, 2 moderate, 5 high, 3 critical) in development tooling only; this is maintenance work, not the release-blocking finding below.

Build budgets pass: extension output is 84.79 KB total; site JS is 3,282 B raw / 1,500 B gzip; site CSS is 11,502 B raw / 3,210 B gzip; self-hosted fonts total 37,476 B; mobile hero AVIF is 17,917 B. Live Lighthouse produced Performance **100** and Accessibility **100** (FCP 1.1 s, LCP 1.2 s, TBT 0 ms, CLS 0).

## End-to-end product checks

The built MV3 package was loaded into a clean persistent Chromium profile and exercised against the live site.

- Explicit `START_RECORDING` created the on-page recorder ruler; a stop before navigation also saved the boundary case of a zero-step route without error.
- A normal route of nine `Tab` presses and one `Shift+Tab` saved 10 local stations. The recorder overlay, step count, backward direction, route map, station inspection, and confirmation-based deletion all worked.
- Markdown and JSON downloads completed. Canceling deletion retained all 10 stations; confirming deletion returned to the usable empty-state help.
- An invalid restored license response (`{ "valid": false }`) yielded the recoverable **License no longer active** state. Opening the popup on an unsupported browser-internal page yielded the actionable **Recording unavailable — Open a website and try again** state.
- No console or page errors occurred in the live landing-page pass or the recorder/dashboard/popup pass.

## Privacy failure

The brief requires: “redact input values and sensitive URLs.” I recorded this synthetic, non-user URL in the built extension:

```text
https://example.com/private/focus-flow-map.qa%2Bprivate%40example.com/record?query=drop-me#fragment
```

The extension correctly dropped the query string and fragment, but its stored session URL was:

```text
https://example.com/private/focus-flow-map.qa%2Bprivate%40example.com/record
```

The encoded path segment is still the email address `focus-flow-map.qa+private@example.com`, and `session.url` is used verbatim in both Markdown and JSON exports. The implementation redacts email-like *labels*, but `redactUrl()` only redacts numeric IDs, UUID-like segments, and segments longer than 48 characters. It does not inspect or redact email, token-like, or other sensitive path segments. The temporary browser profile was deleted after the check.

## Accessibility, responsive, PWA, and network evidence

- Live desktop and 390×844 mobile checks found **0 axe serious/critical** violations. The required one `<h1>`, `<main>`, title, and `lang` are present on the site; the built popup and dashboard axe checks also pass in the suite.
- Keyboard-only checks: Tab first focuses **Skip to main content**; the designed focus treatment measures a 3 px solid outline plus coral 6 px halo. At 390 px, the Menu button is focusable and Enter opens the visible mobile menu. Escape returns focus to the menu button.
- `prefers-reduced-motion: reduce` matched; live pages had no active animations and body transition duration resolved to `0.00001s`.
- A live service worker controlled a reload, and an offline reload still rendered **See where Tab really goes.** The unit suite separately verifies a v1→v2 cache replacement and offline shell reload.
- First-load live request capture contained only `focus-flow-map.sociobot.in`. No analytics, CDN fonts, third-party runtime scripts, or audit-content transmission occurred. The only intentional remote endpoint in the code is Sociobot license verification after a user supplies or returns a license.

## Deployment identity and response policies

Fresh local production output matched the live deployment byte-for-byte for `index.html`, JS, CSS, hero variants, mark SVG, fonts, privacy/terms pages, and `sw.js`. The live ZIP container SHA-256 differs because ZIP metadata is non-deterministic, but `diff -qr` of both fully extracted extension archives was clean and both archives passed `unzip -t`.

Live responses had HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `Permissions-Policy: camera=(), microphone=(), geolocation()`, and the committed restrictive CSP. Hashed JS/CSS/assets and fonts use `public, max-age=31536000, immutable`; `sw.js` uses `Cache-Control: no-cache`; the download is served as an attachment.

## Defects by severity

### High — sensitive URL path data is retained and exported

**Acceptance failure:** researched-brief privacy constraint, “redact … sensitive URLs.”

**Impact:** an audited page whose path contains an email address, short account identifier, reset token, patient/customer name, or similar value can have that value saved locally and included in a report the auditor shares. Query/hash stripping does not mitigate sensitive path data.

**Reproduction:** record and stop on the synthetic URL above; inspect `chrome.storage.local` key `ffm_sessions` or export Markdown/JSON.

**Required repair:** make URL redaction conservative for every path segment (including percent-decoded values): redact emails, token-like strings, and identifier-bearing paths; retain only the minimum route detail needed to reproduce. Add unit and recorder/export regression coverage for encoded and unencoded sensitive path values.

### Medium / Low

No additional product release defects were found. The development-only audit advisories noted above should be handled in normal dependency maintenance.

## Required re-verification

1. Demonstrate that a recorded and exported URL with encoded and unencoded email/token-like path segments contains no recoverable sensitive value.
2. Re-run the clean sequence: `npm ci && npm run typecheck && npm test && npm run build`.
3. Re-run extension normal route, zero-step boundary, export, deletion recovery, keyboard/axe, and live parity/header checks.
