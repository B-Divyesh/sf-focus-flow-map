# Repair handoff — Focus Flow Map

- **Work order:** `focus-flow-map-polish-1`
- **Base:** `de707451b56a7ef35cb70498e927a483b52a2eec`
- **Repair:** `a38f0b6b4821032a95c22b59b495fc8b47714172`
- **Deployment:** Azure Static Web App `sf-focus-flow-map`, deployment `211c4028-75d5-4649-aae2-73be739bfd20`
- **Live:** <https://focus-flow-map.sociobot.in>
- **Result:** PASS

## Delivered

- Route changes and history restoration focus the new h1 and announce it politely.
- Home, demo, privacy, terms, 404, and unknown-route behavior have complete route-specific metadata and real URLs.
- Four missing public claims now have manifest entries and exact tests: minimum license-request data, image provenance, no third-party runtime, and every recorded route field.
- Landing, legal, and extension payment copy now explains who takes payment and handles refunds. The report copy explains manual checks without the previous jargon.
- The isolated one-click demo, mobile layout, local storage boundaries, legal links, designed 404, blueprint visual system, and extension download remain intact.
- `.factory/catalog-description.txt`, `.factory/copy-audit.md`, `.factory/claims.json`, and `.factory/polish-1.md` reflect the released product.

## Verification

From a fresh clone after `npm ci`:

- All 15 claim commands passed separately.
- `npm run check`: typecheck passed; 13 unit tests passed; 40 browser tests passed; 4 intentional cross-project skips; production build passed.
- `npm audit --omit=dev --audit-level=low`: 0 vulnerabilities.
- Extension ZIP integrity passed.

Production verification after deployment:

- `verify-url.sh` passed `/`, `/?demo=1`, `/privacy/`, `/terms/`, and `/404.html` with zero console errors.
- Cold route navigation focused and announced the Privacy h1; Back focused and announced the home h1.
- Demo, legal, and 404 metadata were complete. An unknown URL returned the designed page with HTTP 404.
- Cold demo showed six steps, made same-origin requests only, preserved a real-license sentinel, cleared its demo key on exit, and returned home.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.2 s, TBT 0 ms, CLS 0.
- The live and local home HTML SHA-256 values match: `15c0acfc235f5c014b9a3bd12180c47b79f3f1cb6e6605c3d910bcbe7cbae9f8`.

Run locally with `npm ci && npm run check`. Build with `npm run build`; deployable files are in `dist/site`.

## Known gaps and next steps

No acceptance gap remains. The Chrome Web Store listing is still planned and is accurately described as future distribution work.
