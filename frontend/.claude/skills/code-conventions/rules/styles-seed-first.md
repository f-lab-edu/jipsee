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
- The page background wider than the 480px column (`body` background inside `@media (min-width: 481px)` in `app/theme.css`, covering tablet and desktop) is an exception to Seed-first styling because `bg` accepts no responsive values and the page background is a `body` default style, not an element. The value must use `--seed-*` CSS variables; it uses `--jipsee-color-bg-brand-tint` (3% of `--seed-color-bg-brand-solid` mixed into `--seed-color-bg-layer-default`), defined on `:root` in `app/theme.css` because Seed has no token at that step. The same variable is exposed to components as `colors.brandTintBackground` in `src/shared/config/colors.ts` and passed through `bg`, for the mobile header and intro band background before a search.
- Letter-spacing is an exception because Seed has no `letterSpacing` prop or token. The page default (-0.01em) is set on `body` in `app/theme.css` and inherited as computed; `body` also sets `word-break: keep-all` so Korean text wraps between words, as in the canvas, and the `.tight-letter-spacing` class (-0.03em) in the same file is applied through `className` in the widget or page config for the header service name and the desktop intro title. The header service name also uses `:root .extra-bold` (font-weight 800) in the same file, because Seed `fontWeight` stops at `bold` (700).
- The search field shapes (`.search-field--intro` and `.search-field--compact`: height, the single ring border drawn through the Seed `::after`, radius, shadow, root padding and gap, the input class that zeroes the input padding and sets the placeholder size, in-field leading icon and trailing button margins) are defined as classes in `app/theme.css` because `TextFieldRoot` accepts no style props. Colors, radii and spacings must use `--seed-*` CSS variables, and only lengths without a token (60, 1.5px, shadow offset and blur) are written as numbers.
