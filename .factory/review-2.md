# First-read review 2 — Focus Flow Map

**Work order:** `focus-flow-map-review-2`  
**Reviewed:** 2026-09-01  
**Candidate:** `1217c05037acaf13a95e809ce25827ae18ea2fa6`  
**Production:** <https://focus-flow-map.sociobot.in>  
**Demo:** <https://focus-flow-map.sociobot.in/?demo=1>  
**Verdict:** **FAIL** — one blocking finding and six minor findings remain.

## First 30 seconds

I opened the production site in fresh Chromium contexts at 390×844 and 1440×1000 without scrolling.

In my words:

- **What it does:** records where keyboard focus moves and makes a report.
- **For whom:** keyboard-only and RSI-affected users.
- **What I should click first:** **Try it with sample data**; the adjacent text says a finished route will open.

The cold first screen answers all three questions. The exact supporting text is **“Map where Tab goes.”**, **“For keyboard-only and RSI-affected users, it records the focus route and turns it into a report.”**, **“Try it with sample data”**, and **“A finished route opens now.”** No blocking first-read copy finding applies.

## Findings

### F-2-1 — BLOCKING — the phone demo does not show sample route data in its first viewport

**Location / exact text:** Production `/?demo=1` at 390×844. The first viewport contains **“Demo — sample data, nothing is saved”**, **“Review a sample keyboard route.”**, and introductory copy. The sample panel begins at y=708, but its first real route row, **“Skip to checkout”**, begins at y=966. The viewport ends at y=844.

**Why this fails first-time use:** After one click, a phone visitor sees another introduction instead of the product already being used. No numbered focus step or review note is visible without scrolling. This does not meet the required first-screen demo behavior, even though all six rows exist in the document. The current `@claim:demo-isolated` check counts rows but does not confirm that sample data is visible in the phone viewport.

**Concrete fix:** Compact the demo banner and heading on phones, then place the route panel directly beneath them. Confirm that at least one numbered route row is visible at 390×844 without scrolling. Add a 390 px check that clicks **Try it with sample data** and confirms the first route row intersects the viewport.

### F-2-2 — Minor — the three product facts are below the first phone viewport

**Location / exact text:** Production `/` at 390×844. The `.proof-strip` begins at y=974, below the 844 px viewport. Its three facts are **“Recording begins only when you choose.”**, **“Routes use local extension storage.”**, and **“Download Markdown and JSON reports.”**

**Why this matters:** The first screen gives the job, audience, and action, but phone visitors must scroll past the hero image to reach the required privacy, control, and price facts.

**Concrete fix:** Put a compact three-line fact list beside the primary action on phones, before the illustration. Add a 390×844 check that confirms all three fact lines intersect the first viewport.

### F-2-3 — Minor — four visitor-facing statements are not covered by a declared claim

**Location / exact text:** Landing pricing and installation sections:

- **“Use on your own devices.”**
- **“Sociobot/Dodo takes payment and handles refunds.”**
- **“A refund stops the Pro license.”**
- **“The Chrome Web Store listing is planned; this direct package is the v1 distribution.”**

**Why this matters:** The `pro-price` check confirms the $24 amount, one-time wording, and checkout destination. It does not confirm device entitlement, refund handling, license state after a refund, or the store-listing statement. A visitor can rely on each statement, but `.factory/claims.json` has no corresponding entry and observable check.

**Concrete fix:** Remove future-plan text that cannot be confirmed. For the license statements, either narrow the copy to the behavior already checked or add separate claim entries with fixture-backed checks for device terms, refund handling, and refunded-license state.

### F-2-4 — Minor — the sample heading promises replay controls that do not exist

**Location / exact quote:** Landing and demo sample heading: **“Replay the route step by step.”** The sample provides a static ordered list and one **Hide review notes** control. It provides no previous, next, play, or per-step selection control.

**Why this matters:** “Replay” names an interaction. A first-time visitor expects to move through the recorded route, but can only read it. The statement is also absent from `.factory/claims.json`.

**Concrete fix:** Rename the heading to **“Review a finished six-step route”**. If replay is intended, add previous and next step controls, visible step state, keyboard operation, and a declared claim check.

### F-2-5 — Minor — three phrases are vague or unnecessarily technical

**Location / exact text:**

- Landing pricing: **“Accessibility, safety, and report exports stay free.”**
- README, **What v1 does**: **“Keeps accessibility, safety, and exports free.”**
- README, **What v1 does**: **“Captures focus order, direction, safe selectors, labels, viewport position, scroll changes, visibility, and computed focus indicators.”**
- Sample review note: **“No computed outline was detected on Place order.”**

**Why this matters:** “Accessibility” and “safety” do not name the free features. “Safe selectors,” “viewport position,” and “computed focus indicators” require browser-development knowledge. The sample note should explain the observable result.

**Concrete rewrite:**

- Use **“Recording, redaction, and Markdown and JSON exports are free.”** in both pricing and README.
- Split the README sentence into **“Captures focus order, direction, labels, page position, scrolling, and visibility. It stores a redacted element locator and whether each control shows a focus outline.”**
- Use **“The browser detected no focus outline on Place order.”** in the sample note.

### F-2-6 — Minor — the missing-page heading uses a product metaphor

**Location / exact quote:** Production missing-page h1: **“This page is not on the route.”**

**Why this matters:** The heading relies on the product’s route metaphor instead of naming the page state directly. A heading read out of context should identify the section or result.

**Concrete rewrite:** Replace it with **“Page not found.”** Keep **“The address may be wrong or the page may have moved.”** as the explanation and retain the home link.

### F-2-7 — Minor — the phone menu button does not name its result

**Location / exact quote:** The 390 px header button is labeled **“Menu”** whether the menu is closed or open.

**Why this matters:** The label names an object rather than the result of pressing the control. A first-time keyboard or voice-control user receives less direct instruction than **Open menu** or **Close menu**.

**Concrete fix:** Change the visible label and accessible name to **“Open menu”** when collapsed and **“Close menu”** when expanded. Keep `aria-expanded`, Escape handling, and focus return. Add those label states to the existing phone-navigation check.

## Demo and sandbox check

- Confirmed that **Try it with sample data** reaches `/?demo=1` in one click.
- Confirmed that the persistent banner, **Reset demo**, and **Start for real** controls are present.
- Confirmed that six realistic checkout steps, a 684-pixel page movement, and a missing-focus-outline note load immediately in the document.
- Confirmed that Reset restores the original visible-notes state and announces **“Demo reset to the original six-step route.”**
- Confirmed in an instrumented fresh context that demo mode reads and writes only `demo:focus-flow-map:state`. A real-license sentinel remained unchanged.
- Confirmed that leaving demo mode removes the demo key and keeps the real sentinel.
- Confirmed that the live demo request log contains only `https://focus-flow-map.sociobot.in` requests. No unexpected console or page error appeared on home or demo.
- Confirmed that the live demo reloads with its six steps after the context is set offline.
- F-2-1 remains blocking because the first sample row is outside the initial 390×844 viewport.

## Claims check

I created a clean clone at `/tmp/focus-flow-map-review2.ofnuJO`, ran `npm ci`, and then ran every command exactly as listed in `.factory/claims.json`. All 15 commands passed.

| Claim | Result | Confirmed outcome |
| --- | --- | --- |
| `demo-isolated` | Pass | Demo uses its prefixed state, Reset works, leaving clears demo state, and the real license sentinel remains. |
| `keyboard-demo` | Pass | Tab and Enter operate Reset and the review-notes control. |
| `chromium-package` | Pass | The first-screen package URL returns a non-empty Chromium ZIP. |
| `explicit-recording` | Pass | No recording or session exists before the user starts. |
| `local-session-privacy` | Pass | Recorded focus-session content remains in extension storage in the checked flow. |
| `license-request-minimum-data` | Pass | The fixture-backed request is a GET with one license query value and no request body or token header. |
| `sensitive-redaction` | Pass | The fixture query, hash, encoded email, identifier, and input value stay out of storage and both exports. |
| `markdown-json-export` | Pass | Free Markdown and JSON downloads contain the recorded route. |
| `route-checks` | Pass | Jump, hidden-target, repeat, stall, and missing-indicator notes are produced from fixtures. |
| `recorded-route-fields` | Pass | Stored steps include every declared route field and use the checked redacted locator shape. |
| `history-limits` | Pass | Free retains one local session and the licensed fixture retains 30. |
| `pro-local-notes` | Pass | A private note is stored on the extension origin. |
| `pro-price` | Pass | The extension lists $24, one-time purchase wording, and the Sociobot checkout destination. |
| `original-image-provenance` | Pass | The prompt record, source image, derivative, date, and design disclosure are present. |
| `no-third-party-runtime` | Pass | Home and demo use local scripts and fonts, no frames, no data requests, and the separate demo namespace. |

The claim commands pass, but F-2-3 and F-2-4 identify statements outside the manifest. F-2-1 identifies missing viewport-level coverage in the current demo check.

The clean clone also passed `npm test` with 13 unit checks and 40 browser checks; four extension-only or single-project cases were intentionally skipped in the mobile project. `npm run build` completed and produced `dist/` plus the packaged extension.

## Copy audit

Counts use whitespace-delimited words. Hyphenated terms and code literals count as one word. No landing or README sentence exceeds 22 words. No marketing adjective from the supplied plain-words list appears. Flags refer to the findings above.

### Landing and demo sentences

| Words | Sentence | Flag |
| ---: | --- | --- |
| 4 | Map where Tab goes. | — |
| 16 | For keyboard-only and RSI-affected users, it records the focus route and turns it into a report. | — |
| 5 | A finished route opens now. | F-2-1 at 390 px |
| 9 | Download when you are ready to record a site. | — |
| 3 | Chromium extension package. | — |
| 6 | Original illustration generated for this product. | — |
| 6 | Recording begins only when you choose. | F-2-2 placement |
| 5 | Routes use local extension storage. | F-2-2 placement |
| 5 | Download Markdown and JSON reports. | F-2-2 placement |
| 6 | Record and share one keyboard route. | — |
| 9 | The report marks steps that need a manual check. | — |
| 9 | Focus Flow Map records the route you actually used. | — |
| 10 | Choose the extension on the page you want to inspect. | — |
| 8 | A visible recorder confirms that it is running. | — |
| 4 | Use Tab and Shift+Tab. | — |
| 10 | The route records safe labels, positions, direction, and focus styling. | — |
| 6 | It never records what you type. | — |
| 15 | Review numbered steps and checks for jumps, loops, stalls, hidden targets, and missing focus indicators. | — |
| 7 | Export the route as Markdown or JSON. | — |
| 6 | Replay the route step by step. | F-2-4 |
| 14 | See a finished checkout route with a viewport jump and a missing focus indicator. | — |
| 10 | Use the review notes to understand what a maintainer receives. | — |
| 5 | The viewport moved 684 pixels. | — |
| 9 | Confirm that the delivery field remains easy to locate. | — |
| 8 | No computed outline was detected on Place order. | F-2-5 |
| 6 | Check the control in the browser. | — |
| 5 | These notes support a review. | — |
| 5 | They do not certify accessibility. | — |
| 15 | Focus Flow Map removes query strings, hashes, sensitive path values, email addresses, and token-like text. | — |
| 5 | It never records input values. | — |
| 5 | Sessions stay in extension storage. | — |
| 7 | No focus session is sent to us. | — |
| 9 | License verification sends only the license token to Sociobot. | — |
| 10 | Free includes the latest focus map and both export formats. | — |
| 10 | Pro adds a 30-session local history and private audit notes. | — |
| 7 | Accessibility, safety, and report exports stay free. | F-2-5 |
| 2 | One-time purchase. | — |
| 3 | 30-session local history. | — |
| 4 | Private notes per audit. | — |
| 5 | Use on your own devices. | F-2-3 |
| 6 | Sociobot/Dodo takes payment and handles refunds. | F-2-3 |
| 6 | A refund stops the Pro license. | F-2-3 |
| 5 | Download and unzip the package. | — |
| 7 | Open chrome://extensions and turn on Developer mode. | — |
| 8 | Choose “Load unpacked” and select the unzipped folder. | — |
| 10 | Pin Focus Flow Map, open a website, and start recording. | — |
| 14 | The Chrome Web Store listing is planned; this direct package is the v1 distribution. | F-2-3 |
| 8 | Record a focus route and share the report. | — |
| 4 | Built by Param Factory. | — |
| 12 | The factory image model generated the original hero image for this product. | — |

### README sentences

| Words | Sentence | Flag |
| ---: | --- | --- |
| 18 | Focus Flow Map is a Chromium extension for keyboard-only and RSI-affected users, auditors, and the teams supporting them. | — |
| 8 | It records a user-started Tab and Shift+Tab route. | — |
| 12 | The local report shows numbered steps, jumps, loops, and missing focus indicators. | — |
| 6 | Free exports include Markdown and JSON. | — |
| 16 | Choose Try it with sample data on the first screen, or open the sample link above. | — |
| 7 | A completed six-step checkout route appears immediately. | F-2-1 at 390 px |
| 5 | The banner identifies demo mode. | — |
| 15 | Reset demo restores the sample, and Start for real returns to the normal product page. | — |
| 12 | Demo state uses only demo:focus-flow-map: keys and is removed when you leave. | — |
| 10 | The demo does not read or change real license data. | — |
| 8 | See .factory/demo.md for the sample and isolation details. | — |
| 8 | Records only after the user chooses Start recording. | — |
| 16 | Captures focus order, direction, safe selectors, labels, viewport position, scroll changes, visibility, and computed focus indicators. | F-2-5 |
| 17 | Flags large viewport jumps, off-screen targets, recent repeats, stalled Tab movement, and missing focus indicators for review. | — |
| 15 | Redacts queries, hashes, sensitive URL paths, URLs in labels, email addresses, identifiers, and token-like text. | — |
| 6 | Never reads or records input values. | — |
| 6 | Stores sessions in browser extension storage. | — |
| 8 | It sends no audit content to a server. | — |
| 11 | Exports a complete Markdown or JSON report in the free tier. | — |
| 14 | Offers an optional $24 one-time Pro license for 30 local sessions and private notes. | — |
| 6 | Keeps accessibility, safety, and exports free. | F-2-5 |
| 7 | The generated notes support an accessibility review. | — |
| 5 | They do not certify compliance. | — |
| 9 | Test with disabled users before making a compliance claim. | — |
| 5 | Requirements: Node.js 22+ and npm. | — |
| 19 | For the extension, open chrome://extensions, enable Developer mode, choose Load unpacked, and select .output/chrome-mv3 after WXT has built it. | — |
| 19 | npm test runs privacy and report tests, Chromium extension tests, 390 px tests, route metadata checks, and axe checks. | — |
| 10 | Customer-facing claims and their exact commands are listed in .factory/claims.json. | — |
| 10 | Each command runs one tagged test against shipped sample data. | — |
| 9 | The exact production build command is npm run build. | — |
| 7 | It creates dist/site/index.html — static deployment root. | — |
| 8 | It creates dist/site/downloads/focus-flow-map-chrome.zip — installable Chromium MV3 package. | — |
| 8 | It creates .output/chrome-mv3/ — unpacked extension for development. | — |
| 10 | Preview the production site with npx vite preview --config vite.site.config.ts. | — |
| 12 | WXT and TypeScript for the MV3 worker, recorder, popup, and local report. | — |
| 13 | Vite and vanilla TypeScript for the static product, demo, privacy, and terms pages. | — |
| 7 | Extension storage for sessions and license state. | — |
| 7 | Extension-origin local storage keeps private report notes. | — |
| 8 | A separate demo:focus-flow-map: namespace for disposable sample state. | — |
| 9 | Sociobot billing API for hosted checkout and license verification. | — |
| 5 | No payment provider is embedded. | — |
| 11 | No analytics, external runtime scripts, CDN fonts, or remote session storage. | — |
| 11 | activeTab and site access observe focus only after an explicit start. | — |
| 11 | storage keeps focus maps and license state on the current device. | — |
| 10 | tabs identifies the active page and opens the local map. | — |
| 10 | See the product brief, visual thesis, privacy policy, and terms. | — |
| 1 | MIT. | — |
| 2 | See LICENSE. | — |

### Headings and actions

| Words | Heading or action | Check |
| ---: | --- | --- |
| 4 | Keyboard focus route recorder | Clear label |
| 4 | Map where Tab goes | Clear home h1 |
| 5 | Try it with sample data | Result-naming action |
| 3 | Download for Chromium | Result-naming action |
| 4 | Starts on your command | Clear fact heading |
| 4 | Stays in the extension | Clear fact heading |
| 3 | Exports for free | Clear fact heading |
| 3 | How it works | Clear section heading |
| 6 | Record and share one keyboard route | Clear section heading |
| 2 | Start recording | Result-naming heading |
| 3 | Use Tab normally | Clear instruction heading |
| 3 | Export the report | Result-naming heading |
| 3 | Sample checkout route | Clear label |
| 6 | Replay the route step by step | F-2-4 |
| 3 | Hide review notes | Result-naming action |
| 3 | Show review notes | Result-naming action |
| 2 | Review notes | Clear heading |
| 4 | Step 4 needs review | Clear heading |
| 1 | Privacy | Clear section heading |
| 6 | Your focus route stays local | Clear section heading |
| 4 | Read the privacy policy | Result-naming link |
| 3 | Optional Pro license | Clear label |
| 4 | Keep more local routes | Clear section heading |
| 2 | Personal license | Clear label |
| 4 | Buy a Pro license | Result-naming action |
| 2 | Verify license | Result-naming action |
| 5 | Copy license for the extension | Result-naming action |
| 3 | Install the extension | Clear label |
| 4 | Load the unpacked extension | Clear instruction heading |
| 6 | Demo — sample data, nothing is saved | Clear banner |
| 2 | Reset demo | Result-naming action |
| 3 | Start for real | Required demo-exit action |
| 3 | Sample focus map | Clear label |
| 5 | Review a sample keyboard route | Clear demo h1 |
| 7 | This page is not on the route | F-2-6 |
| 4 | Return to Focus Flow Map | Result-naming link |
| 1 | Menu | F-2-7 |

## Earlier finding confirmation

I read `.factory/review-1.md`, `.factory/polish-1.md`, and the prior `.factory/handoff.md`. Each review-1 finding was checked again on production and in the current source.

| Earlier finding | Current confirmation |
| --- | --- |
| `F-1-1` route focus | Fixed. After page settle, home → Privacy focuses **Read how your focus data stays local.** Back focuses **Map where Tab goes.** Both updates appear in the polite live region. `site/public/route-focus.js` implements the behavior. |
| `F-1-2` route metadata | Fixed. Home, demo, Privacy, Terms, 404, and a real missing URL have route-specific title, description, canonical, Open Graph, Twitter, favicon, and Apple icon data. `site/main.ts` updates demo metadata. |
| `F-1-3` license-request statement | Fixed. `license-request-minimum-data` exists and its fixture-backed request check passed. |
| `F-1-4` provenance and runtime statements | Fixed. Both declared entries exist and their checks passed. The live cold request log was same-origin. |
| `F-1-5` recorded route fields | Fixed. `recorded-route-fields` exists and its extension check passed. |
| `F-1-6` unexplained terms | Fixed. The retired phrases are absent from current product copy. The replacements appear live. |

None of the six review-1 findings regressed. The seven findings in this review are separate checks.

## Structure, accessibility, and visual identity

- Confirmed route-specific titles, descriptions, canonical URLs, Open Graph data, Twitter data, favicon, Apple icon, `lang="en"`, one h1, and one main landmark on `/`, `/?demo=1`, `/privacy/`, `/terms/`, `/404.html`, and a real missing URL.
- Confirmed that the real missing URL returns HTTP 404 and the designed blueprint-style missing-page document. F-2-6 concerns only its heading copy.
- Confirmed that all same-origin links found on home return 200 and every in-page fragment has a target. The checkout and source destinations were inspected as link values only; this work order did not connect to resources outside the product boundary.
- Confirmed that route changes, Back, and initial loads focus and announce the new h1 after the route settles.
- Confirmed no serious or critical axe result on home, demo, Privacy, Terms, 404, or the live missing URL at 390 px.
- Confirmed no horizontal overflow in the checked 390 px demo, visible keyboard controls, at least 44 px interactive targets in the clean suite, and reduced-motion coverage.
- Confirmed that home and demo cold loads produced no unexpected console or page error. The expected document 404 is reported for a deliberately missing URL.
- Confirmed `robots.txt`, `sitemap.xml`, response policy headers, a response-header CSP, and same-origin runtime assets.
- Confirmed the visual identity is distinct: the midnight drafting grid, cream evidence sheets, coral focus marks, technical typography, original route illustration, and measured layout match `.factory/design.md`. It is not a generic centered-card site.

## Missed leverage

No additional AI step, account sync, or import flow is clearly required by the brief. The core job is local observation and a shareable Markdown or JSON report, and both export formats are present. No decorative AI control or embedded provider credential appears.

The word **“Replay”** creates an expectation beyond the implemented static sample; F-2-4 gives the concrete choice to rename it or add actual step controls.

## What would make this perfect

Place real sample route data inside the first 390×844 demo viewport and add viewport-level coverage. Move the three product facts into the first phone screen. Remove or cover every unlisted license and distribution statement. Replace the unsupported replay heading, clarify the vague and technical phrases, rename the missing-page h1 to **Page not found**, and give the phone menu a result-naming label. Then rerun every claim command and this complete first-read review from fresh contexts.
