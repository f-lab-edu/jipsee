---
title: Nullable<T> Instead of T | null
tags: typescript, types
---

## Nullable<T> Instead of T | null

Write nullable types with `Nullable<T>` from `src/shared/lib/utilityTypes/nullable.ts`.

**Incorrect:**

```ts
export async function getSession(): Promise<Session | null> {}
```

**Correct:**

```ts
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

export async function getSession(): Promise<Nullable<Session>> {}
```
