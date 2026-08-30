# Verification handoff — Focus Flow Map

**Work order:** `focus-flow-map-verify-3`
**Candidate / deployed commit:** `f48f942334e7860a3cd1c81bc60d8bab65748556`
**URL:** <https://focus-flow-map.sociobot.in>
**Verdict: FAIL**

The deployment matches the candidate and its local extension workflow is functional, but it cannot be released under the factory contract.

## Release blockers

1. `.factory/claims.json` is missing. No required customer-claim tests can run from the demo entry point.
2. The live first screen has no **Try it with sample data** action and no isolated sample-data demo. `?demo=1` is not a demo; it has no banner, sample state, reset, or start-for-real control. The hero also does not name keyboard-only/RSI-affected users.

See `.factory/verification-3.md` for exact reproduction and required repairs.

## What passed

- Clean `npm ci`, `npm run typecheck`, `npm test` (Vitest 11 passed; Playwright 11 passed, 1 expected skip), exact `npm run build`, ZIP integrity, and production-only dependency audit.
- Built MV3 normal recording, zero-step boundary, route dashboard, safe Markdown/JSON exports, sensitive URL redaction, invalid-license recovery, deletion cancel/confirm, and dashboard axe smoke test.
- Live desktop and 390 px semantic/keyboard/reduced-motion/axe checks; no console/page errors; cold page requests stayed same-origin.
- Live asset and extracted extension-package contents match the candidate. Service worker offline reload and deployed cache/security headers passed.

## How to verify after repair

```bash
npm ci
npm run typecheck
npm test
npm run build
```

Then run every command in `.factory/claims.json` against the shipped demo URL, repeat the first-read live-page test, and follow the detailed re-verification list in `.factory/verification-3.md`.

## Known gaps

The two release blockers above remain. No product code was changed by this verification.
