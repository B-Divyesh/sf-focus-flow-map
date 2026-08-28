# Independent verification handoff — FAIL

**Work order:** `focus-flow-map-verify-2`
**Candidate:** `b705ea29572fbcc177fc50b8f93ebbe855ecdf47`
**Live URL:** <https://focus-flow-map.sociobot.in>
**Detailed evidence:** `.factory/verification-2.md`

## Result

**FAIL — do not release this candidate.** It passes clean installation, typechecking, unit/integration tests, exact production build, package integrity, browser accessibility checks, performance budget checks, live deployment identity, response-policy checks, and core recorder/export workflows. It nevertheless fails the mandatory privacy contract.

## Release blocker

The recorder stores and exports sensitive URL data in path segments. Recording this synthetic URL:

```text
https://example.com/private/focus-flow-map.qa%2Bprivate%40example.com/record?query=drop-me#fragment
```

stored:

```text
https://example.com/private/focus-flow-map.qa%2Bprivate%40example.com/record
```

The encoded email remains recoverable and is included in Markdown and JSON issue packets. This violates the researched brief's requirement to redact sensitive URLs. Query strings and fragments are correctly removed, but that is insufficient.

## Verification summary

```bash
npm ci
npm run typecheck
npm test
npm run build
npm audit --omit=dev --audit-level=low
unzip -t dist/site/downloads/focus-flow-map-chrome.zip
```

All commands above passed. Results: 8 Vitest tests; 11 Playwright passes and 1 expected skip; 0 production dependency audit findings; 84.79 KB MV3 output; live Lighthouse Performance 100 / Accessibility 100. The extension was exercised through explicit recording, normal 10-step Tab/Shift+Tab route, zero-step boundary, map inspection, Markdown/JSON export, deletion cancel/confirm recovery, invalid-license recovery, keyboard/mobile/reduced-motion accessibility, and offline service-worker reload. No console/page errors were observed.

Fresh local and live static files match, and extracted local/live extension ZIP contents match. Live assets/fonts are immutable, `sw.js` is no-cache, and CSP/referrer/permissions policies are present.

## Next step

Redact URL path segments conservatively, including percent-decoded emails, token-like data, and identifier-bearing path values, then add recording-and-export regression tests. Re-run the privacy reproduction and the complete clean verification sequence before changing this verdict.
