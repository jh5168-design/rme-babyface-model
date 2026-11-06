# Browser Testing and Iteration Record

Date: November 6, 2026

Environment: local static site opened in a Chromium-based in-app browser.

## Initial functional test

The following interactions were executed in the browser:

1. Turned power on.
2. Changed volume from 45% to 75%.
3. Changed the input from Mic 1 to Mic 2.
4. Changed the output from Speakers to Headphones.
5. Turned Mute on.
6. Turned power off and attempted to change volume to 25%.

Observed results:

- The live state correctly displayed `IN MIC 2`, `OUT HEADPHONES`, and `75`.
- The control-flow message correctly changed to “Else, route Mic 2 to Headphones at 75% volume.”
- Mute changed the state label to `MUTED` and set the meters to zero.
- A state inconsistency was found: after power was turned off, the volume slider was still enabled and the log recorded “Volume changed to 25%.” The screen still said `OFF`, so the control and feedback contradicted each other.

## Meaningful iteration

I revised the `render()` function so the power state controls whether the volume slider, Mute button, input selector, and output radios are enabled. When power is off, these controls are disabled. When power returns, they are enabled and the previous settings are preserved.

I also increased display-text contrast and replaced colored glow shadows with neutral shadows after a design-accessibility check.

## Verification after revision

- Power off: operational controls are disabled; the screen and rule both report the offline state.
- Power on: all operational controls become enabled.
- Volume, input, output, and Mute changes update the display, rule, meter, status pill, and event log.
- Power off after changes: controls become disabled again and cannot create contradictory events.
- No browser console errors were observed during the verified interaction flow.

This is a test record of actions actually performed on the model. It is not a transcript of another person’s usability test.

## UI refinement regression test

In the in-app browser, powered on, set volume to 62%, selected Instrument, and routed to Headphones. Mute dropped the meter to zero while retaining the volume setting. Unmuting restored the live meter and 62% setting. Powering off hid the route and disabled the slider. Powering back on restored the route and volume. No browser console errors were observed.

At viewport widths of 1280, 768, 375, and 320 CSS pixels, the page had no horizontal overflow, output labels fit their controls, and the port row started 18 pixels below the main controls.
