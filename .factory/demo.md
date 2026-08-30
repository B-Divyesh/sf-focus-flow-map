# Focus Flow Map demo

Open <https://focus-flow-map.sociobot.in/?demo=1> or use **Try it with sample data** on the first screen.

The demo opens a completed six-step keyboard route through a checkout. The route includes a 684-pixel viewport jump, a missing focus indicator, forward Tab steps, and one Shift+Tab step. Review notes explain what a maintainer should inspect.

Demo UI state uses only the `demo:focus-flow-map:` localStorage namespace. While the demo banner is visible, the site does not read or write the real `sb_license:focus-flow-map` key. The demo also skips license verification, so it makes no billing request.

**Reset demo** removes the demo namespace and restores the original route and open review notes. **Start for real** removes the demo namespace before returning to the normal product page. Closing, reloading, or leaving the demo also discards its state.

The automated isolation claim starts with a real-data sentinel, instruments every storage operation and network request, runs the demo, resets it, and leaves it. It asserts that the sentinel is unchanged, only demo-prefixed keys were touched while the banner was visible, and every request stayed on the product origin.
