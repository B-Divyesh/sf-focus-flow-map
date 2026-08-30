# Independent verification 3 — FAIL

**Work order:** `focus-flow-map-verify-3`
**Candidate:** `f48f942334e7860a3cd1c81bc60d8bab65748556` (`main`)
**Verified:** 2026-08-30
**Live URL:** <https://focus-flow-map.sociobot.in>

## Verdict

**FAIL.** The deployed product matches the candidate and the extension's core local recording job works, but this candidate fails two mandatory acceptance gates before functional acceptance:

1. `.factory/claims.json` is absent. Therefore no declared claims can be run from the demo entry point, and the live/README privacy, local-only, redaction, export, and explicit-start claims are unregistered and unproved.
2. There is no one-click sample-data demo. The cold first screen directs people to download the extension; it does not say the tool is for keyboard-only or RSI-affected users, and has no **Try it with sample data** action.

No product source was changed during verification. This report and the handoff are the only changes.

## Required first-read and claims gates

Cold desktop load of the live page returned the title **“Focus Flow Map — See where Tab really goes”** and the h1 **“See where Tab really goes.”** The visible actions were **Download for Chromium** and **Inspect the workflow**. The first screen says it records a keyboard journey, but does not identify the intended keyboard-only/RSI audience in plain words and has no sample-data action. This fails the plain-words and demo-sandbox gate.

`https://focus-flow-map.sociobot.in/?demo=1` returns 200, but has zero matching “Try it with sample data” controls, no “Demo — sample data, nothing is saved” banner, and no demo storage keys. There is also no `.factory/demo.md`.

Before installing dependencies, the required claims-file lookup found no `.factory/claims.json`. Consequently there were no `test` commands to run. Per the claims contract, the missing file is itself release-blocking; it is not a pass because the list is empty.

Examples of live claims left unlisted and untested by the required claim harness include “Nothing runs until you choose”, “local-only data”, “Markdown + JSON issue packets”, and “No page content is sent to us.”

## Clean-checkout gates

Fresh checkout was already at the stated candidate and clean. `npm ci` installed 480 packages.

| Check | Result | Evidence |
| --- | --- | --- |
| Required `.factory/claims.json` commands | **FAIL** | File absent; no claim tests can be executed from a demo entry point. |
| `npm run typecheck` | PASS | WXT prepare then `tsc --noEmit` completed. |
| `npm test` | PASS | Vitest: 4 files / 11 tests; Playwright: 11 passed, 1 expected mobile skip. |
| Exact `npm run build` | PASS | Produced `.output/chrome-mv3`, `dist/site`, and `dist/site/downloads/focus-flow-map-chrome.zip`. |
| `unzip -t dist/site/downloads/focus-flow-map-chrome.zip` | PASS | Archive integrity passed. |
| `npm audit --omit=dev --audit-level=low` | PASS | 0 production dependency vulnerabilities. |

There is no lint script. The repository does not supply `verify-url.sh`; equivalent semantic, console, and axe checks were run with Playwright.

Production budgets from the fresh build pass: landing JS 3,393 B raw / 1,551 B gzip, landing CSS 11,502 B raw / 3,211 B gzip, self-hosted fonts 37,476 B total, mobile AVIF 17,917 B, and full extension output 91,655 B.

## End-to-end extension evidence

Using the freshly built MV3 package in a new persistent Chromium profile against the local production preview:

- An explicit start followed immediately by stop saved the zero-step boundary case without error.
- A second explicit recording captured a real Tab/Tab/Tab/Shift+Tab route (two focus stations in the preview's current tab sequence), and the dashboard rendered both stations.
- A page URL containing an encoded email path segment, query, and fragment was stored and exported as `http://127.0.0.1:4173/private/:redacted/record`; none of the raw email, query, or fragment occurred in storage, Markdown, or JSON.
- Markdown and JSON downloads completed.
- A mocked invalid license response produced the recoverable **License no longer active** state.
- Canceling deletion retained the route; confirming deletion returned to the usable empty state.
- Dashboard axe reported no serious or critical violations.

The repository's automated extension test separately exercises the real MV3 recorder, route export, storage redaction, and popup/dashboard axe smoke test; it passed in the clean `npm test` run.

## Live privacy, accessibility, PWA, and response evidence

- Fresh desktop and 390×844 mobile live loads returned 200, one `h1`, one `main`, `lang="en"`, and no console/page errors. Axe found no serious or critical violations on either.
- Keyboard testing found the desktop skip link first with a visible `rgb(244, 239, 217) solid 3px` outline. On 390 px, Enter opened Menu (`aria-expanded="true"`), Escape hid it, set `aria-expanded="false"`, and returned focus to Menu. Reduced-motion computed scroll behavior was `auto`.
- Cold live-page request logging showed only `https://focus-flow-map.sociobot.in` for document, self-hosted fonts, JS, CSS, SVG, and hero image. No billing or other external request was made because no license action was taken. The mandatory demo-flow privacy test cannot be performed because no demo exists.
- The deployed service worker controlled a reload; after setting the browser context offline, reload returned 200 with the expected h1. The passing unit test also simulates v1-to-v2 cache replacement and offline reload.
- Live responses provide HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, Permissions-Policy, and the committed CSP. Hashed JS/CSS/assets and fonts are immutable for one year; `sw.js` is `no-cache`; the ZIP is served as an attachment.

There is no product-owned server endpoint. The optional Sociobot billing verification endpoint was not invoked: it is outside the permitted `sf-focus-flow-map` resource scope, and this repository does not document a client request allowance to verify for 429/`Retry-After` behavior.

## Deployment identity

Fresh local and live SHA-256 values matched for `/`, home JS/CSS, mobile hero AVIF, self-hosted font, service worker, privacy page, and terms page. The downloaded ZIP byte hash differs due to archive metadata, but both archives passed `unzip -t` and `diff -qr` between their extracted contents was clean. The live deployment therefore matches the candidate artifact.

## Defects by severity

### Critical — no claims manifest or claim-test gate

**Acceptance failure:** claims skill and work-order first instruction.

**Reproduction:** from the clean candidate, look for `.factory/claims.json`; it does not exist. No demo-entry test command can be executed.

**Impact:** promises visitors rely on have no required observable regression coverage. This includes the privacy and explicit-recording promises central to the researched brief.

**Required repair:** add `.factory/claims.json`; register every customer-visible claim with one tagged observable test, run each from a clean browser context through the demo entry point, and remove unsupported claim copy.

### Critical — no one-click, isolated sample-data demo; first screen fails plain words

**Acceptance failure:** demo-sandbox and plain-words first-screen requirements.

**Reproduction:** open `/` cold or `/?demo=1`. There is no **Try it with sample data** action, demo banner, reset/start-for-real controls, or sample data. The hero begins download/install instead.

**Impact:** a prospective keyboard-only or RSI-affected user cannot evaluate the actual map without installing an extension or touching a real page. The acceptance-required demo-based QA, including privacy request logging, is impossible.

**Required repair:** provide a first-screen **Try it with sample data** control that opens an isolated demo URL/storage namespace, shows a realistic recorded focus route immediately, has the persistent demo/reset/start-for-real banner, and documents it in `.factory/demo.md`. Rewrite the hero's short sentence to name the intended audience and what changes for them.

## Required re-verification

1. From a clean checkout, execute every command declared in the new `.factory/claims.json` against the demo entry point; all must pass.
2. Cold-test desktop and 390 px live pages: the first screen must state what it does, for whom, and the first click, and expose the sample-data demo in one click.
3. Re-run the clean quality gates, extension recorder/export/privacy/recovery coverage, live outgoing-request log during demo, and deployment identity/header checks.
