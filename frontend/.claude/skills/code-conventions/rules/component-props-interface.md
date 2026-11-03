---
title: Props as an Interface Above the Component
tags: component, props, typescript
---

## Props as an Interface Above the Component

Declare props as an `interface` named `<Component>Props`, directly above the component. No inline prop types.

**Incorrect:**

```tsx
export default function Header({ session }: { session: Nullable<Session> }) {}
```

**Correct:**

```tsx
interface HeaderProps {
	session: Nullable<Session>;
}

export default function Header({ session }: HeaderProps) {}
```
