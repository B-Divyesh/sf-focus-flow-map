# Independent verification 6 handoff — Focus Flow Map

- **Work order:** `focus-flow-map-verify-6`
- **Candidate:** `e8901c9fbf406cb62d8472b4573bcf56651cc53d`
- **Live URL:** <https://focus-flow-map.sociobot.in>
- **Demo URL:** <https://focus-flow-map.sociobot.in/?demo=1>
- **Result:** **PASS**

## What was confirmed

- Confirmed that the cold first screen states what the product does, names keyboard-only and RSI-affected users, and offers one-click sample data with the result explained.
- Confirmed that all 15 exact commands in `.factory/claims.json` pass.
- Confirmed that `npm ci`, `npm run typecheck`, `npm test`, `npm run build`, ZIP integrity, and the production dependency check pass. The full suite has 13 passing unit checks and 40 passing browser checks, with four intentional mobile-project omissions for extension-only cases.
- Confirmed the real extension flow in a new Chromium profile: explicit start, zero-step boundary, forward/reverse route recording, safe local storage, Markdown/JSON export, invalid input, inactive/interrupted/active license recovery with locally handled responses, and cancel/confirm deletion.
- Confirmed desktop and 390 px behavior, keyboard-only controls, designed focus, 200% text, reduced motion, no serious/critical axe finding, and no unexpected console/page error.
- Confirmed demo storage isolation and same-origin requests during the live demo flow.
- Confirmed service-worker update and offline demo reload.
- Confirmed live headers, caching, internal links, designed HTTP 404, and bundle budgets.
- Confirmed fresh mobile Lighthouse scores of 100/100/100/100; LCP 1.22 s, blocking time 83 ms, and layout shift 0.
- Confirmed that 22 served artifacts and every extracted extension package file match the candidate build.

## How to verify

```bash
npm ci
npm run typecheck
npm test
npm run build
unzip -t dist/site/downloads/focus-flow-map-chrome.zip
npm audit --omit=dev --audit-level=low
```

Open <https://focus-flow-map.sociobot.in/?demo=1> for the isolated six-step sample. Detailed evidence and exact results are in [`.factory/verification-6.md`](verification-6.md) and [`.factory/evidence/verification-6/`](evidence/verification-6/).

## Defects and next steps

No critical, major, moderate, or minor product defect was found. The Chrome Web Store listing remains planned; the direct Chromium package is complete for v1.

No product code was modified by this verification work order.
