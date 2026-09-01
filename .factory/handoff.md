# Review 4 handoff — Focus Flow Map

- **Work order:** `focus-flow-map-review-4`
- **Candidate:** `63429d4867fd46acbefb8e3374e147a8848c5f1c`
- **Production:** <https://focus-flow-map.sociobot.in>
- **Result:** **FAIL** — one blocking live defect remains.

## What was done

- Completed the cold 390×844 and 1440×1000 first-read review.
- Audited every landing-page and README sentence plus headings, actions, labels, terminology, and runtime messages.
- Exercised the one-click demo, Reset, Start for real, storage isolation, same-origin request log, keyboard controls, and offline reload.
- Ran every command in `.factory/claims.json` independently from a clean clone.
- Rechecked all 20 findings from reviews 1–3 in production and source.
- Crawled routes and links; checked titles, metadata, one-h1/main structure, 404, Back/focus behavior, console output, axe, and visual identity.
- Made no product-code or deployment changes.

## Blocking issue

`F-4-1`: **Buy a Pro license on Sociobot (external)** points to a live endpoint that returns HTTP 404 with `{"error":"enabled factory product","status":404}`. Enable the product checkout or remove the paid action, then add a test that requires a successful checkout redirect.

## Verification

Clean clone: `/tmp/focus-flow-map-review4.JUQmL7`.

```bash
npm ci
# Run each command in .factory/claims.json separately
npm run typecheck
npm test
npm run build
npm audit --omit=dev --audit-level=low
unzip -t dist/site/downloads/focus-flow-map-chrome.zip
```

Results: 17/17 declared claim commands passed; typecheck passed; 17 unit and 50 browser tests passed with four intentional project skips; build produced `dist/`; production dependency audit found zero vulnerabilities; ZIP integrity passed. `/opt/fleet/lib/verify-url.sh` also passed home, demo, Privacy, Terms, and `/404.html`.

Full evidence and the concrete fix are in [.factory/review-4.md](review-4.md).
