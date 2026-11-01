---
title: One Function per File
tags: file, component, function, hook
---

## One Function per File

Each file holds exactly one function: a component, a hook, or a plain function. Components use `export default function`; hooks and plain functions use a named export. A helper goes in its own file: a component in the same `ui/` folder, a plain function in the slice's `lib/` segment.

**Incorrect:**

```tsx
// page.tsx
export default function Page() {}

function toKeyword(value: string | string[] | undefined) {}
```

**Correct:**

```ts
// src/pages/home/lib/toKeyword.ts
export function toKeyword(value: string | string[] | undefined) {}
```

```tsx
// page.tsx
import { toKeyword } from "@/pages/home/lib/toKeyword";

export default function Page() {}
```

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
