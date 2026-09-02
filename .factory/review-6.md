# Adversarial first-read review 6 — Focus Flow Map

- **Work order:** `focus-flow-map-review-6`
- **Reviewed:** 2 September 2026
- **Candidate:** `25d590ba95df1ff6be9e7621d25fca4fa27b839d`
- **Production:** <https://focus-flow-map.sociobot.in>
- **Demo:** <https://focus-flow-map.sociobot.in/?demo=1>
- **Verdict:** **PASS** — zero findings remain, no declared claim failed, and no visitor-facing claim is untested.

## First 30 seconds

I opened production cold in separate fresh Chromium contexts at 390×844 and 1440×900. I recorded this before scrolling:

- **What it does:** Records where keyboard focus moves when someone presses Tab, then makes a route report.
- **For whom:** Keyboard-only and RSI-affected users and the people supporting them.
- **What to click first:** **Try it with sample data**; the adjacent sentence says a finished route report opens now.

The exact first-screen text that answers those questions is **“Map where Tab goes.”**, **“For keyboard-only and RSI-affected users, it records a focus route and turns it into a route report.”**, **“Try it with sample data”**, and **“A finished route report opens now.”**

At 390 px, all three product facts end by y=706.4 in the 844-pixel viewport. At desktop size, the primary sample action and its result are visible beside the product-specific blueprint illustration. Evidence: [mobile](evidence/review-6/cold-mobile.png), [desktop](evidence/review-6/cold-desktop.png), and [live measurements](evidence/review-6-live/live-check.json).

## Findings

None.

## Copy audit

Counts treat hyphenated terms, product names, and code literals as one word and exclude standalone punctuation. Repeated text is listed once and its repeated role is noted. No sentence exceeds 22 words. No banned marketing adjective, unexplained metaphor, inconsistent core term, vague heading, or non-result-naming button remains.

### Landing-page sentences and runtime messages

| Words | Exact copy | Result |
| ---: | --- | --- |
| 4 | Map where Tab goes. | Plain job headline |
| 17 | For keyboard-only and RSI-affected users, it records a focus route and turns it into a route report. | Names audience and result |
| 6 | A finished route report opens now. | Names sample-action result |
| 9 | Download when you are ready to record a site. | Names real-use next step |
| 6 | Recording begins only when you choose. | `explicit-recording` |
| 6 | Route reports use local extension storage. | `local-session-privacy` |
| 6 | Download Markdown and JSON route reports. | `markdown-json-export` |
| 5 | Review a sample focus route. | Demo h1 names the task |
| 17 | See a finished focus route through a checkout with a page jump and a missing focus indicator. | `demo-isolated` |
| 10 | Use the review notes to understand what a maintainer receives. | Useful instruction |
| 9 | Record one focus route and share its route report. | Plain workflow heading |
| 10 | The route report marks steps that need a manual check. | Names the result |
| 10 | Focus Flow Map records the focus route you actually used. | `recorded-route-fields` |
| 10 | Choose the extension on the page you want to inspect. | Clear first step |
| 8 | A visible recorder confirms that it is running. | `explicit-recording` |
| 4 | Use Tab and Shift+Tab. | Clear instruction |
| 13 | The focus route records redacted labels, page position, direction, and visible focus styles. | `recorded-route-fields` |
| 6 | It never records what you type. | `sensitive-redaction` |
| 15 | Review numbered steps and checks for jumps, loops, stalls, hidden targets, and missing focus indicators. | `route-checks` |
| 8 | Export the route report as Markdown or JSON. | `markdown-json-export` |
| 6 | The page moved down 684 pixels. | Visible sample fact |
| 9 | Confirm that the delivery field remains easy to locate. | Concrete next check |
| 9 | The browser detected no focus outline on Place order. | Visible sample fact |
| 6 | Check the control in the browser. | Concrete next action |
| 6 | These review notes support a review. | Honest limitation |
| 5 | They do not certify accessibility. | Honest limitation |
| 5 | Your focus route stays local. | Privacy section heading |
| 15 | Focus Flow Map removes query strings, hashes, sensitive path values, email addresses, and token-like text. | `sensitive-redaction` |
| 5 | It never records input values. | `sensitive-redaction` |
| 6 | Route reports stay in extension storage. | `local-session-privacy` |
| 7 | No focus route is sent to us. | `local-session-privacy` |
| 9 | License verification sends only the license token to Sociobot. | `license-request-minimum-data` |
| 5 | Pro license sales are unavailable. | `pro-unavailable` |
| 7 | The product owner has not enabled checkout. | `pro-unavailable` |
| 6 | You cannot buy a license here. | `pro-unavailable` |
| 10 | Free keeps your latest route report and both export formats. | `history-limits`, `markdown-json-export` |
| 9 | Recording, redaction, and Markdown and JSON exports remain free. | Declared recording/export claims |
| 10 | Pro stays off unless you already have a valid license. | `pro-unavailable` |
| 8 | No payment can be made on this site. | `pro-unavailable` |
| 4 | Load the unpacked extension. | Literal installation heading |
| 5 | Download and unzip the package. | Clear instruction |
| 7 | Open chrome://extensions and turn on Developer mode. | Clear instruction |
| 8 | Choose “Load unpacked” and select the unzipped folder. | Clear instruction |
| 10 | Pin Focus Flow Map, open a website, and start recording. | Clear instruction |
| 9 | Record a focus route and share its route report. | Footer one-liner |
| 12 | The factory image model generated the original hero image for this product. | `original-image-provenance` |
| 8 | Demo reset to the original six-step focus route. | `demo-isolated` |
| 2 | License active. | Clear status |
| 9 | Copy it into the extension to unlock local Pro. | Clear result |
| 4 | License no longer active. | Clear status |
| 6 | Your last verified license remains active. | Clear status |
| 8 | We’ll check it again when you are online. | Clear next step |
| 1 | Offline. | Clear status |
| 9 | The sample route remains available after your first visit. | `offline-sample-route` |
| 2 | Verifying license… | Clear status |
| 3 | Could not verify. | Clear error |
| 6 | Check your connection and try again. | Clear recovery action |
| 2 | License copied. | Clear result |
| 9 | Paste it into the extension to use local Pro. | Clear next step |
| 3 | Copy was blocked. | Clear error |
| 13 | Copy the token from your purchase email and paste it into the extension. | Clear recovery action |

### Landing headings, actions, labels, and image alternative

These are fragments rather than sentences, but they were audited because headings and controls must also use plain, result-naming words.

| Words | Exact copy | Result |
| ---: | --- | --- |
| 4 | Skip to main content | Clear action |
| 3 / 1 / 3 / 1 / 2 | Focus Flow Map / Demo / How it works / Privacy / Download extension | Literal destinations |
| 2 each | Open menu / Close menu | Names both menu results |
| 6 | Demo — sample data, nothing is saved | Required persistent banner |
| 2 / 3 | Reset demo / Start for real | Required result-naming controls |
| 3 | Sample route report | Literal demo label |
| 4 | Keyboard focus route recorder | Literal product category |
| 5 / 3 | Try it with sample data / Download for Chromium | Result-naming actions |
| 3 | Chromium extension package | Literal format label |
| 16 | A dark blue drafting sheet with a coral route linking focus stations across two interface frames | Useful image alternative |
| 3 / 6 | Example focus route / Original illustration generated for this product | Literal label and declared provenance |
| 4 / 4 / 3 | Starts on your command / Stays in the extension / Exports for free | Specific fact labels; their sentences repeat above |
| 3 / 2 / 3 / 4 | How it works / Start recording / Use Tab normally / Export the route report | Literal workflow labels |
| 4 / 6 | Sample checkout focus route / Review a six-step route report | Literal sample labels |
| 3 each | Hide review notes / Show review notes | Names both control results |
| 2 / 4 | Review notes / Step 4 needs review | Literal headings |
| 3 / 4 / 4 / 2 / 2 / 2 | Skip to checkout / Change basket quantity / Apply discount code / Delivery address / Place order / Review basket | Realistic sample labels |
| 5 / 5 / 6 / 5 / 6 | Link · page position 0 · Tab / Button · page position 0 · Tab / Text field · page position 684 · Tab / Page moved down 684 pixels / Link · page position 0 · Shift + Tab | Plain sample details |
| 3 / 4 | Local by default / Read the privacy policy | Specific privacy label and action |
| 3 / 3 / 3 | Pro license status / Sales not enabled / No purchase action | Literal availability headings |
| 5 / 5 | Free: latest local route report / Free: Markdown and JSON exports | Literal feature labels |
| 4 / 4 / 2 | Have an existing license? / Paste your license token / Verify license | Clear recovery controls |
| 5 | Copy license for the extension | Names the result |
| 3 / 1 | Install the extension / Terms | Literal destinations |
| 5 | View source on GitHub (external) | Names the external destination |
| 4 / 1 | Built by Param Factory / v1.0.0 | Attribution and version |

### README sentences and instructional statements

| Words | Exact copy | Result |
| ---: | --- | --- |
| 18 | Focus Flow Map is a Chromium extension for keyboard-only and RSI-affected users, auditors, and the teams supporting them. | Clear audience |
| 9 | It records a user-started Tab and Shift+Tab focus route. | `explicit-recording` |
| 14 | The local route report shows numbered steps, page jumps, loops, and missing focus indicators. | Declared route claims |
| 6 | Free exports include Markdown and JSON. | `markdown-json-export` |
| 16 | Choose Try it with sample data on the first screen, or open the sample link above. | Clear entry point |
| 7 | A completed six-step checkout route appears immediately. | `demo-isolated` |
| 5 | The banner identifies demo mode. | Observed |
| 15 | Reset demo restores the sample, and Start for real returns to the normal product page. | `demo-isolated` |
| 14 | After one online visit, the sample route and its review controls remain available offline. | `offline-sample-route` |
| 12 | Demo state uses only demo:focus-flow-map: keys and is removed when you leave. | `demo-isolated` |
| 10 | The demo does not read or change real license data. | `demo-isolated` |
| 8 | See .factory/demo.md for the sample and isolation details. | Clear reference |
| 8 | Records only after the user chooses Start recording. | `explicit-recording` |
| 10 | Captures focus order, direction, labels, page position, scrolling, and visibility. | `recorded-route-fields` |
| 13 | Stores a redacted element locator and whether each control shows a focus outline. | `recorded-route-fields` |
| 17 | Flags large page jumps, off-screen targets, recent repeats, stalled Tab movement, and missing focus indicators for review. | `route-checks` |
| 15 | Redacts queries, hashes, sensitive URL paths, URLs in labels, email addresses, identifiers, and token-like text. | `sensitive-redaction` |
| 6 | Never reads or records input values. | `sensitive-redaction` |
| 6 | Stores sessions in browser extension storage. | `local-session-privacy` |
| 8 | It sends no audit content to a server. | `local-session-privacy` |
| 12 | Exports a complete Markdown or JSON route report in the free tier. | `markdown-json-export` |
| 12 | Shows that Pro license sales are unavailable because checkout is not enabled. | `pro-unavailable` |
| 12 | Lets an existing valid license restore a 30-session history and private notes. | `history-limits`, `pro-local-notes` |
| 9 | Keeps recording, redaction, and Markdown and JSON exports free. | Declared recording/export claims |
| 7 | The review notes support an accessibility review. | Honest limitation |
| 5 | They do not certify compliance. | Honest limitation |
| 9 | Test with disabled users before making a compliance claim. | Useful next action |
| 5 | Requirements: Node.js 22+ and npm. | Clear requirement |
| 19 | For the extension, open chrome://extensions, enable Developer mode, choose Load unpacked, and select .output/chrome-mv3 after WXT has built it. | Clear instruction |
| 20 | npm test runs privacy and route-report tests, Chromium extension tests, 390 px tests, route metadata checks, and automated accessibility checks. | Clear verification summary |
| 10 | Customer-facing claims and their exact commands are listed in .factory/claims.json. | Accurate, observed |
| 10 | Each command runs one tagged test against shipped sample data. | Accurate, observed |
| 9 | The exact production build command is npm run build. | Accurate, observed |
| 2 | It creates: | Clear build-output lead-in |
| 4 | dist/site/index.html — static deployment root. | Accurate build output |
| 7 | dist/site/downloads/focus-flow-map-chrome.zip — installable Chromium Manifest V3 (MV3) package. | Accurate build output |
| 5 | .output/chrome-mv3/ — unpacked extension for development. | Accurate build output |
| 5 | Preview the production site with: | Clear command lead-in |
| 15 | WXT and TypeScript for the Manifest V3 extension worker, recorder, popup, and local route report. | Useful architecture detail |
| 13 | Vite and vanilla TypeScript for the static product, demo, privacy, and terms pages. | Useful architecture detail |
| 7 | Extension storage for sessions and license state. | Declared storage claims |
| 7 | Extension-origin local storage keeps private report notes. | `pro-local-notes` |
| 8 | A separate demo:focus-flow-map: namespace for disposable sample state. | `demo-isolated` |
| 6 | Sociobot billing API for existing-license verification. | `license-request-minimum-data` |
| 10 | The product offers no checkout action while sales are unavailable. | `pro-unavailable` |
| 11 | No analytics, external runtime scripts, CDN fonts, or remote session storage. | `no-third-party-runtime` |
| 9 | The no-third-party-runtime claim test checks both home and demo. | Accurate test reference |
| 11 | activeTab and site access observe focus only after an explicit start. | `explicit-recording` |
| 11 | storage keeps route reports and license state on the current device. | Declared storage claims |
| 11 | tabs identifies the active page and opens the local route report. | Accurate permission explanation |
| 10 | See the product brief, visual thesis, privacy policy, and terms. | Clear reference |
| 1 / 2 | MIT. / See LICENSE. | Clear license statement |

README headings — **Focus Flow Map**, **Try the isolated demo**, **What v1 does**, **Run locally**, **Test and build**, **Architecture**, **Permissions**, and **License** — identify their sections in the document. The two labeled URLs and code blocks are addresses or commands, not prose sentences. The core vocabulary remains consistent: **focus route** for the recorded sequence, **route report** for its displayed/exported result, and **review notes** for checks requiring a person.

## Demo and sandbox behavior

- **Try it with sample data** reaches `/?demo=1` in one click.
- At 390×844, the first demo viewport already shows the persistent banner, Reset, Start for real, the sample-report h1, and three realistic checkout route rows. The first row begins at y=596.6. Evidence: [demo first viewport](evidence/review-6-live/demo-first-viewport.png).
- The sample contains six named checkout controls, a 684-pixel page movement, a missing-focus-outline note, and a reverse Shift+Tab step.
- Reset restores the six rows and visible review notes and announces the reset. Start for real removes demo state and returns home.
- An instrumented fresh live context preserved a real-license sentinel. Every storage operation while the banner was present used `demo:focus-flow-map:`; leaving removed the demo state without changing the sentinel.
- The complete live demo request log was same-origin. The demo did not call the billing API.
- After one online visit, a fresh service-worker context reloaded the demo offline with all six rows; review-note toggle and Reset still worked.

The demo requirement passes. No real storage was read or changed by the demo flow.

## Claims

I cloned candidate `25d590b` into `/tmp/focus-flow-map-review6.d7CJpp`, ran `npm ci`, and ran every `test` value from `.factory/claims.json` separately. All 17 passed. The result summary is preserved at [claims-clean-clone.txt](evidence/review-6/claims-clean-clone.txt).

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `demo-isolated` | Pass | Demo-prefixed storage only; Reset and exit work; real sentinel remains. |
| `keyboard-demo` | Pass | Tab and Enter operate Reset and review-note controls. |
| `offline-sample-route` | Pass | Fresh context reloads the cached sample offline and operates notes and Reset. |
| `mobile-first-view` | Pass | Three home facts and the first demo row fit at 390×844. |
| `chromium-package` | Pass | First-screen download returns a non-empty ZIP. |
| `explicit-recording` | Pass | No recorder or stored session exists before explicit start. |
| `local-session-privacy` | Pass | Audit content remains in extension storage; no remote request occurs. |
| `license-request-minimum-data` | Pass | Intercepted GET has one token query value, no body, and no token header. |
| `sensitive-redaction` | Pass | Query, hash, encoded email, identifier, and input fixture stay out of storage and exports. |
| `markdown-json-export` | Pass | Both free downloads contain the recorded route. |
| `route-checks` | Pass | Jump, hidden, repeat, stall, and missing-indicator checks are produced. |
| `recorded-route-fields` | Pass | Stored steps contain every documented field and a redacted locator. |
| `history-limits` | Pass | Free retains one report; the valid-license fixture retains 30. |
| `pro-local-notes` | Pass | A private note persists on the extension origin. |
| `pro-unavailable` | Pass | Site and extension have no checkout action; free exports remain. |
| `original-image-provenance` | Pass | Dated prompt, source, derivative, and design disclosure exist. |
| `no-third-party-runtime` | Pass | Home and demo use same-origin scripts, fonts, requests, and isolated storage. |

I then cross-checked every claim-like landing and README sentence against the manifest. No unlisted claim remains.

## Earlier finding verification

I read every earlier `.factory/review-*.md`, `.factory/polish-*.md`, and handoff. The table below records fresh live and current-code confirmation rather than relying on the historical closed status.

| Earlier finding | Live confirmation | Current-code/test confirmation |
| --- | --- | --- |
| F-1-1 — route focus | Home → Privacy → Back focused each new h1 and announced the page. | `route-focus.js` focuses `main h1`; route-focus test passed. |
| F-1-2 — route metadata | Home, demo, Privacy, Terms, 404, and an unknown route expose the expected route metadata. | Route-specific HTML/meta code remains; all metadata tests passed. |
| F-1-3 — license request data | Cold home made no billing request without a token. | `license-request-minimum-data` inspected method, query, headers, and body and passed. |
| F-1-4 — provenance/runtime claims | Cold home/demo requests were same-origin. | Both provenance and runtime claims remain declared and passed. |
| F-1-5 — recorded route fields | Demo visibly shows ordered route evidence. | Controlled extension recording asserted every documented field and passed. |
| F-1-6 — unexplained terms | “Automated rules” and “merchant of record” are absent live. | Retired wording is absent from current product sources; copy tests passed. |
| F-2-1 — phone demo data | First sample row begins at y=596.6 in 390×844. | `mobile-first-view` passed. |
| F-2-2 — phone facts | All three facts end by y=706.4. | `mobile-first-view` asserts every fact bound and passed. |
| F-2-3 — undeclared license/distribution claims | Stale price, payment-handler, device, refund, and store promises are absent. | `pro-unavailable` is declared; no checkout source/action remains. |
| F-2-4 — unsupported replay | Live heading says **Review a six-step route report** and provides review controls only. | Copy regression test requires the current terminology. |
| F-2-5 — vague/technical copy | Current field, free-feature, and focus-outline wording is plain. | Copy tests and the complete sentence audit passed. |
| F-2-6 — metaphorical 404 | Unknown URL returns HTTP 404 and **Page not found.** | Designed `404.html` and response override remain; route test passed. |
| F-2-7 — menu result label | Phone control shows Open menu, then Close menu, and returns focus after Escape. | Menu state/keyboard test passed. |
| F-3-1 — external destinations | GitHub source and issue links name GitHub and returned 200. | External-link naming test passed. |
| F-3-2 — desktop download | Desktop and mobile navigation say **Download extension**. | Copy/route test passed. |
| F-3-3 — decorative route number | Live art caption says **Example focus route**. | `ROUTE 014` is absent; copy regression test passed. |
| F-3-4 — browser shorthand | Demo uses Link, Button, Text field, page position, Tab, Shift+Tab, and pixel movement. | Exact-label assertions passed. |
| F-3-5 — inconsistent terms | Live copy consistently uses focus route, route report, and review notes. | Site, README, legal, and extension copy test passed. |
| F-3-6 — unclear license fallback | Live-shaped fallback states give a status and next step. | Both fallback-message assertions passed. |
| F-3-7 — README abbreviations | README expands Manifest V3 and says automated accessibility checks. | Copy regression test passed. |
| F-4-1 — dead Pro checkout | Live page clearly says sales are unavailable and exposes no purchase link. | `pro-unavailable` checked site and packaged extension and passed. |
| F-5-1 — untested offline promise | Live fallback now names only the sample route; offline demo reload, notes, and Reset work. | `offline-sample-route` exists and passed in its own context. |
| Controller menu regression | Stable phone menu states and focus return work live. | The selector/state/target-size regression test passed. |
| Controller paid-action regression | No live checkout or Buy-license action exists. | Packaged-extension and site absence assertions passed. |
| Round-4 nested-region issue | Live demo axe scan reports no violation. | Review notes remain a named `section`; local axe tests passed. |

No earlier finding is unfixed, half-fixed, or regressed.

## Structure, accessibility, and visual identity

- `/`, `/?demo=1`, `/privacy/`, `/terms/`, `/404.html`, `robots.txt`, `sitemap.xml`, the extension ZIP, and both same-repository GitHub destinations responded successfully. A new unknown URL returned the designed page with HTTP 404.
- Each product page has `lang="en"`, one h1, a main landmark, a route-specific title, description, canonical, Open Graph/Twitter metadata, favicon, Apple icon, consistent header/footer links, and a skip link.
- Titles follow the required pattern: **Focus Flow Map — Map the keyboard focus route**, **Demo — Focus Flow Map**, **Privacy — Focus Flow Map**, **Terms — Focus Flow Map**, and **Page not found — Focus Flow Map**.
- Direct deep links and Back navigation work. Route changes focus the h1 and update a polite live region.
- Response headers include CSP with `frame-ancestors 'none'`, `no-referrer`, and `nosniff`. Successful live routes produced no console or page error.
- Playwright axe 4.10.2 reported zero violations on home, demo, Privacy, Terms, and 404. Touch-target, keyboard, reduced-motion, and 390 px checks also passed in the full suite.
- The midnight drafting grid, cream evidence sheets, coral route marks, engineered local type, and original blueprint image match `.factory/design.md`. The page is recognizable as a focus-route drafting tool, not a generic SaaS template.

## Broader verification

- Every claim command: 17 of 17 passed independently from the clean clone.
- `npm run check`: typecheck passed; 18 unit tests passed; 50 browser tests passed; four intended single-project cases skipped; build passed.
- `npm run build` produced `dist/`; site JavaScript is 5.35 kB raw / 2.15 kB gzip and the complete extension output is 92.07 kB.
- `npm audit --omit=dev --audit-level=low`: zero production vulnerabilities.
- `unzip -t dist/site/downloads/focus-flow-map-chrome.zip`: no archive errors.
- `/opt/fleet/lib/verify-url.sh` passed home, demo, Privacy, Terms, and direct 404 with no console errors. Evidence is under `.factory/evidence/review-6-live-*`.
- The clean build and deployment have identical SHA-256 hashes for home HTML, home JavaScript, home CSS, and the service worker.

## Missed leverage

No missing AI, import/export, or sync feature is implied strongly enough by the brief to create a finding. Markdown and JSON already provide the expected reproducible handoff. Sync would weaken the stated local-first privacy boundary. The task is deterministic and does not need an AI step. No decorative AI feature, embedded provider key, or direct model call exists.

## What would make this perfect

Nothing actionable was found in this round. Preserve the current one-click sample, isolated storage, claim-to-test mapping, plain terminology, and route/accessibility checks when the product changes.
