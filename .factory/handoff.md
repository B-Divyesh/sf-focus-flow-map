# Review handoff — Focus Flow Map

**Work order:** `focus-flow-map-review-1`
**Result:** **FAIL** — documentation-only review; product code was not changed.

## Done

- Reviewed the live product from fresh 390 px and desktop browser contexts.
- Confirmed the first-screen clarity and one-click isolated demo flow.
- Ran every claim command from `.factory/claims.json` after `npm ci`; all passed.
- Ran `npm run check`; typecheck, 12 unit tests, 28 Playwright cases with expected skips, and the production build completed successfully.
- Checked live route responses, demo storage/request behavior, history records, copy, metadata, routing focus behavior, and product structure.
- Wrote the complete evidence and six remaining minor findings in `.factory/review-1.md`.

## Findings left

1. Route changes leave focus on `BODY`, not the new `<h1>`.
2. Demo, legal, and 404 route metadata is incomplete or stale.
3. The license-request privacy statement has no declared claim test.
4. Three claim-like provenance/runtime statements have no claims entry.
5. The README recording-field statement exceeds declared test coverage.
6. Two landing sentences use unexplained terms.

## Verification

```text
npm ci
# every command listed in .factory/claims.json
npm run check
```

No external resource other than `focus-flow-map.sociobot.in` was requested during the review. The tree is buildable; this review and this handoff are the only intended tracked changes.
