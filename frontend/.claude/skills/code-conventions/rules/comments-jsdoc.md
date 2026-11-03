---
title: One-Line JSDoc on Exported Functions and Components
tags: comments, jsdoc
---

## One-Line JSDoc on Exported Functions and Components

Put a one-line JSDoc directly above every exported function and component, including route files (`page.tsx`, `layout.tsx`, `route.ts`). Say what it does or shows, not how, in a Korean sentence ending in `-함`. Mention the important branch if there is one. Do not write `@param` or `@returns`; the TypeScript types already say that. Skip test files, type-only files, constants, mock data, and config files.

**Incorrect:**

```tsx
export default function AccountLink({ session }: AccountLinkProps) {}
```

```tsx
/**
 * 계정 링크
 * @param session 세션
 * @returns 링크
 */
export default function AccountLink({ session }: AccountLinkProps) {}
```

**Correct:**

```tsx
/** 로그인했으면 내 정보 링크를, 아니면 로그인 링크를 표시함 */
export default function AccountLink({ session }: AccountLinkProps) {}
```
