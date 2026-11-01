---
title: JSDoc on Exported Functions and Components
tags: comments, jsdoc
---

## JSDoc on Exported Functions and Components

Put a JSDoc directly above every exported function and component, including route files (`page.tsx`, `layout.tsx`, `route.ts`). Skip test files, type-only files, constants, mock data, and config files.

- The first line is a summary: what it does or shows, not how, in a Korean sentence ending in `-함`. Mention the important branch if there is one.
- When the summary is not enough, add a description paragraph after a blank line.
- Add `@param` or `@returns` only when the TypeScript type does not tell the meaning (a condition, a unit, when it returns `null`). Do not write a tag that only repeats the name or the type.
- Write a JSDoc with only a summary on one line (`/** ... */`).

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

```ts
/**
 * 검색어로 건물 목록을 가져옴
 *
 * @param keyword 2자 이상일 때만 요청함
 * @returns 검색어가 없으면 null
 */
export async function searchBuildingsIfPresent(keyword: Nullable<string>) {}
```
