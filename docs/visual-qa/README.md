# Industrial revamp — visual QA

Validated on 2026-09-26 using an isolated Chromium session and demo data. No personal browser storage was used.

## Evidence

| View | Light | Dark |
| --- | --- | --- |
| Desktop, 1440 px | [Screenshot](light-desktop.png) | [Screenshot](dark-desktop.png) |
| Mobile tickets, 360 px | [Screenshot](light-mobile.png) | [Screenshot](dark-mobile.png) |

The running application and development catalog were both checked at **360, 768, 1024 and 1440 px in both themes**. The page had no horizontal overflow. All automated axe WCAG 2 A/AA audits passed after animations settled. Audits supplement visual inspection; they do not establish complete WCAG conformance.

## Interactions checked

- Filtering and clearing filters; reordering; cancelling and confirming removal; recording a manual loss.
- Valid and invalid backup input, merge, replacement confirmation/cancellation, Escape dismissal and focus restoration.
- Supported-game links, filter menus, activity and accuracy views in both themes; keyboard tab navigation with Home/arrows.
- English and Portuguese, including the 360 px layout. All nine game identities and result formats.
- Hover scale measured at 1.015 for tickets with 240 ms transform transitions. Reduced-motion emulation removes scale and transitions.
- Paste event auto-save, historical date selection and return to today. Copy success feedback and exact text passed to the real clipboard write API. Direct clipboard read was denied by the headless browser, so clipboard contents were not independently read back.
- Catalog language, theme and sample changes leave every localStorage key unchanged.

## Automated checks

- `bun run lint`: passed.
- `bun run typecheck`: passed.
- `bun test`: **78 passed**, 306 assertions.
- `bun run build`: passed; production JavaScript 432.79 kB / 126.00 kB gzip, CSS 36.83 kB / 7.89 kB gzip at validation time.
- Development catalog/sample code is excluded from the production bundle.

Result presentation tests verify unchanged stored results and share messages, all nine games, grapheme preservation, manual losses, zero-point completions, mode labels, side-by-side boards and scoring rounds.

## Ticket performance and edition consistency

Follow-up validation: large figures now show points or attempts, including attempts per mode. All editions appear in footer metadata beside the date. Missing values remain explicit em dashes.

- [Light, Gamedle](ticket-performance-light.png) and [dark, Termo](ticket-performance-dark.png): multi-mode tickets at 360 px.
- Catalog checked at 360, 768, 1024 and 1440 px in both themes, plus English at 360 px. App checked at 360 and 1440 px in both themes. No page or ticket overflow; axe WCAG 2 A/AA audits reported zero violations.
- Added tests for edition placement across all nine games, played guesses versus unused cells, mode-specific editions and Termo board keycaps. Existing data/share invariants still pass.
- Lint, typecheck and build passed; **81 tests passed**, 404 assertions.

## Copy cleanup

Removed promotional headings, ticket record labels, repeated brand/year stamps, the footer brand and redundant input/empty/manual-loss instructions. Functional labels and contextual help remain. Spacing now follows the shorter content.

- [Desktop, light/EN](copy-cleanup-desktop.png) and [mobile, dark/PT](copy-cleanup-mobile.png).
- App checked at 360, 768, 1024 and 1440 px in both themes; catalog checked at 360 px in both themes. No page overflow and no axe WCAG 2 A/AA violations after theme transitions settled.
- Lint, typecheck, build and all 81 tests passed (404 assertions).

## Ticket hover shadow

- [At rest](ticket-shadow-rest.png): no shadow; both notch openings remain clear. [Hovered](ticket-shadow-hover.png): 2 px lift, 1.015 scale and a soft 24% black shadow with negative spread.
- Inspected both themes at desktop width and the mobile layout at 360 px. Moving the pointer away restores `box-shadow: none`. Reduced motion retains `transform: none` and `transition-duration: 0s`; mobile has no page overflow.
- Lint, typecheck, build and all 81 tests passed (404 assertions).

## Editions in the stub

- Dates removed from individual tickets; available editions moved to the colored stub. Missing editions, including individual unknown modes and manual losses, render no field or placeholder. Score placement is unchanged.
- [Desktop, light/PT](ticket-edition-desktop.png) and [mobile, dark/EN](ticket-edition-mobile.png). Checked 360, 768, 1024 and 1440 px in both themes: no overflow, no ticket dates, no edition placeholders, and edition content is exposed to assistive technology.
- Axe reported no WCAG 2 A/AA violations. Desktop edition contrast required manual review because notch pseudo-elements prevented background detection; verified black ink on the actual pastel stub surfaces in both themes.
- Lint, typecheck, build and all **82 tests passed** (420 assertions).
