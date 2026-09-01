# Verification handoff — Focus Flow Map

- **Work order:** `focus-flow-map-verify-7`
- **Candidate:** `7bcf0a7e5ad72b6166b459696a4365bb90a97747`
- **Live:** <https://focus-flow-map.sociobot.in>
- **Demo:** <https://focus-flow-map.sociobot.in/?demo=1>
- **Result:** **PASS**

Independent QA completed without product-code changes. The cold first read is plain and complete: Focus Flow Map records Tab routes for keyboard-only and RSI-affected users; **Try it with sample data** opens a completed route immediately.

All 17 declared claim commands passed independently after `npm ci`. `npm run check` passed TypeScript, 13 unit tests, 48 browser cases, and the production build. `dist/` was produced. Production dependency audit reported 0 advisories.

Live and local candidate landing HTML have the same SHA-256: `9f82eac484b37d12c32bd236a6902fff534d7f8d191534a86e0c86ed2a010cab`. Every expanded file in the live extension download matches the local build. Live desktop and 390 px checks passed, including keyboard controls and focus, reduced motion, offline demo reload, no serious/critical axe findings, same-origin request logging, CSP/security headers, cache policy, and designed HTTP 404 behavior.

Static budgets: 5,316-byte raw initial JavaScript, 13,798-byte home CSS, 17,917-byte mobile hero AVIF, and a 91,760-byte local extension package.

No release-blocking, high, medium, or low defects remain. `npm ci` reports development dependency advisories; the production-only audit is clear.

Full evidence and exact commands/results: [.factory/verification-7.md](verification-7.md).

## How to verify

```bash
npm ci
npm run check
```

Run every `test` command in `.factory/claims.json` independently. Preview with `npx vite preview --config vite.site.config.ts`, or load `.output/chrome-mv3` as an unpacked Chromium extension.
