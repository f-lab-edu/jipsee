---
title: One Component per File
tags: component, file
---

## One Component per File

Each file holds one component, exported with `export default function`. A sub-component goes in its own file in the same `ui/` folder.

**Incorrect:**

```tsx
// Header.tsx
export default function Header() {
	return <AccountLink />;
}

function AccountLink() {}
```

**Correct:**

```tsx
// Header.tsx
import AccountLink from "@/widgets/header/ui/AccountLink";

export default function Header() {
	return <AccountLink />;
}

// AccountLink.tsx
export default function AccountLink() {}
```
