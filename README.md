# Focus Flow Map

Focus Flow Map is a privacy-first Chromium extension for keyboard-only and RSI-affected users, accessibility auditors, and the teams supporting them. It records a user-initiated Tab/Shift+Tab session, turns the actual route into a numbered local map, highlights likely jumps and dead ends, and exports a reproducible Markdown or JSON issue packet.

Live site: <https://focus-flow-map.sociobot.in>

## What v1 does

- Records only after the user chooses **Start recording**.
- Captures focus order, direction, safe structural selector, accessible label, viewport position, scroll delta, visibility, and the presence of a computed focus indicator.
- Flags large viewport jumps, off-screen targets, recent repeats, stalled Tab movement, and missing computed focus indicators for human review.
- Redacts query strings, hashes, long identifier-like path segments, emails, URLs in labels, and token-like text. It never reads or records input values.
- Stores sessions in browser extension storage and sends no audit content to a server.
- Exports a complete Markdown or JSON issue packet in the free tier.
- Offers an optional $24 one-time Pro license for a 30-session local history and private audit notes. Core accessibility and export features remain free.

The generated observations are evidence prompts, not an accessibility certification. Review them and test with disabled users before making a compliance claim.

## Run locally

Requirements: Node.js 22+ and npm.

```bash
npm install
npm run dev       # WXT extension development mode
npm run dev:site  # landing site at http://localhost:5173
```

For the extension, open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select `.output/chrome-mv3` after WXT has built it.

## Test and build

```bash
npm run typecheck
npm test
npm run build
```

`npm test` runs Vitest privacy/report tests, Chromium extension recording smoke tests, 390 px responsive tests, and axe checks for the site, popup, and report.

The exact production build command is `npm run build`. It creates:

- `dist/site/index.html` — static deployment root.
- `dist/site/downloads/focus-flow-map-chrome.zip` — installable Chromium MV3 package.
- `.output/chrome-mv3/` — unpacked extension for development.

Preview the production site with:

```bash
npx vite preview --config vite.site.config.ts
```

## Architecture

- WXT + TypeScript for the MV3 service worker, content recorder, popup, and local report page.
- Vite + vanilla TypeScript for the static product, privacy, and terms pages.
- Browser storage for extension sessions and license state; local storage for private report notes and the landing-page license handoff.
- Sociobot billing API for hosted checkout and license verification. No payment provider is embedded.
- No analytics, external runtime scripts, CDN fonts, or remote session storage.

## Permissions

- `activeTab` and site access: observe focus changes on the page only after an explicit start.
- `storage`: keep focus maps and license state on the current device.
- `tabs`: identify the active page and open the local map.

See [the product brief](.factory/brief.json), [visual thesis](.factory/design.md), [privacy policy](site/privacy/index.html), and [terms](site/terms/index.html).

## License

MIT. See [LICENSE](LICENSE).
