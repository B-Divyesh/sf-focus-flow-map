# Focus Flow Map v1 handoff

## Delivered

- A WXT/TypeScript MV3 Chromium extension with an explicit-start content recorder, persistent recording bar, popup controls, local service-worker storage, accessible report page, session deletion, and Markdown/JSON issue packet exports.
- Privacy safeguards: no input values are read; query/hash URL data, long path identifiers, email-like content, URLs in labels, and token-like strings are redacted; audit content is never transmitted.
- Route observations for large viewport jumps, off-screen focus, recent repeats, stalled Tab movement, and absent computed focus styling. The UI labels these as review prompts rather than accessibility verdicts.
- Free mode retains the latest complete map and all export tools. The optional $24 one-time Pro license uses the Sociobot checkout/verify contract and adds 30-session local history plus per-session private notes. Cached valid licenses unlock immediately and reconcile at most daily; offline use never blocks free tools.
- A responsive static landing site, install instructions, privacy and terms pages, offline shell service worker, immutable asset headers, sitemap, and packaged extension download.
- A product-specific blueprint drafting visual system and original factory-generated hero art. Source, exact prompt, review note, provenance, WebP, and AVIF variants are included.

## Build and verification

Exact build command:

```bash
npm install
npm run build
```

Static deployment root: `dist/site` (with `index.html` at that root). The packaged extension is `dist/site/downloads/focus-flow-map-chrome.zip`; the unpacked MV3 build is `.output/chrome-mv3`.

Verified locally on 2026-08-28:

- `npm run typecheck` — passed.
- `npm test` — Vitest unit tests and Playwright desktop/mobile/site/extension tests passed.
- Real Chromium extension smoke test — started a session through the service worker, generated real Tab focus events, stopped and saved, opened the extension report, and matched the rendered station count.
- axe via Playwright — no serious or critical findings on home, privacy, terms, popup, or populated extension report at desktop and 390 px site viewports.
- `npm run build` — passed; extension build is about 85 KB total and site initial JavaScript is 3.3 KB raw (1.5 KB gzip), CSS 11.5 KB raw (3.2 KB gzip), fonts 38 KB total, mobile hero AVIF 18 KB / WebP 25 KB.
- Lighthouse mobile (local production preview): Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.3 s, CLS 0, TBT 0 ms, Speed Index 1.1 s.
- `npm audit --omit=dev` — 0 vulnerabilities.

## Known gaps

- This release ships as a direct zip with manual “Load unpacked” instructions; a Chrome Web Store listing is not part of this repository work order.
- The focus-indicator check uses computed outline/box-shadow and can miss custom visual indicators drawn by ancestors or pseudo-elements. Every observation is worded for manual review.
- Focus movement inside cross-origin iframes is represented by the iframe boundary rather than a complete inner-document route because browser isolation prevents a single top-page session from safely reading it.
- Pro history is intentionally local-only in v1. Hosted team workspaces are a possible later tier, not implied by this build.
- The factory must register/configure the paid product and production return URL in the Sociobot billing service before purchase flow launch; no product ID or secret is embedded here.

## Next steps

1. Register `focus-flow-map` and its $24 one-time license in the Sociobot billing engine, with the production landing URL as return URL.
2. Publish the generated zip through the Chrome Web Store and replace the manual-install primary CTA when approved.
3. Run pilot audits, track whether maintainers reproduce at least 70% of reported failures on first attempt, and tune heuristics from reviewed reports.
