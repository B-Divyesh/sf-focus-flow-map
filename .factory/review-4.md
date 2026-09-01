# Adversarial first-read review 4 — Focus Flow Map

- **Work order:** `focus-flow-map-review-4`
- **Reviewed:** 1 September 2026
- **Candidate:** `63429d4867fd46acbefb8e3374e147a8848c5f1c`
- **Production:** <https://focus-flow-map.sociobot.in>
- **Demo:** <https://focus-flow-map.sociobot.in/?demo=1>
- **Verdict:** **FAIL** — one blocking finding remains.

## First 30 seconds

I opened production cold in separate Chromium contexts at 390×844 and 1440×1000. I did not scroll before recording the first-screen result.

In my own words:

- **What it does:** records where keyboard focus moves when someone presses Tab, then makes a route report.
- **For whom:** keyboard-only and RSI-affected users, auditors, and the people supporting them.
- **What to click first:** **Try it with sample data**; the adjacent text says a finished route report opens now.

The exact first-screen copy is **“Map where Tab goes.”**, **“For keyboard-only and RSI-affected users, it records a focus route and turns it into a route report.”**, **“Try it with sample data”**, and **“A finished route report opens now.”** The three facts end at y=706 on the 844-pixel phone viewport. This check passes on both sizes.

## Findings

### F-4-1 — BLOCKING — the Pro purchase action opens a dead checkout endpoint

**Exact quote/location:** Landing-page price sheet, **“Buy a Pro license on Sociobot (external)”**, linking to `https://api.sociobot.in/api/v1/products/focus-flow-map/checkout`.

**Observed result:** A direct GET, which is the request made by activating the link, returns HTTP 404 and `{"error":"enabled factory product","status":404}`. The same URL is present in the extension dashboard. GitHub source and issue links both return 200; this is the only live destination that failed.

**Why this blocks acceptance:** The action names the result “Buy a Pro license,” but a visitor receives a raw JSON error and cannot buy Pro. The product therefore does not work end to end for its advertised paid tier. The declared `pro-price` test passes because it checks the price, wording, and URL string without contacting the checkout endpoint; it does not test the promised purchase outcome. This is also an unlisted functional claim.

**Concrete fix:** Enable `focus-flow-map` in the Sociobot billing catalog so the URL returns a checkout redirect, or remove the paid offer until checkout is available. Add a deployment smoke test or claim test that performs an anonymous GET and requires a successful checkout redirect rather than merely asserting the href.

## Copy audit

Counts are whitespace-delimited; hyphenated terms and code literals count as one word. Repeated desktop/mobile copies are listed once. No sentence exceeds 22 words. No banned marketing adjective, metaphor heading, mood slogan, or inconsistent product term was found. Every action uses a result-naming verb. F-4-1 concerns the failed result behind a correctly named action.

### Landing-page sentences and runtime messages

| Words | Sentence | Result |
| ---: | --- | --- |
| 4 | Map where Tab goes. | Pass |
| 17 | For keyboard-only and RSI-affected users, it records a focus route and turns it into a route report. | Pass |
| 6 | A finished route report opens now. | Pass |
| 9 | Download when you are ready to record a site. | Pass |
| 6 | Recording begins only when you choose. | Pass |
| 6 | Route reports use local extension storage. | Pass |
| 6 | Download Markdown and JSON route reports. | Pass |
| 5 | Review a sample focus route. | Pass |
| 17 | See a finished focus route through a checkout with a page jump and a missing focus indicator. | Pass |
| 10 | Use the review notes to understand what a maintainer receives. | Pass |
| 9 | Record one focus route and share its route report. | Pass |
| 10 | The route report marks steps that need a manual check. | Pass |
| 10 | Focus Flow Map records the focus route you actually used. | Pass |
| 10 | Choose the extension on the page you want to inspect. | Pass |
| 8 | A visible recorder confirms that it is running. | Pass |
| 4 | Use Tab and Shift+Tab. | Pass |
| 13 | The focus route records redacted labels, page position, direction, and visible focus styles. | Pass |
| 6 | It never records what you type. | Pass |
| 15 | Review numbered steps and checks for jumps, loops, stalls, hidden targets, and missing focus indicators. | Pass |
| 8 | Export the route report as Markdown or JSON. | Pass |
| 6 | The page moved down 684 pixels. | Pass |
| 9 | Confirm that the delivery field remains easy to locate. | Pass |
| 9 | The browser detected no focus outline on Place order. | Pass |
| 6 | Check the control in the browser. | Pass |
| 6 | These review notes support a review. | Pass |
| 5 | They do not certify accessibility. | Pass |
| 5 | Your focus route stays local. | Pass |
| 15 | Focus Flow Map removes query strings, hashes, sensitive path values, email addresses, and token-like text. | Pass |
| 5 | It never records input values. | Pass |
| 6 | Route reports stay in extension storage. | Pass |
| 7 | No focus route is sent to us. | Pass |
| 9 | License verification sends only the license token to Sociobot. | Pass |
| 5 | Keep more local route reports. | Pass |
| 10 | Free keeps your latest route report and both export formats. | Pass |
| 10 | Pro adds a 30-session local history and private audit notes. | Pass |
| 9 | Recording, redaction, and Markdown and JSON exports are free. | Pass |
| 5 | A refund stops Pro features. | Pass |
| 4 | Load the unpacked extension. | Pass |
| 5 | Download and unzip the package. | Pass |
| 7 | Open chrome://extensions and turn on Developer mode. | Pass |
| 8 | Choose “Load unpacked” and select the unzipped folder. | Pass |
| 10 | Pin Focus Flow Map, open a website, and start recording. | Pass |
| 9 | Record a focus route and share its route report. | Pass |
| 12 | The factory image model generated the original hero image for this product. | Pass |
| 8 | Demo reset to the original six-step focus route. | Pass |
| 2 | License active. | Pass |
| 9 | Copy it into the extension to unlock local Pro. | Pass |
| 4 | License no longer active. | Pass |
| 6 | Your last verified license remains active. | Pass |
| 8 | We’ll check it again when you are online. | Pass |
| 1 | Offline. | Pass |
| 6 | Free tools and downloads remain available. | Pass |
| 2 | Verifying license… | Pass |
| 3 | Could not verify. | Pass |
| 6 | Check your connection and try again. | Pass |
| 2 | License copied. | Pass |
| 9 | Paste it into the extension to use local Pro. | Pass |
| 3 | Copy was blocked. | Pass |
| 13 | Copy the token from your purchase email and paste it into the extension. | Pass |

### Landing headings, actions, labels, and image text alternative

| Words | Copy | Result |
| ---: | --- | --- |
| 4 | Skip to main content | Clear action |
| 3 | Focus Flow Map | Clear wordmark |
| 4 | Focus Flow Map home | Clear accessible home-link name |
| 1 | Demo | Clear destination |
| 3 | How it works | Clear destination and heading |
| 1 | Privacy | Clear destination and heading |
| 2 | Download extension | Result-naming action |
| 2 each | Open menu / Close menu | Result-naming states |
| 6 | Demo — sample data, nothing is saved | Clear demo banner |
| 2 | Reset demo | Result-naming action |
| 3 | Start for real | Clear demo exit |
| 3 | Sample route report | Clear label |
| 4 | Keyboard focus route recorder | Clear product label |
| 5 | Try it with sample data | Result-naming action |
| 3 | Download for Chromium | Result-naming action |
| 3 | Chromium extension package | Clear format label |
| 3 | Example focus route | Clear illustration label |
| 6 | Original illustration generated for this product | Clear provenance label |
| 16 | A dark blue drafting sheet with a coral route linking focus stations across two interface frames | Useful image alternative |
| 4 | Starts on your command | Clear fact heading |
| 4 | Stays in the extension | Clear fact heading |
| 3 | Exports for free | Clear fact heading |
| 2 | Start recording | Result-naming heading |
| 3 | Use Tab normally | Clear instruction heading |
| 4 | Export the route report | Result-naming heading |
| 4 | Sample checkout focus route | Clear sample label |
| 6 | Review a six-step route report | Clear section heading |
| 3 each | Hide review notes / Show review notes | Result-naming states |
| 2 | Review notes | Clear heading |
| 5 | Step 4 needs review | Clear heading |
| 3 | Skip to checkout | Clear sample label |
| 4 | Change basket quantity | Clear sample label |
| 4 | Apply discount code | Clear sample label |
| 2 | Delivery address | Clear sample label |
| 2 | Place order | Clear sample label |
| 2 | Review basket | Clear sample label |
| 5 | Link · page position 0 · Tab | Plain sample detail |
| 5 | Button · page position 0 · Tab | Plain sample detail |
| 6 | Text field · page position 684 · Tab | Plain sample detail |
| 5 | Page moved down 684 pixels | Plain sample detail |
| 7 | Link · page position 0 · Shift + Tab | Plain sample detail |
| 4 | Read the privacy policy | Result-naming link |
| 3 | Local by default | Clear privacy stamp |
| 3 | Optional Pro license | Clear label |
| 2 | Personal license | Clear label |
| 1 | $24 | Exact price |
| 2 | One-time purchase | Clear price term |
| 3 | 30-session local history | Clear feature label |
| 4 | Private notes per audit | Clear feature label |
| 7 | Buy a Pro license on Sociobot (external) | Result-naming action; destination fails in F-4-1 |
| 2 | Already purchased? | Clear disclosure label |
| 4 | Paste your license token | Clear field label |
| 2 | Verify license | Result-naming action |
| 5 | Copy license for the extension | Result-naming action |
| 3 | Install the extension | Clear section label |
| 6 | View source on GitHub (external) | Result-naming external link |
| 4 | Built by Param Factory | Clear attribution |
| 1 | v1.0.0 | Exact version |

### README sentences and instructional statements

| Words | Sentence | Result |
| ---: | --- | --- |
| 18 | Focus Flow Map is a Chromium extension for keyboard-only and RSI-affected users, auditors, and the teams supporting them. | Pass |
| 9 | It records a user-started Tab and Shift+Tab focus route. | Pass |
| 14 | The local route report shows numbered steps, page jumps, loops, and missing focus indicators. | Pass |
| 6 | Free exports include Markdown and JSON. | Pass |
| 16 | Choose Try it with sample data on the first screen, or open the sample link above. | Pass |
| 7 | A completed six-step checkout route appears immediately. | Pass |
| 5 | The banner identifies demo mode. | Pass |
| 15 | Reset demo restores the sample, and Start for real returns to the normal product page. | Pass |
| 12 | Demo state uses only demo:focus-flow-map: keys and is removed when you leave. | Pass |
| 10 | The demo does not read or change real license data. | Pass |
| 8 | See .factory/demo.md for the sample and isolation details. | Pass |
| 8 | Records only after the user chooses Start recording. | Pass |
| 10 | Captures focus order, direction, labels, page position, scrolling, and visibility. | Pass |
| 13 | Stores a redacted element locator and whether each control shows a focus outline. | Pass |
| 17 | Flags large page jumps, off-screen targets, recent repeats, stalled Tab movement, and missing focus indicators for review. | Pass |
| 15 | Redacts queries, hashes, sensitive URL paths, URLs in labels, email addresses, identifiers, and token-like text. | Pass |
| 6 | Never reads or records input values. | Pass |
| 6 | Stores sessions in browser extension storage. | Pass |
| 8 | It sends no audit content to a server. | Pass |
| 12 | Exports a complete Markdown or JSON route report in the free tier. | Pass |
| 14 | Offers an optional $24 one-time Pro license for 30 local sessions and private notes. | Pass; checkout result fails in F-4-1 |
| 9 | Keeps recording, redaction, and Markdown and JSON exports free. | Pass |
| 7 | The review notes support an accessibility review. | Pass |
| 5 | They do not certify compliance. | Pass |
| 9 | Test with disabled users before making a compliance claim. | Pass |
| 5 | Requirements: Node.js 22+ and npm. | Pass |
| 19 | For the extension, open chrome://extensions, enable Developer mode, choose Load unpacked, and select .output/chrome-mv3 after WXT has built it. | Pass |
| 20 | npm test runs privacy and route-report tests, Chromium extension tests, 390 px tests, route metadata checks, and automated accessibility checks. | Pass |
| 10 | Customer-facing claims and their exact commands are listed in .factory/claims.json. | Pass |
| 10 | Each command runs one tagged test against shipped sample data. | Pass |
| 9 | The exact production build command is npm run build. | Pass |
| 2 | It creates: | Pass |
| 5 | dist/site/index.html — static deployment root. | Pass |
| 8 | dist/site/downloads/focus-flow-map-chrome.zip — installable Chromium Manifest V3 (MV3) package. | Pass |
| 6 | .output/chrome-mv3/ — unpacked extension for development. | Pass |
| 5 | Preview the production site with: | Pass |
| 15 | WXT and TypeScript for the Manifest V3 extension worker, recorder, popup, and local route report. | Pass |
| 13 | Vite and vanilla TypeScript for the static product, demo, privacy, and terms pages. | Pass |
| 7 | Extension storage for sessions and license state. | Pass |
| 7 | Extension-origin local storage keeps private report notes. | Pass |
| 8 | A separate demo:focus-flow-map: namespace for disposable sample state. | Pass |
| 9 | Sociobot billing API for hosted checkout and license verification. | F-4-1 for hosted checkout |
| 5 | No payment provider is embedded. | Pass; covered by same-origin runtime and no-frame checks |
| 11 | No analytics, external runtime scripts, CDN fonts, or remote session storage. | Pass |
| 9 | The no-third-party-runtime claim test checks both home and demo. | Pass |
| 11 | activeTab and site access observe focus only after an explicit start. | Pass |
| 11 | storage keeps route reports and license state on the current device. | Pass |
| 11 | tabs identifies the active page and opens the local route report. | Pass |
| 10 | See the product brief, visual thesis, privacy policy, and terms. | Pass |
| 1 | MIT. | Pass |
| 2 | See LICENSE. | Pass |

README headings are **Focus Flow Map**, **Try the isolated demo**, **What v1 does**, **Run locally**, **Test and build**, **Architecture**, **Permissions**, and **License**. Each names its section. The code blocks contain commands rather than prose sentences.

### Terminology

| Concept | Term used |
| --- | --- |
| Recorded sequence | focus route |
| Displayed or exported result | route report |
| Checks needing inspection | review notes |
| Large document movement | page jump / page movement |
| Downloaded product | extension |

## Demo and sandbox

The required demo path passes.

- The first-screen action reaches `/?demo=1` in one click.
- The first demo screen contains six realistic checkout steps, a 684-pixel page movement, and a missing-focus-indicator review note.
- The first route row starts at y=596.6 on 390×844 and y=798.9 on 1440×1000, so product data is visible without scrolling.
- The persistent **“Demo — sample data, nothing is saved”** banner, **Reset demo**, and **Start for real** controls are present.
- Reset restores the review notes and announces **“Demo reset to the original six-step focus route.”**
- Instrumentation recorded only `demo:focus-flow-map:state` reads, writes, and removal while demo mode was shown. A fresh real-license sentinel was unchanged.
- Leaving the demo removes the demo key. The real-license sentinel remains.
- The direct live demo request log is same-origin only. No analytics, remote session write, frame, console error, or page error was observed.
- After one online visit, a live offline reload retained the banner and all six route rows.

## Claims

I cloned the candidate into `/tmp/focus-flow-map-review4.JUQmL7`, ran `npm ci`, and ran all 17 commands from `.factory/claims.json` separately. Every declared command passed.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `demo-isolated` | Pass | Demo namespace only; Reset and exit work; real key preserved. |
| `keyboard-demo` | Pass | Tab and Enter operate Reset and review-note controls. |
| `mobile-first-view` | Pass | Three facts and first sample row fit at 390×844. |
| `chromium-package` | Pass | First-screen ZIP response is non-empty and installable. |
| `explicit-recording` | Pass | No recording or session exists before explicit start. |
| `local-session-privacy` | Pass | Recorded audit content remains in extension storage. |
| `license-request-minimum-data` | Pass | Fixture request uses one query token and no request body/token header. |
| `refund-revokes-pro` | Pass | Refunded fixture disables Pro while free tools remain. |
| `sensitive-redaction` | Pass | Query, hash, sensitive path, email, identifier, and input value are absent from storage and exports. |
| `markdown-json-export` | Pass | Free Markdown and JSON downloads contain the recorded route. |
| `route-checks` | Pass | Page jump, hidden target, repeat, stall, and missing-indicator notes are raised. |
| `recorded-route-fields` | Pass | Stored steps include every declared field and redacted locator. |
| `history-limits` | Pass | Free retains one local report; licensed fixture retains 30. |
| `pro-local-notes` | Pass | A private note persists on the extension origin. |
| `pro-price` | Pass as written, incomplete for live outcome | The test asserts price, terms, and href but never requests checkout; see F-4-1. |
| `original-image-provenance` | Pass | Prompt, source image, derivative, date, and disclosure exist. |
| `no-third-party-runtime` | Pass | Home/demo scripts and fonts are local; no frames or runtime data requests appear. |

The visible **Buy a Pro license** result is not covered by an end-to-end claim and fails live. No other unlisted claim-like sentence was confirmed.

## Earlier finding verification

I read every `.factory/review-*.md`, `.factory/polish-*.md`, and the prior handoff. Each earlier finding was checked in production and in current source, not accepted from its recorded status.

| Earlier finding | Live and code confirmation |
| --- | --- |
| `F-1-1` route focus | Fixed: home, Privacy, and Back focus the new h1 and update `#route-announcer`; `route-focus.js` implements the behavior. |
| `F-1-2` route metadata | Fixed: home, demo, Privacy, Terms, 404, and a real missing URL have route-specific title, description, canonical, Open Graph, Twitter, favicon, and touch icon data. |
| `F-1-3` license-request claim | Fixed: the manifest entry exists and its intercepted token-only request test passes. |
| `F-1-4` provenance/runtime claims | Fixed: both entries and tests pass; the fresh live demo request log is same-origin. |
| `F-1-5` recorded route fields | Fixed: the declared extension test checks every documented stored field and redacted locator. |
| `F-1-6` unexplained terms | Fixed: “Automated rules” and “merchant of record” remain absent; current wording is plain. |
| `F-2-1` phone demo data | Fixed: the first sample row begins at y=596.6 in the 390×844 viewport. |
| `F-2-2` phone facts | Fixed: all three facts end by y=706.4 in the first phone viewport. |
| `F-2-3` undeclared license/distribution statements | Fixed: device-use, payment-handler, and future-store statements remain absent; refund behavior is declared and tested. |
| `F-2-4` unsupported replay | Fixed: the live heading says **“Review a six-step route report.”** |
| `F-2-5` vague/technical copy | Fixed: the free-feature, recorded-field, and focus-outline wording remains plain. |
| `F-2-6` metaphorical 404 | Fixed: a real missing URL returns HTTP 404 with **“Page not found.”** |
| `F-2-7` menu label | Fixed: the phone control changes between **Open menu** and **Close menu**, supports Enter/Escape, and returns focus. |
| `F-3-1` external destinations | Fixed: every external link names GitHub or Sociobot and says “external.” F-4-1 is a new destination-availability defect. |
| `F-3-2` desktop Download | Fixed: both desktop and mobile navigation say **“Download extension.”** |
| `F-3-3` decorative route number | Fixed: **“ROUTE 014”** remains absent; **“Example focus route”** is live. |
| `F-3-4` browser shorthand | Fixed: sample rows use Link/Button/Text field, page position, Tab, and page-movement wording. |
| `F-3-5` inconsistent terms | Fixed: product copy consistently uses focus route, route report, and review notes. |
| `F-3-6` license fallback copy | Fixed: the current offline and clipboard messages give plain next steps; retired wording is absent. |
| `F-3-7` README abbreviations | Fixed: “automated accessibility checks” and expanded Manifest V3 wording remain in README. |

No earlier finding regressed, so none is reopened under its former id.

## Structure, accessibility, and visual identity

- `/`, `/?demo=1`, `/privacy/`, `/terms/`, and `/404.html` return 200. A new unknown path returns the designed 404 document with HTTP 404.
- Every checked route has `lang="en"`, one h1, one main landmark, ordered headings, a description, canonical URL, Open Graph/Twitter data, SVG favicon, and Apple touch icon.
- Titles are **Focus Flow Map — Map the keyboard focus route**, **Demo — Focus Flow Map**, **Privacy — Focus Flow Map**, **Terms — Focus Flow Map**, and **Page not found — Focus Flow Map**.
- Route entry and Back focus and announce the current h1.
- Header/footer, Privacy/Terms links, skip links, and the version/build line are present. All same-origin links from normal routes return 200, and their fragments resolve in-page. The 65,101-byte extension ZIP, robots, sitemap, social card, and icons resolve. GitHub destinations return 200. The checkout exception is F-4-1.
- Fresh mobile and desktop route scans found no horizontal overflow, console/page errors, unlabeled controls, missing image alternatives, or serious/critical axe violations.
- `/opt/fleet/lib/verify-url.sh` passes home, demo, Privacy, Terms, and the direct 404 document.
- The midnight drafting grid, cream report sheets, coral route marks, technical type, ruled stations, and original blueprint image match `.factory/design.md` and do not resemble a generic SaaS template.

## Broader verification

- All 17 claim commands passed independently from the clean clone.
- `npm run typecheck` passed.
- `npm test` passed 17 unit tests and 50 browser tests; four intentional single-project tests were skipped.
- `npm run build` produced `dist/`; extension output totals 92.13 kB and site JavaScript is 5.33 kB raw / 2.15 kB gzip.
- `npm audit --omit=dev --audit-level=low` found 0 production vulnerabilities.
- `unzip -t dist/site/downloads/focus-flow-map-chrome.zip` passed.
- Built and live home, Privacy, Terms, and 404 HTML hashes match. The live ZIP is valid via its claim test; archive timestamps make its byte hash nondeterministic.

## Missed leverage

No additional AI, import, export, or sync feature is implied strongly enough to create a finding. The core job is local focus observation and a reproducible handoff; Markdown and JSON export provide that handoff. Sync would weaken the stated local-first boundary. No runtime AI feature, provider credential, or embedded model key exists.

## What would make this perfect

Make the Pro checkout action reach a working Sociobot checkout, and add an end-to-end availability assertion for that result. Then rerun all 17 claim commands, the live link crawl, and the complete first-read checklist. Nothing else remains from this review.
