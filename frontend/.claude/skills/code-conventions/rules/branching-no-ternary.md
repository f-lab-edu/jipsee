---
title: No Ternary for Either/Or Branches
tags: branching, readability
---

## No Ternary for Either/Or Branches

Avoid ternary operators. For an either/or render, extract a function or component and use early return.

**Incorrect:**

```tsx
{session ? <Link href={paths.me}>내 정보</Link> : <Link href={paths.login}>로그인</Link>}
```

**Correct:**

```tsx
export default function AccountLink({ session }: AccountLinkProps) {
	if (session) {
		return <Link href={paths.me}>내 정보</Link>;
	}

	return <Link href={paths.login}>로그인</Link>;
}
```
