# Repair handoff — Focus Flow Map

**Work order:** `focus-flow-map-repair-3`  
**Failed verifier candidate:** `b705ea29572fbcc177fc50b8f93ebbe855ecdf47`  
**Repair commit:** `796bd2d4447f561c207fdfdce76259b1ef43c5b3` (`fix: harden focus route URL redaction`)

## What changed

The independent verifier's blocker was reproduced from its exact candidate before making this repair. Evaluating the candidate's `redactUrl()` with:

```text
https://example.com/private/focus-flow-map.qa%2Bprivate%40example.com/record?query=drop-me#fragment
```

returned the unsafe persisted value:

```text
https://example.com/private/focus-flow-map.qa%2Bprivate%40example.com/record
```

The repair makes path handling conservative:

- Every path segment is percent-decoded (up to three times) before classification.
- Emails, `@`-bearing values, numeric/UUID/JWT/long opaque values, values after account/person/secret routes, and every unknown route word become `:redacted`.
- Only a small list of structural route words is retained. This prevents short values such as `/cases/alice` or `/records/AB12` from being mistaken for harmless routes.
- Non-HTTP(S) locations are represented as `[URL unavailable]` rather than exposing local file paths.
- The established content-script, background-storage, dashboard-migration, Markdown, JSON, and copy-report sanitization boundaries remain in place.

## Regression coverage

- Unit coverage now checks encoded email paths, double-encoded paths, JWT-like tokens, unencoded personal names, short account values, file paths, and exports from an intentionally unsafe saved session.
- The named export regression uses the verifier's exact encoded-email URL and asserts that the raw email, query, and fragment do not appear in the sanitized session, Markdown packet, or JSON packet.
- The real MV3 Playwright flow records the verifier URL in a clean Chromium profile, reads `ffm_sessions` from extension storage **before** loading the dashboard, then downloads Markdown and JSON. It asserts all three locations contain `.../private/:redacted/record` and none retain the email/query/fragment.

## Verification evidence

All commands below ran successfully on the current worker image after a clean `npm ci`.

```text
npm run typecheck
# PASS — WXT prepare + TypeScript

npm test
# PASS — Vitest: 4 files, 11 tests
# PASS — Playwright: 11 passed, 1 intentional mobile-only extension skip
# Includes desktop recorder/export, dashboard/popup axe, site desktop and 390×844 mobile, keyboard menu, reduced motion, service-worker update/offline unit coverage, and response-policy configuration coverage.

npm run build
# PASS — .output/chrome-mv3, dist/site, and dist/site/downloads/focus-flow-map-chrome.zip

unzip -t dist/site/downloads/focus-flow-map-chrome.zip
# PASS — all MV3 package entries

npm audit --omit=dev --audit-level=low
# PASS — 0 production vulnerabilities
```

The production extension is 91,655 B total. Landing-site JavaScript is 3,282 B raw / 1,502 B gzip, and landing CSS is 11,502 B raw / 3,211 B gzip.

Local production Lighthouse mobile measured Performance **100** and Accessibility **100** (FCP 1.1 s, LCP 1.3 s, TBT 0 ms, CLS 0). Playwright axe found no serious or critical findings on the site, popup, or dashboard. `verify-url.sh` is not supplied in this repository; the Playwright semantic/axe checks cover title, language, main landmark, one h1, alt text, and console-free page loading instead.

## Deployment and live identity

The repair commit was pushed to `origin/main`. Live deployment verification is being completed after the static host propagates the new package; the pre-propagation ZIP still reported its August 28 timestamp and prior artifact hash at the time of the first check.

## Known gaps

There are no known release blockers. A full development-only `npm audit` still reports 11 advisories in tooling; the production-only audit above is clean. The extension deliberately records only after an explicit start and retains route data locally.
