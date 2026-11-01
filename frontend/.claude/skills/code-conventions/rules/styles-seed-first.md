---
title: Seed Components and Tokens First
tags: style, seed
---

## Seed Components and Tokens First

Lay out and style with Seed components and their style props, using Seed tokens (e.g. `HStack px="spacingX.globalGutter" py="x3"`, `Text fontSize="t3" color="fg.neutralSubtle"`). Add a CSS Module only when Seed props cannot express it.

Global base styles (body font, color, background, link reset) live in `app/theme.css`, because `@seed-design/css` defines tokens but does not apply them to `body`.

- The app is mobile first: `body` is a centered column with `max-width: 480px` (in `app/theme.css`). Elements with `position: fixed` must apply the same max width and centering, because fixed positioning ignores the body width.

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
