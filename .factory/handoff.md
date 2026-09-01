# Review 3 handoff — Focus Flow Map

- **Work order:** `focus-flow-map-review-3`
- **Candidate:** `b8f7e23479e562eb9c33a87cebc4fd54508f0b87`
- **Live:** <https://focus-flow-map.sociobot.in>
- **Demo:** <https://focus-flow-map.sociobot.in/?demo=1>
- **Result:** **FAIL** — seven minor findings; no blocking finding

Independent product QA was completed without changing product code or deployment state. The full report is [.factory/review-3.md](review-3.md).

The cold mobile and desktop first screens clearly identify the job, audience, and first action. The one-click demo immediately shows realistic route data at both sizes. Reset works, demo state remains separate, real license state remains unchanged, and the fresh live request log is same-origin.

All 17 commands in `.factory/claims.json` passed separately from a clean clone. `npm test` passed 13 unit checks and 44 browser checks, with four intentional mobile-project skips. `npm run build` produced `dist/site/` and the packaged extension. The worker URL checker passed home, demo, Privacy, Terms, and the direct 404 document. Live axe checks found no serious or critical issue on the checked routes at 390×844 or 1440×1000.

## Remaining work

Resolve F-3-1 through F-3-7 before acceptance:

1. Identify external destinations in link text or accessible names.
2. Rename the desktop **Download** action to **Download extension**.
3. Remove or clarify **ROUTE 014**.
4. Replace unexplained sample shorthand with plain route labels.
5. Standardize focus-route, route-report, and review-note terms.
6. Rewrite the technical license fallback messages.
7. Expand `MV3` and replace `axe checks` with plain wording in the README.

## How to verify

```bash
npm ci
npm test
npm run build
```

Run each `test` command in `.factory/claims.json` separately. Then confirm the first viewport at 390×844 and 1440×1000, enter `/?demo=1`, check Reset and Start for real, crawl every same-origin link, check external-link labels, and rerun the complete sentence audit.
