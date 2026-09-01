# First-read review 3 — Focus Flow Map

- **Work order:** `focus-flow-map-review-3`
- **Reviewed:** 1 September 2026
- **Candidate:** `b8f7e23479e562eb9c33a87cebc4fd54508f0b87`
- **Production:** <https://focus-flow-map.sociobot.in>
- **Demo:** <https://focus-flow-map.sociobot.in/?demo=1>
**Verdict:** **FAIL** — seven minor findings remain. No blocking finding was confirmed.

## First 30 seconds

Fresh Chromium contexts at 390×844 and 1440×1000 opened the production home page without prior product context or scrolling.

In my own words:

- **What it does:** records where keyboard focus moves and turns that route into a report.
- **For whom:** keyboard-only and RSI-affected users, plus the people supporting them.
- **What to click first:** **Try it with sample data**; the next line says a finished route opens immediately.

The first screen answers all three questions. The exact text is **“Map where Tab goes.”**, **“For keyboard-only and RSI-affected users, it records the focus route and turns it into a report.”**, **“Try it with sample data”**, and **“A finished route opens now.”** At 390 px, the primary action appears at y=396 and all three product facts appear between y=633 and y=706. No blocking first-screen finding applies.

## Findings

### F-3-1 — Minor — external destinations are not identified as external

**Exact quote and location:** Home pricing link **“Buy a Pro license”**, home footer link **“Source”**, and Privacy link **“public issue tracker”** lead away from the product origin. None names the external destination or identifies it as external.

**Why a first-time visitor may be surprised:** The site-structure rule requires external links to say so. A visitor cannot tell before activation that these links leave Focus Flow Map.

**Concrete fix:** Use **“Buy a Pro license on Sociobot (external)”**, **“View source on GitHub (external)”**, and **“GitHub issue tracker (external)”**. If the visible wording must stay shorter, add the same destination text to each accessible name. Add a browser check that finds every cross-origin link and confirms its visible or accessible name identifies the destination.

### F-3-2 — Minor — the desktop header download action does not name its result

**Exact quote and location:** Desktop header: **“Download”**. The mobile menu already uses **“Download extension.”**

**Why a first-time visitor may hesitate:** “Download” is a verb without an object. The visitor must infer whether it downloads the extension, a report, or the sample.

**Concrete fix:** Change the desktop label to **“Download extension”** and use that wording in both navigation versions.

### F-3-3 — Minor — the hero uses an invented decorative route number

**Exact quote and location:** Hero illustration caption: **“ROUTE 014.”**

**Why a first-time visitor may be distracted:** The number is not connected to a saved route, sample, or action. It is decorative product lore and carries no usable information.

**Concrete fix:** Remove **“ROUTE 014”**, or replace it with the literal label **“Example focus route.”**

### F-3-4 — Minor — sample route labels use unexplained browser shorthand

**Exact quote and location:** Sample route rows use **“a · y 0 · TAB”**, **“button · y 0 · TAB”**, **“input · y 684 · TAB”**, and **“viewport +684 px.”** The nearby prose also says **“viewport jump.”**

**Why a first-time visitor may be lost:** The page does not explain the HTML tag `a`, the coordinate `y`, `px`, or “viewport.” Review 2 removed the same technical wording from the feature description, but it remains in the live sample.

**Concrete fix:** Use labels such as **“Link · page position 0 · Tab”**, **“Button · page position 0 · Tab”**, **“Text field · page position 684 · Tab”**, and **“Page moved down 684 pixels.”** Change **“viewport jump”** to **“page jump.”**

### F-3-5 — Minor — the same concepts use different terms

**Exact quote and location:** The home page uses **“focus route”**, **“keyboard route”**, and **“focus map”** for the recorded sequence or its view. The README changes **“review notes”** to **“generated notes.”** Examples include **“Review a sample keyboard route.”**, **“Record and share one keyboard route.”**, **“Free includes the latest focus map”**, and **“The generated notes support an accessibility review.”**

**Why a first-time visitor may hesitate:** The supplied terminology rule requires one word for one concept. These shifts make it unclear whether a route, map, and keyboard route are different saved objects, and whether generated notes differ from review notes.

**Concrete fix:** Use **“focus route”** for the recorded sequence, **“route report”** for the exported or displayed result, and **“review notes”** for the checks. Rewrite the examples as **“Review a sample focus route”**, **“Record and share one focus route”**, **“Free keeps your latest route report”**, and **“The review notes support an accessibility review.”** Add these terms to a copy test.

### F-3-6 — Minor — two license fallback messages use technical or unclear wording

**Exact quote and location:** Home license state in `site/main.ts`: **“License cached. Verification will retry when you are online.”** Clipboard fallback: **“Use your browser’s site storage or return email to retrieve the token.”**

**Why a first-time visitor may be lost:** “Cached,” “site storage,” and “return email” do not give a clear, familiar next step. Browser site storage is not a normal place for a visitor to retrieve a token.

**Concrete fix:** Use **“Your last verified license remains active. We’ll check it again when you are online.”** For the copy failure, use **“Copy the token from your purchase email and paste it into the extension.”**

### F-3-7 — Minor — the README uses unexplained development abbreviations

**Exact quote and location:** README: **“npm test runs privacy and report tests, Chromium extension tests, 390 px tests, route metadata checks, and axe checks.”**, **“installable Chromium MV3 package”**, and **“WXT and TypeScript for the MV3 worker, recorder, popup, and local report.”**

**Why a first-time reader may be lost:** “axe” and “MV3” are not introduced. They require prior knowledge even though plain alternatives are available.

**Concrete fix:** Use **“automated accessibility checks”** instead of **“axe checks.”** Expand the first occurrence to **“Manifest V3 (MV3)”** and use **“Manifest V3 extension”** in the architecture sentence.

## Demo and sandbox confirmation

- Confirmed the first-screen **Try it with sample data** action reaches `/?demo=1` in one click.
- Confirmed the first demo screen contains a realistic six-step checkout route, a 684-pixel page movement, and a missing-focus-outline review note.
- Confirmed the first route row, **“Skip to checkout,”** intersects the initial viewport at y=653 on 390×844 and y=799 on 1440×1000.
- Confirmed the persistent **“Demo — sample data, nothing is saved”** banner, **Reset demo**, and **Start for real** controls are present.
- Confirmed Reset restores visible review notes and announces **“Demo reset to the original six-step route.”**
- Confirmed demo state uses `demo:focus-flow-map:state`. A real-license sentinel remained unchanged, and Start for real removed only the demo key.
- Confirmed the fresh live home and demo request log contains only `https://focus-flow-map.sociobot.in` requests. No console or page error appeared on those routes.
- Confirmed the complete local suite reloads the demo offline with all six route rows.

The demo requirement passes. No blocking demo or storage-isolation finding applies.

## Claims confirmation

A clean clone at `/tmp/focus-flow-map-review3.GT9QV9` was prepared with `npm ci`. Every command in `.factory/claims.json` was run separately and passed.

| Claim | Result | Confirmed outcome |
| --- | --- | --- |
| `demo-isolated` | Pass | The demo uses its prefixed state, Reset restores the sample, Start for real clears demo state, and real license state remains unchanged. |
| `keyboard-demo` | Pass | Tab and Enter operate the sample report and demo controls. |
| `mobile-first-view` | Pass | All three facts and the first sample route row intersect the 390×844 first viewport. |
| `chromium-package` | Pass | The first-screen package URL returns a non-empty Chromium ZIP. |
| `explicit-recording` | Pass | No recorder or saved session exists before the user starts. |
| `local-session-privacy` | Pass | Recorded focus-session content stays in extension storage in the checked flow. |
| `license-request-minimum-data` | Pass | The fixture-backed request is a GET with one license query value and no request body or token header. |
| `refund-revokes-pro` | Pass | A refunded fixture license disables Pro while free product access remains. |
| `sensitive-redaction` | Pass | The checked query, hash, encoded email, identifier, and input value stay out of storage and both exports. |
| `markdown-json-export` | Pass | Free Markdown and JSON downloads contain the recorded route. |
| `route-checks` | Pass | Page movement, hidden-target, repeat, stall, and missing-indicator notes are produced from fixtures. |
| `recorded-route-fields` | Pass | Stored steps include every declared route field and the checked redacted locator shape. |
| `history-limits` | Pass | Free retains one local session and the licensed fixture retains 30. |
| `pro-local-notes` | Pass | A private note is stored on the extension origin. |
| `pro-price` | Pass | The extension states $24, one-time purchase wording, and the Sociobot checkout destination. |
| `original-image-provenance` | Pass | The prompt record, source image, derivative, date, and design disclosure are present. |
| `no-third-party-runtime` | Pass | Home and demo use local scripts and fonts, no frames, no remote session storage, and a separate demo namespace. |

The live landing page and README were cross-checked against the manifest. Every visitor-facing product claim has a matching entry. No failing or untested product claim was confirmed.

## Copy audit

Counts use whitespace-delimited words. Hyphenated terms and code literals count as one word. No sentence exceeds 22 words, and no supplied marketing adjective appears. Findings are identified in the last column.

### Landing-page sentences, including interactive states

| Words | Sentence | Result |
| ---: | --- | --- |
| 4 | Map where Tab goes. | Pass |
| 16 | For keyboard-only and RSI-affected users, it records the focus route and turns it into a report. | Pass |
| 5 | A finished route opens now. | Pass |
| 9 | Download when you are ready to record a site. | Pass |
| 6 | Recording begins only when you choose. | Pass |
| 5 | Routes use local extension storage. | Pass |
| 5 | Download Markdown and JSON reports. | Pass |
| 14 | See a finished checkout route with a viewport jump and a missing focus indicator. | F-3-4 |
| 10 | Use the review notes to understand what a maintainer receives. | Pass |
| 9 | The report marks steps that need a manual check. | Pass |
| 9 | Focus Flow Map records the route you actually used. | Pass |
| 10 | Choose the extension on the page you want to inspect. | Pass |
| 8 | A visible recorder confirms that it is running. | Pass |
| 4 | Use Tab and Shift+Tab. | Pass |
| 12 | The route records redacted labels, page position, direction, and visible focus styles. | Pass |
| 6 | It never records what you type. | Pass |
| 15 | Review numbered steps and checks for jumps, loops, stalls, hidden targets, and missing focus indicators. | Pass |
| 7 | Export the route as Markdown or JSON. | Pass |
| 5 | The viewport moved 684 pixels. | F-3-4 |
| 9 | Confirm that the delivery field remains easy to locate. | Pass |
| 9 | The browser detected no focus outline on Place order. | Pass |
| 6 | Check the control in the browser. | Pass |
| 5 | These notes support a review. | Pass |
| 5 | They do not certify accessibility. | Pass |
| 15 | Focus Flow Map removes query strings, hashes, sensitive path values, email addresses, and token-like text. | Pass |
| 5 | It never records input values. | Pass |
| 5 | Sessions stay in extension storage. | Pass |
| 7 | No focus session is sent to us. | Pass |
| 9 | License verification sends only the license token to Sociobot. | Pass |
| 10 | Free includes the latest focus map and both export formats. | F-3-5 |
| 10 | Pro adds a 30-session local history and private audit notes. | Pass |
| 9 | Recording, redaction, and Markdown and JSON exports are free. | Pass |
| 5 | A refund stops Pro features. | Pass |
| 5 | Download and unzip the package. | Pass |
| 7 | Open chrome://extensions and turn on Developer mode. | Pass |
| 8 | Choose “Load unpacked” and select the unzipped folder. | Pass |
| 10 | Pin Focus Flow Map, open a website, and start recording. | Pass |
| 8 | Record a focus route and share the report. | Pass |
| 4 | Built by Param Factory. | Pass |
| 12 | The factory image model generated the original hero image for this product. | Pass |
| 7 | Demo reset to the original six-step route. | Pass |
| 2 | License active. | Pass |
| 9 | Copy it into the extension to unlock local Pro. | Pass |
| 4 | License no longer active. | Pass |
| 2 | License cached. | F-3-6 |
| 7 | Verification will retry when you are online. | F-3-6 |
| 1 | Offline. | Pass |
| 6 | Free tools and downloads remain available. | Pass |
| 2 | Verifying license… | Pass |
| 3 | Could not verify. | Pass |
| 6 | Check your connection and try again. | Pass |
| 2 | License copied. | Pass |
| 8 | Paste it under Restore in the extension map. | Pass |
| 3 | Copy was blocked. | Pass |
| 12 | Use your browser’s site storage or return email to retrieve the token. | F-3-6 |

### README sentences and instructional statements

| Words | Sentence | Result |
| ---: | --- | --- |
| 18 | Focus Flow Map is a Chromium extension for keyboard-only and RSI-affected users, auditors, and the teams supporting them. | Pass |
| 8 | It records a user-started Tab and Shift+Tab route. | Pass |
| 12 | The local report shows numbered steps, jumps, loops, and missing focus indicators. | Pass |
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
| 17 | Flags large viewport jumps, off-screen targets, recent repeats, stalled Tab movement, and missing focus indicators for review. | F-3-4 |
| 15 | Redacts queries, hashes, sensitive URL paths, URLs in labels, email addresses, identifiers, and token-like text. | Pass |
| 6 | Never reads or records input values. | Pass |
| 6 | Stores sessions in browser extension storage. | Pass |
| 8 | It sends no audit content to a server. | Pass |
| 11 | Exports a complete Markdown or JSON report in the free tier. | Pass |
| 14 | Offers an optional $24 one-time Pro license for 30 local sessions and private notes. | Pass |
| 9 | Keeps recording, redaction, and Markdown and JSON exports free. | Pass |
| 7 | The generated notes support an accessibility review. | F-3-5 |
| 5 | They do not certify compliance. | Pass |
| 9 | Test with disabled users before making a compliance claim. | Pass |
| 5 | Requirements: Node.js 22+ and npm. | Pass |
| 19 | For the extension, open chrome://extensions, enable Developer mode, choose Load unpacked, and select .output/chrome-mv3 after WXT has built it. | Pass |
| 19 | npm test runs privacy and report tests, Chromium extension tests, 390 px tests, route metadata checks, and axe checks. | F-3-7 |
| 10 | Customer-facing claims and their exact commands are listed in .factory/claims.json. | Pass |
| 10 | Each command runs one tagged test against shipped sample data. | Pass |
| 9 | The exact production build command is npm run build. | Pass |
| 7 | It creates dist/site/index.html — static deployment root. | Pass |
| 8 | It creates dist/site/downloads/focus-flow-map-chrome.zip — installable Chromium MV3 package. | F-3-7 |
| 8 | It creates .output/chrome-mv3/ — unpacked extension for development. | Pass |
| 10 | Preview the production site with npx vite preview --config vite.site.config.ts. | Pass |
| 12 | WXT and TypeScript for the MV3 worker, recorder, popup, and local report. | F-3-7 |
| 13 | Vite and vanilla TypeScript for the static product, demo, privacy, and terms pages. | Pass |
| 7 | Extension storage for sessions and license state. | Pass |
| 7 | Extension-origin local storage keeps private report notes. | Pass |
| 8 | A separate demo:focus-flow-map: namespace for disposable sample state. | Pass |
| 9 | Sociobot billing API for hosted checkout and license verification. | Pass |
| 5 | No payment provider is embedded. | Pass |
| 11 | No analytics, external runtime scripts, CDN fonts, or remote session storage. | Pass |
| 9 | The no-third-party-runtime claim test checks both home and demo. | Pass |
| 11 | activeTab and site access observe focus only after an explicit start. | Pass |
| 11 | storage keeps focus maps and license state on the current device. | Pass |
| 10 | tabs identifies the active page and opens the local map. | Pass |
| 10 | See the product brief, visual thesis, privacy policy, and terms. | Pass |
| 1 | MIT. | Pass |
| 2 | See LICENSE. | Pass |

### Headings, actions, and labels

| Words | Copy | Result |
| ---: | --- | --- |
| 3 | Focus Flow Map | Clear wordmark |
| 1 | Demo | Clear navigation destination |
| 3 | How it works | Clear navigation and section heading |
| 1 | Privacy | Clear navigation and section heading |
| 1 | Download | F-3-2 |
| 2 | Open menu / Close menu | Clear result-naming states |
| 4 | Keyboard focus route recorder | Clear product label |
| 5 | Try it with sample data | Clear result-naming action |
| 3 | Download for Chromium | Clear first-screen action |
| 3 | Chromium extension package | Clear format label |
| 2 | ROUTE 014 | F-3-3 |
| 6 | Original illustration generated for this product | Clear provenance label |
| 4 | Starts on your command | Clear fact heading |
| 4 | Stays in the extension | Clear fact heading |
| 3 | Exports for free | Clear fact heading |
| 6 | Record and share one keyboard route | F-3-5 |
| 2 | Start recording | Clear result-naming heading |
| 3 | Use Tab normally | Clear instruction heading |
| 3 | Export the report | Clear result-naming heading |
| 3 | Sample checkout route | Clear sample label |
| 6 | Review a finished six-step route | Clear heading |
| 3 | Hide review notes / Show review notes | Clear result-naming states |
| 2 | Review notes | Clear heading |
| 5 | Step 4 needs review | Clear heading |
| 5 | Your focus route stays local | Clear heading |
| 4 | Read the privacy policy | Clear result-naming link |
| 3 | Optional Pro license | Clear label |
| 4 | Keep more local routes | Clear heading |
| 2 | Personal license | Clear label |
| 4 | Buy a Pro license | F-3-1 external destination |
| 2 | Already purchased | Clear disclosure label |
| 4 | Paste your license token | Clear form label |
| 2 | Verify license | Clear result-naming action |
| 5 | Copy license for the extension | Clear result-naming action |
| 3 | Install the extension | Clear section label |
| 4 | Load the unpacked extension | Clear instruction heading |
| 6 | Demo — sample data, nothing is saved | Clear persistent banner |
| 2 | Reset demo | Clear result-naming action |
| 3 | Start for real | Clear demo-exit action |
| 3 | Sample focus map | F-3-5 |
| 5 | Review a sample keyboard route | F-3-5 |
| 3 | Skip to checkout | Clear sample control label |
| 4 | Change basket quantity | Clear sample control label |
| 4 | Apply discount code | Clear sample control label |
| 2 | Delivery address | Clear sample control label |
| 2 | Place order | Clear sample control label |
| 2 | Review basket | Clear sample control label |
| 6 | a · y 0 · TAB | F-3-4 |
| 6 | button · y 0 · TAB | F-3-4 |
| 6 | input · y 684 · TAB | F-3-4 |
| 3 | viewport +684 px | F-3-4 |
| 3 | View source on GitHub | Proposed F-3-1 replacement for “Source” |

README headings are **Focus Flow Map** (3), **Try the isolated demo** (4), **What v1 does** (3), **Run locally** (2), **Test and build** (3), **Architecture** (1), **Permissions** (1), and **License** (1). Each names its section directly.

## Earlier finding confirmation

Every existing `.factory/review-*.md`, `.factory/polish-*.md`, and `.factory/handoff.md` was read. Each earlier finding was checked against production and the current source.

| Earlier finding | Live and code confirmation |
| --- | --- |
| `F-1-1` route focus | Confirmed home initially focuses **Map where Tab goes.** Home → Privacy focuses **Read how your focus data stays local.** Back focuses the home h1. The polite region announces each heading. `site/public/route-focus.js` supplies this behavior. |
| `F-1-2` route metadata | Confirmed distinct title, description, canonical, Open Graph, Twitter, favicon, and touch icon data on home, demo, Privacy, Terms, 404, and a real missing URL. |
| `F-1-3` license-request statement | Confirmed `license-request-minimum-data` remains declared and its exact command passes. |
| `F-1-4` provenance/runtime statements | Confirmed both entries remain declared and pass. The cold live home/demo request log is same-origin. |
| `F-1-5` recorded route fields | Confirmed `recorded-route-fields` remains declared and its extension check passes. |
| `F-1-6` unexplained terms | Confirmed the former “Automated rules” and “merchant of record” phrases remain absent. The replacement report and refund wording is live. |
| `F-2-1` phone demo route placement | Confirmed the first sample row begins at y=653 and intersects the 390×844 viewport. `mobile-first-view` passes. |
| `F-2-2` phone fact placement | Confirmed all three facts appear between y=633 and y=706 in the first 390×844 viewport. |
| `F-2-3` undeclared license/distribution statements | Confirmed the device-use, payment-handler, and future-store statements remain absent. `refund-revokes-pro` covers the live refund statement and passes. |
| `F-2-4` unsupported replay wording | Confirmed **“Review a finished six-step route”** is live and the former replay wording is absent. |
| `F-2-5` vague or technical feature copy | Confirmed the revised free-feature, recorded-field, and missing-outline sentences remain live. F-3-4 concerns separate shorthand still present inside the sample rows. |
| `F-2-6` missing-page metaphor | Confirmed a real missing URL returns HTTP 404 with h1 **“Page not found.”** |
| `F-2-7` menu result label | Confirmed the 390 px button changes between **Open menu** and **Close menu**, works with Enter and Escape, and returns focus after Escape. |

No earlier finding is blocking again. The seven current findings concern copy and link labeling that the earlier reports did not list.

## Structure, accessibility, and visual identity

- Confirmed `/`, `/?demo=1`, `/privacy/`, `/terms/`, `/404.html`, and a real missing URL have `lang="en"`, one h1, one main landmark, route-specific titles and descriptions, canonical data, Open Graph/Twitter data, favicon, and Apple touch icon.
- Confirmed the real missing URL returns HTTP 404 and the designed **Page not found** document. The direct `/404.html` document returns 200 as expected.
- Confirmed every same-origin link and download returns 200; every same-page fragment resolves to an element. The three external destinations were checked as link values only because they are outside the product origin. F-3-1 covers their labels.
- Confirmed the header and footer contain the required home, Demo, Privacy, Terms, product description, Param Factory credit, and version information where required.
- Confirmed route entry, Privacy navigation, and Back move focus to and announce the current h1.
- Confirmed zero horizontal overflow and no serious or critical axe result on all six checked routes at 390×844 and 1440×1000.
- Confirmed the worker URL checker passes home, demo, Privacy, Terms, and the direct 404 document with no console errors.
- Confirmed the response policy is delivered through headers and the current CSP matches the observed same-origin runtime plus the named Sociobot verification destination.
- Confirmed the visual identity is distinct: midnight drafting grid, cream report sheets, coral focus marks, technical type, ruled route stations, and original blueprint art match `.factory/design.md`. It does not resemble a generic centered-card template.

## Broader quality confirmation

- `npm test`: pass — 13 unit checks and 44 browser checks passed; four intentional mobile-project cases were skipped.
- `npm run build`: pass — `dist/site/` and the 91.76 kB extension build were produced. Initial site JavaScript is 5.32 kB raw and 2.16 kB gzip.
- The live home and demo produced no console or page errors in fresh mobile and desktop contexts.
- The deliberate missing document returned its expected HTTP 404; the browser reported only that expected document status.
- No product code or deployment state was changed during this review.

## Missed leverage

No missing AI, import, export, or sync feature is implied strongly enough to require a finding. The core job is local observation and a shareable report; Markdown and JSON export already provide the expected handoff. Account sync would weaken the local-first boundary. No decorative AI feature or embedded provider credential was confirmed.

## What would make this perfect

Resolve F-3-1 through F-3-7: identify every external destination, name the header download result, remove the decorative route number, replace browser shorthand with plain route labels, standardize route/report/note terms, rewrite the two license fallback messages, and expand the README abbreviations. Add focused copy and external-link checks, then rerun all 17 claim commands and the full first-read checklist. The owner’s zero-finding standard is not met until those changes are live.
