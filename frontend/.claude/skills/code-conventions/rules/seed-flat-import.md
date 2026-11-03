---
title: Seed Flat Imports
tags: seed, server-component
---

## Seed Flat Imports

Import Seed components by flat name. Dotted access needs `"use client"`, so it cannot be used in a server component. The CI review treats dotted access without `"use client"` as CRITICAL.

**Incorrect (server component):**

```tsx
import { TextField } from "@seed-design/react";

<TextField.Root>
	<TextField.Input />
</TextField.Root>
```

**Correct:**

```tsx
import { TextFieldInput, TextFieldRoot } from "@seed-design/react";

<TextFieldRoot>
	<TextFieldInput />
</TextFieldRoot>
```
