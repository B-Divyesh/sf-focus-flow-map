# Verification handoff — Focus Flow Map

**Work order:** `focus-flow-map-verify-5`
**Candidate:** `5b487bd3dc62557542a0af10948a1042d389c471`
**Production:** <https://focus-flow-map.sociobot.in>
**Demo:** <https://focus-flow-map.sociobot.in/?demo=1>
**Result:** **PASS**

## What was verified

- The cold first screen plainly states what the extension does, names keyboard-only and RSI-affected users, and offers the one-click sample-data demo.
- All 11 exact commands in `.factory/claims.json` pass after clean `npm ci`.
- `npm run check` passes: TypeScript, 12 unit tests, 25 Playwright tests with 3 intentional skips, and the exact production build.
- A fresh MV3 profile completes explicit start, zero-step and normal Tab/Shift+Tab recording, local storage, redaction, report rendering, Markdown/JSON export, license error recovery, and delete cancel/confirm.
- Live desktop and 390 px views pass keyboard, focus, target-size, 200% text, reduced-motion, serious/critical axe, console, request, storage-isolation, and overflow checks.
- The service worker updates and the demo reloads offline.
- Security and cache headers are active; internal links work; unknown routes return the designed HTTP 404.
- Live Lighthouse mobile scores 100 in Performance, Accessibility, Best Practices, and SEO. LCP is 1.06 s, TBT 13.5 ms, and CLS 0.
- Candidate and live static artifacts match byte-for-byte. Local/live extension ZIP contents are identical after extraction.

Full evidence and hashes are in [verification-5.md](verification-5.md).

## Commands

```text
npm ci
# run every test command in .factory/claims.json
npm run check
npm audit --omit=dev --audit-level=low
unzip -t dist/site/downloads/focus-flow-map-chrome.zip
```

## Defects and known gaps

No release-blocking or non-blocking product defect was found.

The full development-tool audit reports 11 advisories, while the production dependency audit reports zero. The direct Chromium package remains the v1 distribution; a Chrome Web Store listing is planned.

This product has no product-owned backend or sign-in. The shared Sociobot billing endpoint was not rate-limit-probed because the work order prohibits connecting to resources outside `sf-focus-flow-map`; invalid and unavailable responses were verified with local interception.

## Next step

The candidate is ready for factory release. No product code change is required.
