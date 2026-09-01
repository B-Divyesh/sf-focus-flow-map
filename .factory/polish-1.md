# Polish round 1 — Focus Flow Map

- **Work order:** `focus-flow-map-polish-1`
- **Reviewed report:** `.factory/review-1.md` at `de707451b56a7ef35cb70498e927a483b52a2eec`
- **Repair commit:** `a38f0b6b4821032a95c22b59b495fc8b47714172`
- **Live URL:** <https://focus-flow-map.sociobot.in>
- **Result:** PASS — all six findings are resolved.

No earlier `.factory/review-*.md` or `.factory/polish-*.md` file exists besides review 1. Earlier verification reports were also checked for carry-forward defects; their clean-install, service-worker, redaction, claim, 404, touch-target, and hidden-license regressions remain covered by the passing suite.

## Finding map

| Finding | Change made | Automated evidence | Screenshot and live evidence |
| --- | --- | --- | --- |
| F-1-1 — route focus | Added `tabindex="-1"` to every route h1. The shared route script focuses it on page show and writes the new heading to a polite live region, including Back navigation. | `route changes move focus to the new h1 and announce it` passes on desktop and mobile. | `.factory/evidence/live-privacy/screenshot-desktop.png`; cold production navigation focused **Read how your focus data stays local.**, then Back focused **Map where Tab goes.** See `.factory/evidence/live-check.json`. |
| F-1-2 — route metadata | Added canonical, Apple icon, Open Graph, and Twitter metadata to privacy, terms, and 404. Demo mode now replaces its title, description, canonical, Open Graph URL/title/description, and Twitter title/description. | Five `has complete route-specific metadata` browser cases pass on desktop and mobile. | `.factory/evidence/live-demo/screenshot-desktop.png`, `.factory/evidence/live-privacy/screenshot-desktop.png`, and `.factory/evidence/live-404/screenshot-desktop.png`; the cold live metadata matrix is in `.factory/evidence/live-check.json`. |
| F-1-3 — license-request privacy claim | Added `license-request-minimum-data` to `.factory/claims.json`. Its intercepted real client flow records method, URL, headers, and body, then proves a GET with one `license` query value, no body, and no token header. | `@claim:license-request-minimum-data verification sends only the license token` passes from the clean clone. | `.factory/evidence/live-home/screenshot-desktop.png`; the statement is live at <https://focus-flow-map.sociobot.in/#privacy>. The production check did not send a license or contact billing. |
| F-1-4 — provenance and runtime claims | Added `original-image-provenance` and `no-third-party-runtime` claims. Provenance checks the dated model/prompt/review record, source, derivative, and design disclosure. Runtime capture checks home and demo request origins/types, local scripts/fonts, no frames or runtime data requests, and the Sociobot-only checkout link. | `@claim:original-image-provenance` and `@claim:no-third-party-runtime` pass from the clean clone. | `.factory/evidence/live-home/screenshot-desktop.png` and `.factory/evidence/live-demo/screenshot-desktop.png`; the cold demo made same-origin requests only, recorded in `.factory/evidence/live-check.json`. |
| F-1-5 — recorded route fields | Added `recorded-route-fields`. The extension test records a controlled route and checks order, timestamp, direction, element kind, label, safe selector, rectangle, viewport, scroll delta, visibility, and computed focus-indicator state on every stored step. | `@claim:recorded-route-fields extension records and exports a private local map` passes from the clean clone. | `.factory/evidence/live-demo/screenshot-desktop.png`; the live sample at <https://focus-flow-map.sociobot.in/?demo=1> shows all six ordered route steps and their visible route details. |
| F-1-6 — unexplained terms | Replaced “Automated rules” with “The report marks steps that need a manual check.” Replaced every current “merchant of record” phrase with “Sociobot/Dodo takes payment and handles refunds,” including landing, legal, and extension copy. Updated the copy audit. | `installation copy makes no unmeasured time promise`, all semantic route cases, and the complete suite pass; repository search finds neither retired phrase in current product sources. | `.factory/evidence/live-home/screenshot-desktop.png`; both replacements are live on <https://focus-flow-map.sociobot.in/>. |

## Required broader acceptance checks

- First screen retains the plain headline, named audience, adjacent outcome text, sample action, download action, and three facts. Mobile evidence: `.factory/evidence/live-home/screenshot-mobile.png`.
- The direct `?demo=1` path retains its six-step sample, persistent banner, Reset demo, Start for real, separate `demo:focus-flow-map:` state, and real-license isolation. Evidence: `@claim:demo-isolated` and `.factory/evidence/live-demo/screenshot-mobile.png`.
- A cold unknown production route returned HTTP 404 with the designed page. Evidence: `.factory/evidence/live-check.json`.
- Privacy and Terms links returned 200 and passed the structural checks. Evidence: `.factory/evidence/live-privacy/verify.json` and `.factory/evidence/live-terms/verify.json`.
- The catalog description is verb-first and 59 characters: `Map where Tab moves and export a local keyboard focus report.`

## Verification summary

- Fresh local clone: `npm ci` passed.
- Every one of the 15 commands in `.factory/claims.json` passed individually with fail-fast execution.
- Fresh local clone: `npm run check` passed TypeScript, 13 unit tests, 40 Playwright tests, 4 intentional single-project skips, and the production build.
- `npm audit --omit=dev --audit-level=low`: 0 vulnerabilities.
- `unzip -t dist/site/downloads/focus-flow-map-chrome.zip`: no errors.
- Local and live mobile Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO. Live FCP 1.1 s, LCP 1.2 s, TBT 0 ms, CLS 0. Reports: `.factory/evidence/lighthouse-local.json` and `.factory/evidence/lighthouse-live.json`.
- `/opt/fleet/lib/verify-url.sh` passed cold home, demo, privacy, terms, and 404 loads with no console errors. Evidence is under `.factory/evidence/live-*`.
- The deployed home document SHA-256 equals the local build: `15c0acfc235f5c014b9a3bd12180c47b79f3f1cb6e6605c3d910bcbe7cbae9f8`.

No finding of any severity remains open.
