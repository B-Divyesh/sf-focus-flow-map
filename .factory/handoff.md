# Polish round 2 retry handoff — Focus Flow Map

- **Work order:** `focus-flow-map-polish-2-retry1`
- **Code repair:** `7af344e7bdd5cc83a1ab817e529ee16df4434559`
- **Deployment:** `3d4513ee-4b3b-459f-a5ca-2de61d6ec2a8`
- **Live:** <https://focus-flow-map.sociobot.in>
- **Demo:** <https://focus-flow-map.sociobot.in/?demo=1>
- **Result:** PASS — nothing remains open from review 1, review 2, or the controller retry.

## Delivered

The controller’s responsive-test failure was reproduced in both Playwright projects. The product correctly renamed the button after activation, but the name-bound locator then stopped resolving. The test now uses the stable button id and independently checks visible text, accessible name, `aria-expanded`, panel visibility, keyboard activation, Escape, focus return, and 44 px targets.

All seven review-2 repairs remain present: first-viewport sample data and product facts at 390×844, isolated `?demo=1` storage with reset/exit controls, tested claims, plain copy, real route metadata/focus/404 behavior, legal links, and the responsive menu states. All six review-1 repairs also remain covered. The blueprint drafting-sheet identity and browser-extension artifact are unchanged.

The catalog line is now: “Map Tab routes and export a local keyboard focus report.” It is verb-first and 56 characters.

## Exact verification

- Fresh clone `/tmp/focus-flow-map-polish2-retry.nO2WGY` at `7af344e7bdd5cc83a1ab817e529ee16df4434559`: `npm ci` passed.
- Every one of the 17 commands in `.factory/claims.json` passed independently.
- `npm run check` passed TypeScript, 13 unit tests, 44 browser cases, four intentional project skips, and `npm run build`.
- The responsive menu regression passed in both `desktop-chromium` and `mobile-390`.
- `npm audit --omit=dev --audit-level=low`: 0 production vulnerabilities.
- Extension ZIP integrity: no errors; packaged extension size: 91.76 kB.
- Static budget: 5.32 kB raw JS and 16.13 kB raw CSS.
- Deployment `3d4513ee-4b3b-459f-a5ca-2de61d6ec2a8` completed successfully.
- Cold `verify-url.sh` checks passed home, demo, Privacy, Terms, and direct 404 with no console/page errors.
- A real missing URL returned HTTP 404 and the designed “Page not found.” document.
- Live 390×844 Playwright checks passed menu state/focus, first-screen facts, first demo row, reset/exit, storage isolation, route focus, metadata, no overflow, same-origin networking, and offline demo reload.
- Live axe checks found no serious or critical issue on home, demo, Privacy, Terms, or 404.
- Live Lighthouse scored 100/100/100/100 for Performance/Accessibility/Best Practices/SEO; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0.
- Deployed and local home SHA-256 both equal `9f82eac484b37d12c32bd236a6902fff534d7f8d191534a86e0c86ed2a010cab`.

Evidence and the finding-by-finding map are in [.factory/polish-2.md](polish-2.md) and [.factory/evidence/polish-2-retry-live/live-check.json](evidence/polish-2-retry-live/live-check.json).

## How to verify

```bash
npm ci
npm run check
```

Then run each `test` command in `.factory/claims.json`. Preview the static build with `npx vite preview --config vite.site.config.ts`, or load `.output/chrome-mv3` as an unpacked Chromium extension.

## Known gaps / next steps

None.
