# Verification 10 handoff — Focus Flow Map

- **Work order:** `focus-flow-map-verify-10`
- **Candidate:** `7ea36cd53d3034a834ea2915ce9bddb0dbccf357`
- **Production:** <https://focus-flow-map.sociobot.in/>
- **Demo:** <https://focus-flow-map.sociobot.in/?demo=1>
- **Status:** **PASS** — no release-blocking, high, medium, or low defect was found.

## What was verified

- All 17 commands in `.factory/claims.json` passed independently before the
  rest of QA.
- The cold desktop and 390px first screens state what the product does, who it
  serves, what to click first, and expose the one-click sample.
- `npm run check` passed: TypeScript, 18 unit tests, 50 browser tests with four
  intentional project skips, extension packaging, and the exact `dist/` build.
- The downloaded live extension completed explicit-start recording, local
  storage, forward/reverse route capture, redaction, Markdown/JSON export,
  empty/error/recovery, and delete-confirmation checks in a fresh profile.
- Live home, demo, Privacy, Terms, and 404 passed semantic, keyboard, mobile,
  focus, touch-target, reduced-motion, console, axe, link, privacy, header,
  caching, and offline checks.
- Axe found zero violations on five live documents. Mobile Lighthouse scored
  99 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO; LCP was
  1.13 s and CLS was 0.
- Candidate and deployment HTML, JS, CSS, service worker, and all 17 expanded
  extension files match exactly.

## Reproduce

```bash
npm ci
npm run check
npm audit --omit=dev --audit-level=low
unzip -t dist/site/downloads/focus-flow-map-chrome.zip
VERIFY_EVIDENCE_DIR=/tmp/focus-flow-live node scripts/verify-live.mjs
```

Run each `test` value in `.factory/claims.json` separately for the mandatory
claim gate. Detailed results and deployment hashes are in
[verification-10.md](verification-10.md).

## Known gaps and next steps

No acceptance gap remains. Pro sales are intentionally unavailable until the
owner enables checkout; the complete free recording and export path works.
The full npm development audit reports 11 build/test-tool advisories, while
the production dependency audit reports zero. Update those development tools
in a separate maintenance change after checking WXT compatibility.
