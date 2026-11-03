---
title: JSDoc on Exported Functions and Components
tags: comments, jsdoc
---

## JSDoc on Exported Functions and Components

Put a JSDoc directly above every exported function and component, including route files (`page.tsx`, `layout.tsx`, `route.ts`). Skip test files, type-only files, constants, mock data, and config files.

- The summary line names what it is as `<area> > <name>` (just the name if it is top-level), for example `헤더 > 내 정보 영역`. Keep it short, with no sentence ending.
- If there are branches, conditions, or a non-obvious behavior, add a blank ` *` line, then `- ` bullets. Each bullet is a short phrase ending in a noun form such as `출력`, `전달`, `반환`, `조회`. Keep the particles. Do not use stiff shorthand: write `출력하지 않음`, not `미출력`.
- If there are no branches and nothing non-obvious, write a one-line `/** ... */`.
- Add `@param` or `@returns` only when the TypeScript type does not tell the meaning (a condition, a unit, when it returns `null`). Tags follow the bullets after a blank ` *` line. Do not write a tag that only repeats the name or the type, and do not repeat a bullet in a tag.

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
/**
 * 헤더 > 내 정보 영역
 *
 * - 로그인 시 내 정보 출력
 * - 비로그인 시 로그인 경로 출력
 *
 * @param variant 모바일은 텍스트 링크, 데스크톱은 외곽선 버튼 모양
 */
export default function AccountLink({ session, variant }: AccountLinkProps) {}
```

```tsx
/** 헤더 > 로고 심볼 */
export default function LogoSymbol({ size }: LogoSymbolProps) {}
```
