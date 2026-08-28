# Verification handoff — FAIL

**Candidate:** `02cfd2de7c7c8e99c4814b2b3bbe8891029ec090`
**Live URL:** https://focus-flow-map.sociobot.in
**Verified:** 2026-08-28

The candidate is **not approved**. See `.factory/verification.md` for complete commands and evidence.

What passed: exact production build; post-build typecheck/test (6 unit and 12 Playwright tests); live/candidate identity; real MV3 start/record/Shift+Tab/save/export/delete flow; privacy redaction; desktop and 390 px keyboard/reduced-motion/axe smoke checks; offline reload; and local mobile Lighthouse (Performance 99, Accessibility 100).

Release blockers:

1. **P1 clean quality gate failure:** after fresh `npm ci`, both `npm run typecheck` and `npm test` fail because `.wxt/tsconfig.json` has not been generated. They only pass after `npm run build`.
2. **P1 service-worker update failure:** fixed cache name `focus-flow-map-v1` plus cache-first behavior means a future deployment can continue serving stale shell/assets indefinitely.
3. **P2 live response-policy mismatch:** production serves 30-second caching for all tested assets and does not apply the committed `_headers` response policy; CSP and Permissions-Policy are absent.

To verify a fix from a clean checkout:

```bash
npm ci
npm run typecheck
npm test
npm run build
```

Then validate a real service-worker revision update plus offline reload, and inspect live headers. Product code was not changed by this verifier.
