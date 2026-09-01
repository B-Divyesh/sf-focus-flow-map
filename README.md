# Focus Flow Map

Focus Flow Map is a Chromium extension for keyboard-only and RSI-affected users, auditors, and the teams supporting them.

It records a user-started Tab and Shift+Tab focus route. The local route report shows numbered steps, page jumps, loops, and missing focus indicators. Free exports include Markdown and JSON.

Live site: <https://focus-flow-map.sociobot.in>

One-click sample: <https://focus-flow-map.sociobot.in/?demo=1>

## Try the isolated demo

Choose **Try it with sample data** on the first screen, or open the sample link above. A completed six-step checkout route appears immediately.

The banner identifies demo mode. **Reset demo** restores the sample, and **Start for real** returns to the normal product page.

Demo state uses only `demo:focus-flow-map:` keys and is removed when you leave. The demo does not read or change real license data. See [.factory/demo.md](.factory/demo.md) for the sample and isolation details.

## What v1 does

- Records only after the user chooses **Start recording**.
- Captures focus order, direction, labels, page position, scrolling, and visibility.
- Stores a redacted element locator and whether each control shows a focus outline.
- Flags large page jumps, off-screen targets, recent repeats, stalled Tab movement, and missing focus indicators for review.
- Redacts queries, hashes, sensitive URL paths, URLs in labels, email addresses, identifiers, and token-like text.
- Never reads or records input values.
- Stores sessions in browser extension storage. It sends no audit content to a server.
- Exports a complete Markdown or JSON route report in the free tier.
- Offers an optional $24 one-time Pro license for 30 local sessions and private notes.
- Keeps recording, redaction, and Markdown and JSON exports free.

The review notes support an accessibility review. They do not certify compliance. Test with disabled users before making a compliance claim.

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

`npm test` runs privacy and route-report tests, Chromium extension tests, 390 px tests, route metadata checks, and automated accessibility checks.

Customer-facing claims and their exact commands are listed in [.factory/claims.json](.factory/claims.json). Each command runs one tagged test against shipped sample data.

The exact production build command is `npm run build`. It creates:

- `dist/site/index.html` — static deployment root.
- `dist/site/downloads/focus-flow-map-chrome.zip` — installable Chromium Manifest V3 (MV3) package.
- `.output/chrome-mv3/` — unpacked extension for development.

Preview the production site with:

```bash
npx vite preview --config vite.site.config.ts
```

## Architecture

- WXT and TypeScript for the Manifest V3 extension worker, recorder, popup, and local route report.
- Vite and vanilla TypeScript for the static product, demo, privacy, and terms pages.
- Extension storage for sessions and license state. Extension-origin local storage keeps private report notes.
- A separate `demo:focus-flow-map:` namespace for disposable sample state.
- Sociobot billing API for hosted checkout and license verification. No payment provider is embedded.
- No analytics, external runtime scripts, CDN fonts, or remote session storage. The `no-third-party-runtime` claim test checks both home and demo.

## Permissions

- `activeTab` and site access observe focus only after an explicit start.
- `storage` keeps route reports and license state on the current device.
- `tabs` identifies the active page and opens the local route report.

See [the product brief](.factory/brief.json), [visual thesis](.factory/design.md), [privacy policy](site/privacy/index.html), and [terms](site/terms/index.html).

## License

MIT. See [LICENSE](LICENSE).
