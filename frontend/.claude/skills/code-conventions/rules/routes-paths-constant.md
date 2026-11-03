---
title: Route Paths from paths
tags: routing, link
---

## Route Paths from paths

Take every route path from `paths` in `src/shared/routes/paths.ts`. Do not hardcode `href` strings. Add a path there when a link to it is first needed.

**Incorrect:**

```tsx
<Link href="/login">로그인</Link>
```

**Correct:**

```tsx
import { paths } from "@/shared/routes/paths";

<Link href={paths.login}>로그인</Link>
```
