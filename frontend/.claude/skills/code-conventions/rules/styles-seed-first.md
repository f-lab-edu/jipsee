---
title: Seed Components and Tokens First
tags: style, seed
---

## Seed Components and Tokens First

Lay out and style with Seed components and their style props, using Seed tokens (e.g. `HStack px="spacingX.globalGutter" py="x3"`, `Text fontSize="t3" color="fg.neutralSubtle"`). Add a CSS Module only when Seed props cannot express it.

Global base styles (body font, color, background, link reset) live in `app/theme.css`, because `@seed-design/css` defines tokens but does not apply them to `body`.

- Page width: below `lg` (1280px) the layout's inner column (`maxWidth` 480px, centered) holds the content; at `lg` and above `ContentContainer` holds it with a maximum of 1200 including padding. Use Seed responsive props (`{ base, lg }`) for properties that accept them, and split properties that do not (`bg`, `border*`, `borderRadius`, `position`, `alignItems`, `justifyContent`, `flexGrow`, `Text` `fontSize` and `lineHeight`) into a mobile element (`hideFrom="lg"`) and a desktop element (`display={{ base: "none", lg: "block" }}`).

**Incorrect:**

```css
/* Header.module.css */
.header {
	padding: 12px 16px;
}
```

**Correct:**

```tsx
<HStack px="spacingX.globalGutter" py="x3">
	<Text fontSize="t3" color="fg.neutralSubtle">집씨</Text>
</HStack>
```

### Style value flow

Style values flow one way: `shared/config` -> `widgets/*/config` -> `ui`.

- `shared/config` holds tables used across widgets (e.g. `typography`).
- `widgets/*/config` holds one style object per widget, built with `defineResponsiveStyles` (`shared/lib/defineResponsiveStyles.ts`) with a `mobile` and a `desktop` entry. It spreads `shared/config` values.
- `ui` only spreads config values (`<Box {...style.container}>`). Components do not write raw style values such as heights, gaps, paddings, or sizes.
- The mobile layout and the desktop layout are rendered through `shared/ui/ResponsiveLayout`, which owns `hideFrom` / `display` and the `data-testid` (`<testId>-mobile`, `<testId>-desktop`). The layout components do not set them.
- A value injected by the caller (e.g. `mobileBackground`) is a prop, not config.

### Exceptions

- The blue filled buttons (search, send) use the dedicated `.brand-filled-button` class in `app/theme.css` instead of overriding Seed tokens such as `bg.brandSolid` or `bg.informativeSolid`. Values must use `--seed-*` CSS variables.
- The page background wider than the 480px column (`body` background inside `@media (min-width: 481px)` in `app/theme.css`, covering tablet and desktop) is an exception to Seed-first styling because `bg` accepts no responsive values and the page background is a `body` default style, not an element. The value must use `--seed-*` CSS variables; it uses `--jipsee-color-bg-brand-tint` (3% of `--seed-color-bg-brand-solid` mixed into `--seed-color-bg-layer-default`), defined on `:root` in `app/theme.css` because Seed has no token at that step. The same variable is exposed to components as `colors.brandTintBackground` in `src/shared/config/colors.ts` and passed through `bg` for the home mobile header, the intro band, and the home screen `main` (`src/pages/home/config/homeScreenStyles.ts`), so the whole home body below 481px is tinted. In the same `@media (min-width: 481px)` block, the `.tinted-page-card` class (side margin `spacingX.globalGutter`, 1px `stroke.neutralMuted` border, `r5` radius, `overflow: hidden`) turns a full-width white block into a card only where the page is tinted, because `borderRadius` and `borderWidth` accept no responsive values; the mobile and tablet result list uses it through `className` in its config.
- Letter-spacing is an exception because Seed has no `letterSpacing` prop or token. The page default (-0.01em) is set on `body` in `app/theme.css` and inherited as computed; `body` also sets `word-break: keep-all` so Korean text wraps between words, as in the canvas, and the `.tight-letter-spacing` class (-0.03em) in the same file is applied through `className` in the widget or page config for the header service name and the desktop intro title. The header service name also uses `:root .extra-bold` (font-weight 800) in the same file, because Seed `fontWeight` stops at `bold` (700).
- The search field shapes (`.search-field--intro` and `.search-field--compact`: height, the single ring border drawn through the Seed `::after`, radius, shadow, root padding and gap, the input class that zeroes the input padding and sets the placeholder size, in-field leading icon and trailing button margins) are defined as classes in `app/theme.css` because `TextFieldRoot` accepts no style props. Colors, radii and spacings must use `--seed-*` CSS variables, and only lengths without a token (60, 1.5px, shadow offset and blur) are written as numbers.
- The `.stretched-link` class in `app/theme.css` (an absolutely positioned `::after` with `inset: 0`) widens a link's click area to its nearest positioned ancestor, because Seed has no pseudo-element props. It is applied through `className` in the slice config; the ancestor gets `position: "relative"` there. The desktop result table row uses it so the whole row opens the building detail.
- The upward mobile chat panel shadow (`.chat-panel-shadow` in `app/theme.css`, used by `ChatExpandedPanel` and `ChatCompactBar` through `className`) is an exception because no Seed shadow token spreads upward (`$shadow.s1` to `s3` all drop down at different offsets, blurs, and opacities) and a single `boxShadow` string cannot hold both modes: `palette-gray-1000` turns light in dark mode, so the light value (`0 -6px 20px`, 6% of `--seed-color-palette-gray-1000`) and the dark value (40% of `--seed-color-palette-static-black`) sit under the two system-mode selectors. The desktop aside has no shadow.
- The chat input shape classes (`.chat-input--compact`, `.chat-input--expanded` and `.chat-input--aside`) are exceptions because `TextFieldRoot` accepts no style props and the Seed sizes cannot make the 48 and 52 heights. Colors, radii and spacings must use `--seed-*` CSS variables. The classes set `box-sizing: border-box`, drop Seed's 1px inner `box-shadow`, and zero the input's `:first-child` and `:last-child` padding so only the root padding and gap remain. `.chat-input--compact` is the bar itself (48px, `bg.neutralWeak`, no border) and also overrides Seed's disabled background. `.chat-input--expanded` (48px) and `.chat-input--aside` (52px) draw a real 1px `stroke.neutralWeak` border, so dropping the inner `box-shadow` keeps the same-colored lines from stacking into 2px; the 15px text size of `.chat-input--aside` has no token and is written as a number.
