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

### Exceptions

- The blue filled buttons (search, send) use the dedicated `.brand-filled-button` class in `app/theme.css` instead of overriding Seed tokens such as `bg.brandSolid` or `bg.informativeSolid`. Values must use `--seed-*` CSS variables.
- The desktop page background (`body` background inside `@media (min-width: 1280px)` in `app/theme.css`) is an exception to Seed-first styling because `bg` accepts no responsive values and the page background is a `body` default style, not an element. The value must use a `--seed-*` CSS variable.
