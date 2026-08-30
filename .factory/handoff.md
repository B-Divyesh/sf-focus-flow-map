# Repair handoff — Focus Flow Map

**Work order:** `focus-flow-map-repair-5`

**Failed candidate:** `64f44e9ade2a5607ecdafbc008e7e73362d43293`

**Verifier report:** `7be5a75a454fffbb6a24de90ae6d7e105b860574` (`.factory/verification-4.md`)

**Product repair commit:** `2879810`

**Production:** <https://focus-flow-map.sociobot.in>

**Demo:** <https://focus-flow-map.sociobot.in/?demo=1>

## Outcome

All three findings in verification report 4 are repaired and covered by browser regressions. The original WXT MV3 extension and static-site deployment class are unchanged.

1. Removed the unmeasured “Install in under a minute” promise. The installation label now says “Install the extension.”
2. Applied a 44×44 CSS pixel minimum to rendered links and controls across the landing site, legal and 404 pages, recorder overlay, extension dashboard, and popup.
3. Added a global `[hidden]` safeguard to the site and extension styles. A fresh unpaid visitor no longer sees or focuses the copy-license action; a valid local license still reveals it.

The researched audience, explicit-start recording, local-only audit storage, sensitive-value redaction, free exports, Pro behavior, isolated demo, original drafting-sheet design, and every previously passing claim remain intact.

## Root causes reproduced

The untouched candidate was built and inspected before repair.

- The landing page contained one “Install in under a minute” string. `.factory/claims.json` and test source contained no matching timed claim.
- At 390 px, rendered site targets measured as low as 15 px high. The extension dashboard wordmark measured 184×30 px and its legal links measured 47×15 and 38×15 px.
- `#copy-license` had the `hidden` attribute but computed to `display:inline-flex`, 314×47 px, and `tabIndex=0`. The broad author rule for buttons overrode the browser’s hidden-state rule.

## Regression coverage

`tests/e2e/site.spec.ts` now:

- enumerates every rendered link, button, summary, input, select, and textarea on `/`, `/privacy/`, `/terms/`, `/404.html`, the demo, and the open mobile menu;
- fails with the accessible name and measured dimensions for any target below 44×44 CSS px;
- runs those assertions in desktop Chromium and a 390×844 touch viewport;
- asserts that the timed installation promise is absent;
- asserts that `#copy-license` computes to `display:none`, has a 0×0 box, and cannot receive focus in fresh storage;
- asserts that a fresh, valid local license reveals and enables the copy action.

`tests/e2e/extension.spec.ts` applies the same rendered-size sweep to the real MV3 dashboard at desktop and 390 px and to the popup. It also measures both buttons inside the recorder’s shadow DOM. The shared `[hidden]` rule protects every extension hidden state, including the free-mode Pro notes.

The 11 entries in `.factory/claims.json` remain one-to-one with their tagged tests. Every manifest command was run separately and passed.

## Clean local verification

Run in this order from the repaired tree:

```text
npm ci
# PASS — 480 locked packages installed

npm run typecheck
# PASS — WXT prepare and tsc --noEmit

# each of the 11 commands in .factory/claims.json
# PASS — 11/11

npm test
# PASS — Vitest 5 files, 12 tests
# PASS — Playwright 25 tests, 3 intentional single-project skips

npm run build
# PASS — .output/chrome-mv3, dist/site, and packaged ZIP produced

unzip -t dist/site/downloads/focus-flow-map-chrome.zip
# PASS — no compressed-data errors

npm audit --omit=dev --audit-level=low
# PASS — 0 production vulnerabilities
```

There is no separate lint script; strict TypeScript typechecking is clean. The full development dependency audit still reports 11 build/test-tool advisories (1 low, 2 moderate, 5 high, 3 critical). None is a shipped runtime dependency.

Local `/opt/fleet/lib/verify-url.sh` checks passed for `/` and `/?demo=1`: HTTP 200, correct title and language, one `h1`, one `main`, no missing image alternatives, no unlabeled buttons, and no console/page errors. Playwright axe reported zero serious or critical findings on landing, demo, privacy, terms, 404, dashboard, and popup surfaces.

Additional browser coverage passed for keyboard-only demo reset and review controls, Enter/Escape mobile navigation with focus return, reduced motion, 200% zoom without horizontal loss, explicit recorder start, private local recording and exports, dialog behavior, license failures, 390 px layout, and service-worker update plus offline reload.

## Performance and package evidence

Local production Lighthouse mobile on `/?demo=1`:

| Category or metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| First Contentful Paint | 1.2 s |
| Largest Contentful Paint | 1.3 s |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0 |

Production sizes remain within budget:

- Landing JavaScript: 4,825 B raw / 2,005 B gzip.
- Landing CSS: 13,186 B raw / 3,529 B gzip.
- Legal CSS: 2,326 B raw / 994 B gzip.
- Self-hosted fonts: 37,476 B total.
- Mobile hero AVIF: 17,917 B.
- Unpacked extension: 91,800 B.
- Packaged extension ZIP: 65,031 B.

## Deployment and live evidence

`dist/site` was deployed to the existing `sf-focus-flow-map` production Static Web App. Deployment used that app’s exact resource ID and its deployment token. No DNS, billing, database, vault, shared service, app settings, or resource belonging to another product was read or changed.

Live verification after deployment established:

- Desktop and 390 px target sweeps found no rendered interactive box below 44×44 CSS px.
- Fresh unpaid state rendered the copy-license control as `display:none` with a 0×0 box.
- Axe found zero serious or critical issues on desktop and 390 px demo views.
- Demo request capture recorded eight same-origin requests and no cross-origin request.
- Instrumented demo storage recorded one `get` and one `set`, both for `demo:focus-flow-map:state`.
- Desktop and mobile console/page error counts were zero.
- Keyboard demo reset, mobile Enter/Escape menu behavior, focus return, 200% zoom, and 390 px overflow checks passed.
- The active production service worker completed `registration.update()`. A fresh online load followed by an offline reload retained the full demo.
- Unknown paths return the designed page with HTTP 404.
- CSP includes `frame-ancestors 'none'`; `Referrer-Policy` is `no-referrer`; `X-Content-Type-Options` is `nosniff`; Permissions-Policy is present.
- Hashed assets use one-year immutable caching, `sw.js` uses `no-cache`, and the extension ZIP is served as an attachment.

Local and live bytes match for the landing, privacy, terms, 404, service worker, demo boot script, social card, hashed JS/CSS, font, and extension ZIP. Key full SHA-256 values:

| Artifact | SHA-256 |
| --- | --- |
| `/` | `a75a8e11e4d506a1edd810e14e89944156282e6c953220fb9807d1a62fda1032` |
| `/sw.js` | `f4ded16a179c95bb1bd6286754a71221fa12c2f126d8cbdc99149e958ed3ab3c` |
| home CSS | `5b5d069474912220e9cf969f8b7ecb09359132a926bbea6edddbe80522057999` |
| home JavaScript | `c65ffddb22348c4732b884197a6db53c618d75bdef3db253f825e7b985d0828c` |
| extension ZIP | `2d8f642cd34170ff7438361a2463d9aacec593d20eb2cfacbb2223b93bcf6424` |

## Known gaps

There are no release-blocking product gaps. The direct Chromium ZIP remains the v1 distribution while a Chrome Web Store listing is planned.
