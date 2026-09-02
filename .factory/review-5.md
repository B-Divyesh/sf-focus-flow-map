# Adversarial first-read review 5 — Focus Flow Map

- **Work order:** `focus-flow-map-review-5`
- **Reviewed:** 2 September 2026
- **Candidate:** `03c8cac6ce445a33e0e0477fdd9be966756b7143`
- **Production:** <https://focus-flow-map.sociobot.in>
- **Demo:** <https://focus-flow-map.sociobot.in/?demo=1>
- **Verdict:** **FAIL** — one minor finding remains. There are no blocking findings.

## First 30 seconds

I opened production cold in separate Chromium contexts at 390×844 and 1440×1000, without scrolling before recording the result.

- **What it does:** Records where keyboard focus moves when a person presses Tab, then makes a route report.
- **For whom:** Keyboard-only and RSI-affected users, auditors, and people supporting them.
- **What to click first:** **Try it with sample data**; the adjacent text says a finished route report opens now.

The exact supporting text is **“Map where Tab goes.”**, **“For keyboard-only and RSI-affected users, it records a focus route and turns it into a route report.”**, **“Try it with sample data”**, and **“A finished route report opens now.”** The first screen therefore answers all three questions on both sizes. On the phone, the three facts end at y=706.4 of the 844-pixel viewport. On desktop, the proof strip ends at y=875.4 of the 1,000-pixel viewport.

## Findings

### F-5-1 — Minor — an offline availability promise is not a declared, tagged claim

**Exact quote/location:** `site/main.ts:145`, shown to a visitor after an offline failed license check: **“Offline. Free tools and downloads remain available.”**

**Why this is a finding:** This is a concrete reliance claim about offline behavior. It has no entry in `.factory/claims.json`; the untagged service-worker test proves the sample route can reload offline, while `pro-unavailable` proves free outputs with an unavailable checkout. Neither is the required one-to-one, declared sandbox test for this exact offline statement. “Downloads” is also broader than the cached demo result demonstrated by the existing test.

**Concrete fix:** Prefer the narrower, immediately useful message **“Offline. Your saved route reports remain available.”** If the intended promise is retained, add an `offline-free-tools` claim and a single `@claim:offline-free-tools` isolated-context test that visits the demo, sets the context offline, reloads, and proves each named free tool and any promised download outcome. Put the exact copy locations in `where`.

## Copy audit

Counts are whitespace-delimited; labels, headings, actions, runtime messages, and image alternative text are included so button naming and out-of-context headings are checked too. No current item exceeds 22 words. No banned marketing adjective, metaphor heading, or inconsistent core term was found. The one claim-coverage exception is F-5-1.

### Landing page and runtime messages

| Words | Copy | Result |
| ---: | --- | --- |
| 4 | Map where Tab goes. | Pass |
| 18 | For keyboard-only and RSI-affected users, it records a focus route and turns it into a route report. | Pass |
| 6 | A finished route report opens now. | Pass |
| 9 | Download when you are ready to record a site. | Pass |
| 6 | Recording begins only when you choose. | Declared `explicit-recording` claim |
| 6 | Route reports use local extension storage. | Declared `local-session-privacy` claim |
| 6 | Download Markdown and JSON route reports. | Declared `markdown-json-export` claim |
| 17 | See a finished focus route through a checkout with a page jump and a missing focus indicator. | Declared `demo-isolated` claim |
| 10 | Use the review notes to understand what a maintainer receives. | Pass |
| 9 | Record one focus route and share its route report. | Pass |
| 10 | The route report marks steps that need a manual check. | Pass |
| 10 | Focus Flow Map records the focus route you actually used. | Pass |
| 10 | Choose the extension on the page you want to inspect. | Pass |
| 8 | A visible recorder confirms that it is running. | Declared `explicit-recording` claim |
| 4 | Use Tab and Shift+Tab. | Pass |
| 13 | The focus route records redacted labels, page position, direction, and visible focus styles. | Declared `recorded-route-fields` claim |
| 6 | It never records what you type. | Declared `sensitive-redaction` claim |
| 15 | Review numbered steps and checks for jumps, loops, stalls, hidden targets, and missing focus indicators. | Declared `route-checks` claim |
| 8 | Export the route report as Markdown or JSON. | Declared `markdown-json-export` claim |
| 6 | The page moved down 684 pixels. | Demo data, observed |
| 9 | Confirm that the delivery field remains easy to locate. | Pass |
| 9 | The browser detected no focus outline on Place order. | Demo data, observed |
| 6 | Check the control in the browser. | Clear next action |
| 6 | These review notes support a review. | Pass |
| 5 | They do not certify accessibility. | Pass |
| 16 | Focus Flow Map removes query strings, hashes, sensitive path values, email addresses, and token-like text. | Declared `sensitive-redaction` claim |
| 5 | It never records input values. | Declared `sensitive-redaction` claim |
| 6 | Route reports stay in extension storage. | Declared `local-session-privacy` claim |
| 7 | No focus route is sent to us. | Declared `local-session-privacy` claim |
| 9 | License verification sends only the license token to Sociobot. | Declared `license-request-minimum-data` claim |
| 5 | Pro license sales are unavailable. | Declared `pro-unavailable` claim |
| 7 | The product owner has not enabled checkout. | Declared `pro-unavailable` claim |
| 6 | You cannot buy a license here. | Declared `pro-unavailable` claim |
| 10 | Free keeps your latest route report and both export formats. | Declared `history-limits` and `markdown-json-export` claims |
| 9 | Recording, redaction, and Markdown and JSON exports remain free. | Declared output claims |
| 10 | Pro stays off unless you already have a valid license. | Declared `pro-unavailable` claim |
| 8 | No payment can be made on this site. | Declared `pro-unavailable` claim |
| 5 | Download and unzip the package. | Clear instruction |
| 7 | Open chrome://extensions and turn on Developer mode. | Clear instruction |
| 8 | Choose “Load unpacked” and select the unzipped folder. | Clear instruction |
| 10 | Pin Focus Flow Map, open a website, and start recording. | Clear instruction |
| 9 | Record a focus route and share its route report. | Pass |
| 12 | The factory image model generated the original hero image for this product. | Declared `original-image-provenance` claim |
| 9 | Demo reset to the original six-step focus route. | Declared `demo-isolated` claim |
| 2 | License active. | Clear status |
| 9 | Copy it into the extension to unlock local Pro. | Declared `pro-local-notes` claim |
| 4 | License no longer active. | Clear status |
| 6 | Your last verified license remains active. | Clear status |
| 8 | We’ll check it again when you are online. | Clear fallback |
| 2 | Offline. | Clear status |
| 6 | Free tools and downloads remain available. | **F-5-1** |
| 2 | Verifying license… | Clear status |
| 3 | Could not verify. | Clear status |
| 6 | Check your connection and try again. | Clear next action |
| 2 | License copied. | Clear outcome |
| 9 | Paste it into the extension to use local Pro. | Clear outcome |
| 3 | Copy was blocked. | Clear status |
| 13 | Copy the token from your purchase email and paste it into the extension. | Clear next action |

### Landing headings, actions, labels, and image text alternative

| Words | Copy | Result |
| ---: | --- | --- |
| 4 | Skip to main content | Clear action |
| 3 | Focus Flow Map | Clear wordmark |
| 4 | Focus Flow Map home | Clear accessible home-link name |
| 1 / 3 / 1 / 2 | Demo / How it works / Privacy / Download extension | Literal destinations; download names its result |
| 2 each | Open menu / Close menu | Literal menu states |
| 6 | Demo — sample data, nothing is saved | Required demo banner |
| 2 / 3 | Reset demo / Start for real | Clear demo controls |
| 3 | Sample route report | Literal label |
| 4 | Keyboard focus route recorder | Literal product label |
| 5 / 3 | Try it with sample data / Download for Chromium | Result-naming actions |
| 3 | Chromium extension package | Clear format label |
| 3 | Example focus route | Literal illustration label |
| 6 | Original illustration generated for this product | Declared provenance claim |
| 16 | A dark blue drafting sheet with a coral route linking focus stations across two interface frames | Useful image alternative |
| 4 / 4 / 3 | Starts on your command / Stays in the extension / Exports for free | Specific fact headings |
| 2 / 3 / 4 | Start recording / Use Tab normally / Export the route report | Literal workflow headings |
| 4 | Sample checkout focus route | Literal sample label |
| 6 | Review a six-step route report | Literal section heading |
| 3 each | Hide review notes / Show review notes | Result-naming states |
| 2 / 5 | Review notes / Step 4 needs review | Literal headings |
| 3 / 4 / 4 / 2 / 2 / 2 | Skip to checkout / Change basket quantity / Apply discount code / Delivery address / Place order / Review basket | Realistic sample labels |
| 5 / 5 / 6 / 5 / 7 | Link · page position 0 · Tab / Button · page position 0 · Tab / Text field · page position 684 · Tab / Page moved down 684 pixels / Link · page position 0 · Shift + Tab | Plain sample detail |
| 3 | Local by default | Specific privacy label |
| 3 / 3 | Pro license status / Sales not enabled | Literal availability labels |
| 3 | No purchase action | Literal state heading |
| 4 / 4 / 2 | Have an existing license? / Paste your license token / Verify license | Clear recovery control |
| 3 | Install the extension | Literal section label |
| 6 | View source on GitHub (external) | Names external destination |
| 4 | Built by Param Factory | Clear attribution |
| 1 | v1.0.0 | Version |

### README sentences and instructional statements

| Words | Sentence | Result |
| ---: | --- | --- |
| 18 | Focus Flow Map is a Chromium extension for keyboard-only and RSI-affected users, auditors, and the teams supporting them. | Clear audience |
| 9 | It records a user-started Tab and Shift+Tab focus route. | Declared `explicit-recording` claim |
| 14 | The local route report shows numbered steps, page jumps, loops, and missing focus indicators. | Declared route claims |
| 6 | Free exports include Markdown and JSON. | Declared `markdown-json-export` claim |
| 16 | Choose Try it with sample data on the first screen, or open the sample link above. | Clear entry point |
| 7 | A completed six-step checkout route appears immediately. | Declared `demo-isolated` claim |
| 5 | The banner identifies demo mode. | Observed |
| 15 | Reset demo restores the sample, and Start for real returns to the normal product page. | Declared `demo-isolated` claim |
| 12 | Demo state uses only demo:focus-flow-map: keys and is removed when you leave. | Declared `demo-isolated` claim |
| 10 | The demo does not read or change real license data. | Declared `demo-isolated` claim |
| 8 | See .factory/demo.md for the sample and isolation details. | Clear reference |
| 8 | Records only after the user chooses Start recording. | Declared `explicit-recording` claim |
| 10 | Captures focus order, direction, labels, page position, scrolling, and visibility. | Declared `recorded-route-fields` claim |
| 13 | Stores a redacted element locator and whether each control shows a focus outline. | Declared `recorded-route-fields` claim |
| 17 | Flags large page jumps, off-screen targets, recent repeats, stalled Tab movement, and missing focus indicators for review. | Declared `route-checks` claim |
| 15 | Redacts queries, hashes, sensitive URL paths, URLs in labels, email addresses, identifiers, and token-like text. | Declared `sensitive-redaction` claim |
| 6 | Never reads or records input values. | Declared `sensitive-redaction` claim |
| 6 | Stores sessions in browser extension storage. | Declared `local-session-privacy` claim |
| 8 | It sends no audit content to a server. | Declared `local-session-privacy` claim |
| 12 | Exports a complete Markdown or JSON route report in the free tier. | Declared `markdown-json-export` claim |
| 12 | Shows that Pro license sales are unavailable because checkout is not enabled. | Declared `pro-unavailable` claim |
| 13 | Lets an existing valid license restore a 30-session history and private notes. | Declared history and notes claims |
| 10 | Keeps recording, redaction, and Markdown and JSON exports free. | Declared output claims |
| 7 | The review notes support an accessibility review. | Clear limitation |
| 5 | They do not certify compliance. | Clear limitation |
| 9 | Test with disabled users before making a compliance claim. | Useful next action |
| 5 | Requirements: Node.js 22+ and npm. | Clear requirement |
| 20 | For the extension, open chrome://extensions, enable Developer mode, choose Load unpacked, and select .output/chrome-mv3 after WXT has built it. | Clear instruction |
| 20 | npm test runs privacy and route-report tests, Chromium extension tests, 390 px tests, route metadata checks, and automated accessibility checks. | Clear instruction |
| 10 | Customer-facing claims and their exact commands are listed in .factory/claims.json. | Accurate, observed |
| 10 | Each command runs one tagged test against shipped sample data. | Accurate, observed |
| 9 | The exact production build command is npm run build. | Accurate, observed |
| 6 | It creates dist/site/index.html — static deployment root. | Accurate, observed |
| 7 | It creates dist/site/downloads/focus-flow-map-chrome.zip — installable Chromium MV3 package. | Accurate, observed |
| 7 | It creates .output/chrome-mv3/ — unpacked extension for development. | Accurate, observed |
| 10 | Preview the production site with npx vite preview --config vite.site.config.ts. | Accurate instruction |
| 12 | WXT and TypeScript for the Manifest V3 extension worker, recorder, popup, and local route report. | Clear architecture |
| 13 | Vite and vanilla TypeScript for the static product, demo, privacy, and terms pages. | Clear architecture |
| 7 | Extension storage for sessions and license state. | Declared storage claims |
| 7 | Extension-origin local storage keeps private report notes. | Declared `pro-local-notes` claim |
| 8 | A separate demo:focus-flow-map: namespace for disposable sample state. | Declared `demo-isolated` claim |
| 6 | Sociobot billing API for existing-license verification. | Declared `license-request-minimum-data` claim |
| 9 | The product offers no checkout action while sales are unavailable. | Declared `pro-unavailable` claim |
| 10 | No analytics, external runtime scripts, CDN fonts, or remote session storage. | Declared `no-third-party-runtime` claim |
| 9 | The no-third-party-runtime claim test checks both home and demo. | Accurate reference |
| 11 | activeTab and site access observe focus only after an explicit start. | Declared `explicit-recording` claim |
| 11 | storage keeps route reports and license state on the current device. | Declared storage claims |
| 10 | tabs identifies the active page and opens the local route report. | Accurate permission explanation |
| 10 | See the product brief, visual thesis, privacy policy, and terms. | Clear reference |
| 1 / 2 | MIT. / See LICENSE. | Clear license statement |

README headings — **Focus Flow Map**, **Try the isolated demo**, **What v1 does**, **Run locally**, **Test and build**, **Architecture**, **Permissions**, and **License** — name their sections. Code blocks are commands, not prose sentences. The core terminology is consistent: **focus route** (recorded sequence), **route report** (displayed/exported result), and **review notes** (human checks).

## Demo and sandbox behavior

- The first-screen action reached `/?demo=1` in one click and immediately showed a realistic six-step checkout focus route, a 684-pixel page movement, and a missing-focus-indicator note.
- The persistent **“Demo — sample data, nothing is saved”** banner, **Reset demo**, and **Start for real** controls were visible.
- In a fresh live context, only the product origin appeared in the complete home-plus-demo request log; no console or page error occurred on those successful routes.
- The live demo used `demo:focus-flow-map:state`; the real license key was `null` in the fresh context. The declared isolation test independently instruments storage operations, preserves a real-key sentinel, checks reset, and checks exit.
- On phone, the first route row began at y=596.6; it is visible without scrolling. Reset restored the sample route and review notes.
- The full suite’s isolated service-worker case passed after `context.setOffline(true)`: the cached demo reloaded with its banner and six route rows. This supports the proposed F-5-1 claim test but does not register the visitor-facing offline statement as a claim.

## Claims

After `npm ci` in this checkout, I ran every command named in `.factory/claims.json` separately. All 16 commands passed. The first attempted isolated command encountered a transient absent local preview server after another runner released port 4173; I then built once, kept a dedicated local preview running, and reran the complete manifest serially. The recorded final run has one `PASS` marker for every id.

| Claim | Result | Observable check |
| --- | --- | --- |
| `demo-isolated` | Pass | Sample namespace only; Reset and exit work; real key is preserved. |
| `keyboard-demo` | Pass | Tab and Enter operate sample controls. |
| `mobile-first-view` | Pass | Three facts and the first sample row fit at 390×844. |
| `chromium-package` | Pass | First-screen ZIP is non-empty. |
| `explicit-recording` | Pass | No recorder/session exists before explicit start. |
| `local-session-privacy` | Pass | Audit content remains in extension storage. |
| `license-request-minimum-data` | Pass | Fixture request uses one query token and no body/token header. |
| `sensitive-redaction` | Pass | Sensitive URL/input fixtures do not reach storage or exports. |
| `markdown-json-export` | Pass | Both free downloads contain the recorded route. |
| `route-checks` | Pass | Jump, hidden, repeat, stall, and indicator checks appear. |
| `recorded-route-fields` | Pass | Stored steps contain documented route fields and a redacted locator. |
| `history-limits` | Pass | Free retains one local report; licensed fixture retains 30. |
| `pro-local-notes` | Pass | Private note persists on the extension origin. |
| `pro-unavailable` | Pass | No purchase/checkout action; free output remains available. |
| `original-image-provenance` | Pass | Local prompt, source, derivative, date, and disclosure exist. |
| `no-third-party-runtime` | Pass | Home/demo use local scripts/fonts/storage and no frames. |

F-5-1 is the only current claim-like visitor statement without its own manifest entry and tagged test.

## Earlier finding verification

I read every earlier `review-*.md`, `polish-*.md`, and the prior handoff, then checked the live site and current code rather than accepting a historical “fixed” label.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 route focus | Fixed: home, Privacy, and Back focus the new h1 and update `#route-announcer`. |
| F-1-2 route metadata | Fixed: home, demo, Privacy, Terms, and 404 have route-specific title, description, canonical, OG/Twitter data, and icons. |
| F-1-3 license request | Fixed: token-only request is declared and fixture-tested. |
| F-1-4 provenance/runtime | Fixed: both claims are declared and passed; live successful-route requests were same-origin. |
| F-1-5 recorded fields | Fixed: controlled extension capture checks the documented fields. |
| F-1-6 unexplained terms | Fixed: retired “Automated rules” and “merchant of record” wording remains absent. |
| F-2-1 phone demo data | Fixed: first route row is visible at y=596.6. |
| F-2-2 phone facts | Fixed: all facts end by y=706.4. |
| F-2-3 undeclared license/distribution statements | Fixed for its listed price, payment-handler, device, and store claims; F-5-1 is a newly detected offline claim. |
| F-2-4 replay promise | Fixed: live heading says “Review a six-step route report.” |
| F-2-5 vague/technical copy | Fixed: current field, free-tier, and focus-outline wording is plain. |
| F-2-6 metaphorical 404 | Fixed: a real unknown URL returns HTTP 404 and “Page not found.” |
| F-2-7 menu label | Fixed: phone control exposes Open menu/Close menu and keyboard close behavior. |
| F-3-1 external destinations | Fixed: GitHub links identify their external destination. |
| F-3-2 desktop download | Fixed: desktop and mobile navigation say “Download extension.” |
| F-3-3 decorative route number | Fixed: “Example focus route” remains; `ROUTE 014` is absent. |
| F-3-4 browser shorthand | Fixed: sample rows use Link/Button/Text field and plain page-position wording. |
| F-3-5 inconsistent terms | Fixed: focus route, route report, and review notes remain consistent. |
| F-3-6 license fallback copy | Fixed: current stale-license and clipboard messages give a next action. |
| F-3-7 README abbreviations | Fixed: Manifest V3 is expanded and “automated accessibility checks” is used. |
| F-4-1 dead Pro checkout | Fixed: no checkout/purchase link remains; the unavailable state is declared and tested. |

No earlier finding regressed under its original id.

## Structure, accessibility, and visual identity

- `/`, `/?demo=1`, `/privacy/`, `/terms/`, `/404.html`, `robots.txt`, `sitemap.xml`, the social card, and the extension ZIP returned 200. GitHub source returned 200. A fresh unknown product URL returned the designed 404 with HTTP 404.
- Successful routes have `lang="en"`, one h1, a main landmark, description, canonical URL, OG/Twitter metadata, favicon, Apple touch icon, and the expected title pattern. The demo title is **Demo — Focus Flow Map**.
- A fresh desktop navigation check focused and announced the home h1, then Privacy’s h1, then the home h1 after Back.
- Fresh axe scans reported zero violations on home, demo, Privacy, Terms, and direct 404. Successful-route console/page error logs were empty. The browser’s expected network diagnostic for an intentionally requested unknown URL was not treated as an application console error.
- Header/footer, skip links, Privacy/Terms links, direct demo URL, deep links, and mobile keyboard menu all work. Same-origin links crawled successfully.
- The midnight drafting grid, cream evidence sheets, coral route markers, technical type, and original blueprint art follow `.factory/design.md` and are distinct from a generic SaaS template.

## Broader verification

- `npm test` passed: 18 unit tests, 50 browser tests, and four intentional single-project skips.
- `npm run build` produced `dist/`; site JavaScript is 5.33 kB raw / 2.15 kB gzip and the extension is 92.05 kB.
- `npm audit --omit=dev --audit-level=low` found zero production vulnerabilities.

## Missed leverage

No missing AI, import, export, or sync feature is implied strongly enough by the brief to require a finding. Markdown and JSON already provide the expected reproducible handoff. Sync would conflict with the local-first privacy boundary. No decorative AI feature, provider key, or direct model call was observed.

## What would make this perfect

Resolve F-5-1 by either removing/narrowing the untested offline availability promise or declaring and testing it from a fresh offline demo context. Then rerun the claim manifest and this complete first-read review. Nothing else remains.
