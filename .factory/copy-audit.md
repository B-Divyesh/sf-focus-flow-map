# Landing-page copy audit

Audited 1 September 2026 for polish round 3. This inventory covers every visitor-facing sentence, status, heading, action, fact, and sample label in `site/index.html` and its runtime states in `site/main.ts`. Counts treat hyphenated terms, product names, and key names as one word. No sentence exceeds 22 words and no banned marketing term appears.

## First screen and facts

| Copy | Words | Result |
| --- | ---: | --- |
| Map where Tab goes. | 4 | Pass |
| For keyboard-only and RSI-affected users, it records a focus route and turns it into a route report. | 18 | Pass |
| Demo / How it works / Privacy / Download extension | 7 | Literal navigation labels |
| Open menu / Close menu | 4 | Literal menu states |
| Try it with sample data | 5 | Pass |
| Download for Chromium | 3 | Pass |
| A finished route report opens now. | 6 | Pass |
| Download when you are ready to record a site. | 9 | Pass |
| Recording begins only when you choose. | 6 | Pass |
| Route reports use local extension storage. | 6 | Pass |
| Download Markdown and JSON route reports. | 6 | Pass |
| Example focus route | 3 | Plain illustration label |
| Original illustration generated for this product | 6 | Provenance label |

## Workflow, sample, and privacy

| Copy | Words | Result |
| --- | ---: | --- |
| Record one focus route and share its route report. | 9 | Pass |
| The route report marks steps that need a manual check. | 10 | Pass |
| Focus Flow Map records the focus route you actually used. | 10 | Pass |
| Choose the extension on the page you want to inspect. | 10 | Pass |
| A visible recorder confirms that it is running. | 8 | Pass |
| Use Tab and Shift+Tab. | 4 | Pass |
| The focus route records redacted labels, page position, direction, and visible focus styles. | 13 | Pass |
| It never records what you type. | 6 | Pass |
| Review numbered steps and checks for jumps, loops, stalls, hidden targets, and missing focus indicators. | 15 | Pass |
| Export the route report as Markdown or JSON. | 8 | Pass |
| Review a six-step route report | 6 | Plain section heading |
| Start recording / Use Tab normally / Export the route report | 11 | Literal workflow headings |
| See a finished focus route through a checkout with a page jump and a missing focus indicator. | 17 | Pass |
| Use the review notes to understand what a maintainer receives. | 10 | Pass |
| Link · page position 0 · Tab | 5 | Plain sample label |
| Button · page position 0 · Tab | 5 | Plain sample label |
| Text field · page position 684 · Tab | 6 | Plain sample label |
| Page moved down 684 pixels | 5 | Plain sample label |
| Link · page position 0 · Shift + Tab | 7 | Plain sample label |
| The page moved down 684 pixels. | 6 | Pass |
| Confirm that the delivery field remains easy to locate. | 9 | Pass |
| The browser detected no focus outline on Place order. | 9 | Pass |
| Check the control in the browser. | 6 | Pass |
| These review notes support a review. | 6 | Pass |
| They do not certify accessibility. | 5 | Pass |
| Focus Flow Map removes query strings, hashes, sensitive path values, email addresses, and token-like text. | 16 | Pass |
| It never records input values. | 5 | Pass |
| Route reports stay in extension storage. | 6 | Pass |
| No focus route is sent to us. | 7 | Pass |
| License verification sends only the license token to Sociobot. | 9 | Declared claim |

## License, installation, footer, and runtime states

| Copy | Words | Result |
| --- | ---: | --- |
| Free keeps your latest route report and both export formats. | 10 | Pass |
| Keep more local route reports. | 5 | Plain price heading |
| Pro adds a 30-session local history and private audit notes. | 10 | Pass |
| Recording, redaction, and Markdown and JSON exports are free. | 9 | Pass |
| Buy a Pro license on Sociobot (external) | 7 | Named external destination |
| A refund stops Pro features. | 5 | Declared claim |
| Download and unzip the package. | 5 | Pass |
| Open chrome://extensions and turn on Developer mode. | 7 | Pass |
| Choose “Load unpacked” and select the unzipped folder. | 8 | Pass |
| Pin Focus Flow Map, open a website, and start recording. | 10 | Pass |
| Record a focus route and share its route report. | 9 | Pass |
| View source on GitHub (external) | 6 | Named external destination |
| Demo — sample data, nothing is saved | 6 | Persistent demo banner |
| Demo reset to the original six-step focus route. | 9 | Reset status |
| License active. Copy it into the extension to unlock local Pro. | 11 | Pass |
| License no longer active. | 4 | Pass |
| Your last verified license remains active. We’ll check it again when you are online. | 14 | Plain fallback |
| Offline. Free tools and downloads remain available. | 7 | Pass |
| Could not verify. Check your connection and try again. | 9 | Pass |
| License copied. Paste it into the extension to use local Pro. | 11 | Pass |
| Copy was blocked. Copy the token from your purchase email and paste it into the extension. | 16 | Plain fallback |

## Terminology table

| Concept | One term used |
| --- | --- |
| Recorded keyboard sequence | focus route |
| On-screen or exported result | route report |
| Checks needing human inspection | review notes |
| Large document movement | page jump / page movement |
| Product download | extension |

## Checks

- `tests/unit/copy.test.ts` rejects retired sample shorthand, invented route lore, inconsistent route terms, technical license fallback copy, unnamed external destinations, and unexplained README abbreviations.
- `tests/e2e/site.spec.ts` checks the rendered desktop/mobile navigation labels, all rendered external site links, plain sample labels, and both license fallback states.
