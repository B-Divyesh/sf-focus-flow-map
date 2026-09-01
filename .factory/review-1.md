# First-read review 1 — Focus Flow Map

**Work order:** `focus-flow-map-review-1`  
**Reviewed:** 2026-09-01  
**Production:** <https://focus-flow-map.sociobot.in>  
**Demo:** <https://focus-flow-map.sociobot.in/?demo=1>  
**Verdict:** **FAIL** — six minor findings remain. No blocking finding was observed.

## First 30 seconds

Cold, fresh Chromium contexts at 390×844 and 1440×1000 both showed the same useful first screen before scrolling.

In my words:

- **What it does:** records the keyboard Tab route through a page and makes a report.
- **For whom:** keyboard-only and RSI-affected users.
- **What I should click first:** **Try it with sample data**; it says a completed route will open.

The screen answers all three questions. The exact supporting copy is **“Map where Tab goes.”**, **“For keyboard-only and RSI-affected users, it records the focus route and turns it into a report.”**, and **“Try it with sample data”**. This first-read check passes.

## Findings

### F-1-1 — Minor — route changes do not move focus to the new page heading

**Location / evidence:** From `/`, activate the footer **Privacy** link, then use Back. On the live site, `document.activeElement` is `BODY` after reaching `/privacy/` and again after returning to `/`; neither new `<h1>` has `tabindex` or receives focus.

**Why this matters:** A keyboard or screen-reader visitor receives no clear route-change focus point after navigation. The required route behavior is to move focus to the new `<h1>` and announce the change.

**Concrete fix:** Give each route `<h1 tabindex="-1">`; after a route change or restored history entry, focus it and update an `aria-live="polite"` announcement. Add a browser test that follows Privacy, uses Back, and checks focus and announcement on both pages.

### F-1-2 — Minor — route metadata is incomplete or stale outside the home route

**Location / evidence:**

- `/?demo=1` changes the document title and canonical URL, but retains the home Open Graph title, description, and image metadata.
- `/privacy/` and `/terms/` have title, description, canonical, favicon, and Apple icon, but no Open Graph or Twitter metadata.
- `/404.html` and a real unknown URL have title, description, and favicon, but no canonical URL, Apple icon, Open Graph metadata, or Twitter metadata.

**Why this matters:** Shared links and route previews do not consistently identify the page a visitor opened. This does not meet the required per-route metadata check.

**Concrete fix:** Add route-specific canonical, `og:title`, `og:description`, `og:image`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, favicon, and Apple touch icon metadata to legal and 404 pages. Update demo Open Graph/Twitter values when demo mode starts, or serve a dedicated `/demo` document. Add route metadata assertions for all routes.

### F-1-3 — Minor — the license-request privacy statement has no declared claim test

**Location / exact quote:** Landing privacy section: **“License verification sends only the license token to Sociobot.”** The same concept appears in the privacy policy.

**Why this matters:** This is a visitor-facing statement about a request outside the normal local report flow. `.factory/claims.json` has no entry for it. The current `demo-isolated` test skips verification, and the tagged claim tests do not observe a verification request.

**Concrete fix:** Add a `license-request-minimum-data` claim whose test uses an intercepted verification response, records the request method, URL, headers, and body, and confirms the documented request contains only the license token. List the landing and privacy-policy locations in `where`. If the statement cannot be tested, remove it.

### F-1-4 — Minor — three claim-like statements are not listed in `.factory/claims.json`

**Location / exact quotes:**

- Landing hero caption: **“Original generated illustration”**.
- Landing footer: **“Original hero image generated with the factory image model.”**
- README Architecture: **“No analytics, external runtime scripts, CDN fonts, or remote session storage.”**

**Why this matters:** Each is a factual statement a visitor can rely on, but none has an entry in the claims manifest. The existing same-origin demo request capture supports part of the README statement, but it is not registered for that claim and does not explicitly check static script/font origins.

**Concrete fix:** Either remove the two provenance statements from visitor copy, or add a locally verifiable provenance record and a matching claim test. Add a `no-third-party-runtime` claim that loads home and demo in a fresh context, records all request origins and resource types, and confirms the documented local runtime behavior. Include the README location.

### F-1-5 — Minor — README recording-detail promise is broader than its declared coverage

**Location / exact quote:** README, **What v1 does**: **“Captures focus order, direction, safe selectors, labels, viewport position, scroll changes, visibility, and computed focus indicators.”**

**Why this matters:** The closest manifest entry, `route-checks`, tests review-note kinds. Its tagged test does not assert that the recorded session contains every field named here. This is an unlisted, useful product statement rather than an observable declared claim.

**Concrete fix:** Add a `recorded-route-fields` claim and one tagged extension test that records a controlled route, then checks each named stored/exported field. Otherwise reduce the README sentence to only the fields the current declared test demonstrates.

### F-1-6 — Minor — two landing sentences use unexplained terms

**Location / exact quotes:**

- Workflow introduction: **“Automated rules list possible controls.”**
- Price sheet: **“Sociobot/Dodo is the merchant of record.”**

**Why this matters:** “Automated rules” does not say what the report will mark, and “merchant of record” is legal/payment jargon. A first-time visitor has to infer the result.

**Concrete rewrite:**

- Replace the first sentence with: **“The report marks steps that need a manual check.”**
- Replace the second sentence with: **“Sociobot/Dodo takes payment and handles refunds.”**

## Demo and sandbox behavior

The required demo path passes.

- The first-screen action opened `/?demo=1` in one click.
- The first demo screen immediately showed a realistic six-step checkout route, a 684-pixel viewport jump, and a missing focus-indicator note.
- The persistent **“Demo — sample data, nothing is saved”** banner, **Reset demo**, and **Start for real** controls were present.
- An instrumented fresh live context retained a real-license sentinel. While the banner was present, observed storage operations were only `get demo:focus-flow-map:state` and `set demo:focus-flow-map:state`.
- Reset restored the original route. Leaving demo removed the demo key and retained the sentinel.
- The full observed demo request log was same-origin: `https://focus-flow-map.sociobot.in`. No console or page error occurred.

## Claims check

After clean `npm ci`, every command from `.factory/claims.json` was run. All passed.

| Claim | Result | Observable check |
| --- | --- | --- |
| `demo-isolated` | Pass | Opens sample route; uses only demo storage; reset and exit work. |
| `keyboard-demo` | Pass | Tab and Enter operate Reset and review notes. |
| `chromium-package` | Pass | First-screen package download is a non-empty ZIP. |
| `explicit-recording` | Pass | No recorder or saved session before explicit start. |
| `local-session-privacy` | Pass | Recorded audit content remains local in the test flow. |
| `sensitive-redaction` | Pass | Encoded email, query, fragment, and input fixture stay out of saved/exported data. |
| `markdown-json-export` | Pass | Free Markdown and JSON reports download with the route. |
| `route-checks` | Pass | Jump, hidden, repeat, stall, and indicator checks are raised. |
| `history-limits` | Pass | Free retains one session; Pro fixture retains 30. |
| `pro-local-notes` | Pass | A note persists in extension-origin local storage. |
| `pro-price` | Pass | The price and checkout destination match the declared terms. |

The claims themselves pass. Findings F-1-3 through F-1-5 identify additional visitor-facing statements that need their own entries or narrower copy.

## Copy audit

Counts use whitespace-delimited words; hyphenated terms and code literals count as one word. Headings, navigation labels, buttons, and list labels were also checked: they are literal and result-naming, except for the jargon recorded in F-1-6. No audited prose sentence exceeds 22 words.

### Landing prose and instructional copy

| Words | Copy |
| ---: | --- |
| 4 | Map where Tab goes. |
| 16 | For keyboard-only and RSI-affected users, it records the focus route and turns it into a report. |
| 5 | A finished route opens now. |
| 9 | Download when you are ready to record a site. |
| 3 | Chromium extension package. |
| 3 | Original generated illustration. |
| 6 | Recording begins only when you choose. |
| 5 | Routes use local extension storage. |
| 5 | Download Markdown and JSON reports. |
| 6 | Record and share one keyboard route. |
| 5 | Automated rules list possible controls. |
| 9 | Focus Flow Map records the route you actually used. |
| 10 | Choose the extension on the page you want to inspect. |
| 8 | A visible recorder confirms that it is running. |
| 4 | Use Tab and Shift+Tab. |
| 10 | The route records safe labels, positions, direction, and focus styling. |
| 6 | It never records what you type. |
| 15 | Review numbered steps and checks for jumps, loops, stalls, hidden targets, and missing focus indicators. |
| 7 | Export the route as Markdown or JSON. |
| 6 | Replay the route step by step. |
| 14 | See a finished checkout route with a viewport jump and a missing focus indicator. |
| 10 | Use the review notes to understand what a maintainer receives. |
| 5 | The viewport moved 684 pixels. |
| 9 | Confirm that the delivery field remains easy to locate. |
| 8 | No computed outline was detected on Place order. |
| 6 | Check the control in the browser. |
| 5 | These notes support a review. |
| 5 | They do not certify accessibility. |
| 15 | Focus Flow Map removes query strings, hashes, sensitive path values, email addresses, and token-like text. |
| 5 | It never records input values. |
| 5 | Sessions stay in extension storage. |
| 7 | No focus session is sent to us. |
| 9 | License verification sends only the license token to Sociobot. |
| 10 | Free includes the latest focus map and both export formats. |
| 10 | Pro adds a 30-session local history and private audit notes. |
| 7 | Accessibility, safety, and report exports stay free. |
| 2 | One-time purchase. |
| 3 | 30-session local history. |
| 4 | Private notes per audit. |
| 5 | Use on your own devices. |
| 6 | Sociobot/Dodo is the merchant of record. |
| 4 | Refunds revoke the license. |
| 5 | Download and unzip the package. |
| 8 | Open chrome://extensions and turn on Developer mode. |
| 8 | Choose “Load unpacked” and select the unzipped folder. |
| 10 | Pin Focus Flow Map, open a website, and start recording. |
| 14 | The Chrome Web Store listing is planned; this direct package is the v1 distribution. |
| 8 | Record a focus route and share the report. |
| 4 | Built by Param Factory. |
| 9 | Original hero image generated with the factory image model. |

### README prose, bullets, and instructions

| Words | Copy |
| ---: | --- |
| 18 | Focus Flow Map is a Chromium extension for keyboard-only and RSI-affected users, auditors, and the teams supporting them. |
| 8 | It records a user-started Tab and Shift+Tab route. |
| 12 | The local report shows numbered steps, jumps, loops, and missing focus indicators. |
| 6 | Free exports include Markdown and JSON. |
| 16 | Choose Try it with sample data on the first screen, or open the sample link above. |
| 7 | A completed six-step checkout route appears immediately. |
| 5 | The banner identifies demo mode. |
| 15 | Reset demo restores the sample, and Start for real returns to the normal product page. |
| 12 | Demo state uses only demo:focus-flow-map: keys and is removed when you leave. |
| 10 | The demo does not read or change real license data. |
| 8 | See .factory/demo.md for the sample and isolation details. |
| 8 | Records only after the user chooses Start recording. |
| 16 | Captures focus order, direction, safe selectors, labels, viewport position, scroll changes, visibility, and computed focus indicators. |
| 17 | Flags large viewport jumps, off-screen targets, recent repeats, stalled Tab movement, and missing focus indicators for review. |
| 15 | Redacts queries, hashes, sensitive URL paths, URLs in labels, email addresses, identifiers, and token-like text. |
| 6 | Never reads or records input values. |
| 6 | Stores sessions in browser extension storage. |
| 8 | It sends no audit content to a server. |
| 12 | Exports a complete Markdown or JSON issue packet in the free tier. |
| 14 | Offers an optional $24 one-time Pro license for 30 local sessions and private notes. |
| 6 | Keeps accessibility, safety, and exports free. |
| 7 | The generated notes support an accessibility review. |
| 5 | They do not certify compliance. |
| 9 | Test with disabled users before making a compliance claim. |
| 5 | Requirements: Node.js 22+ and npm. |
| 20 | For the extension, open chrome://extensions, enable Developer mode, choose Load unpacked, and select .output/chrome-mv3 after WXT has built it. |
| 16 | npm test runs privacy and report tests, Chromium extension tests, 390 px tests, and axe checks. |
| 10 | Customer-facing claims and their exact commands are listed in .factory/claims.json. |
| 10 | Each command runs one tagged test against shipped sample data. |
| 9 | The exact production build command is npm run build. |
| 6 | It creates dist/site/index.html — static deployment root. |
| 7 | It creates dist/site/downloads/focus-flow-map-chrome.zip — installable Chromium MV3 package. |
| 7 | It creates .output/chrome-mv3/ — unpacked extension for development. |
| 10 | Preview the production site with npx vite preview --config vite.site.config.ts. |
| 12 | WXT and TypeScript for the MV3 worker, recorder, popup, and local report. |
| 13 | Vite and vanilla TypeScript for the static product, demo, privacy, and terms pages. |
| 7 | Extension storage for sessions and license state. |
| 7 | Extension-origin local storage keeps private report notes. |
| 8 | A separate demo:focus-flow-map: namespace for disposable sample state. |
| 9 | Sociobot billing API for hosted checkout and license verification. |
| 5 | No payment provider is embedded. |
| 11 | No analytics, external runtime scripts, CDN fonts, or remote session storage. |
| 11 | activeTab and site access observe focus only after an explicit start. |
| 11 | storage keeps focus maps and license state on the current device. |
| 10 | tabs identifies the active page and opens the local map. |
| 10 | See the product brief, visual thesis, privacy policy, and terms. |
| 1 | MIT. |
| 2 | See LICENSE. |

**Copy flags:** the two jargon sentences are recorded in F-1-6. All remaining listed prose stays at or below 22 words.

## History confirmation

No prior `.factory/review-*.md` or `.factory/polish-*.md` file exists. I read every earlier verification and handoff record. The earlier findings were checked on the live site and in the current code:

| Earlier finding | Current confirmation |
| --- | --- |
| Clean typecheck/test setup failed | Fixed: `prepare:wxt` precedes typecheck and test; `npm run check` passed. |
| Service-worker shell stayed stale | Fixed: the build replaces a revision marker and a unit test confirms revision replacement plus offline reload. |
| Deployed response policy was absent | Fixed: live home response includes CSP, no-referrer, nosniff, permissions policy, and expected cache policy. |
| Sensitive path values appeared in exports | Fixed: current redaction tests and the current extension claim test remove the encoded-email fixture from storage and both exports. |
| No claims manifest or one-click demo | Fixed: manifest exists; demo opens in one click with the expected banner and isolated key. |
| Unmeasured install-time promise | Fixed: no time promise appears on the landing page. |
| Targets below 44×44 px | Fixed: the current full Playwright suite checks rendered target sizes on site and extension surfaces. |
| Unpaid Copy license control appeared | Fixed: fresh live page keeps it hidden and unfocusable; the current test confirms this. |

None of those prior findings regressed. The findings in this review are new checks, not a reclassification of a prior item as fixed.

## Structure, accessibility, and visual check

- Internal product routes `/`, `/?demo=1`, `/privacy/`, `/terms/`, `/404.html`, `robots.txt`, `sitemap.xml`, and the extension ZIP returned the expected 200 response. An unknown product route returned the designed 404 with HTTP 404.
- Home, demo, privacy, terms, and 404 each have one `<h1>`, a `<main>`, `lang="en"`, title, description, and favicon. The metadata exceptions are F-1-2.
- The live product used no console/page errors in the mobile, desktop, or demo checks. The full local suite includes axe serious/critical checks, keyboard menu behavior, reduced motion, focus appearance, and target sizing.
- Header/footer coverage is consistent and includes Privacy and Terms. The product has a designed 404 and a visibly distinct blueprint-drafting identity; it does not read as a generic SaaS template.
- Same-origin links were checked. The repository also contains a GitHub source link and an external billing destination; this review did not request those external resources because the work order limits access to the product resource.

## Missed leverage

No additional feature is required by the researched brief. The product already provides the expected reusable handoff through Markdown and JSON export, and its focus mapping job does not require an AI step. No decorative AI feature or embedded provider key was observed.

## What would make this perfect

Complete F-1-1 through F-1-6: give route changes a reliable focus/announcement target, finish per-route metadata, register or narrow every visitor-facing factual statement, add coverage for the documented recording fields, and remove the remaining jargon. Then rerun this full first-read checklist from a fresh context.
