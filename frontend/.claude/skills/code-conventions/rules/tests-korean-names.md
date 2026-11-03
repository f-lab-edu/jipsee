---
title: Test Names in Korean
tags: test, naming
---

## Test Names in Korean

Place test files next to the file they test as `<File>.test.ts(x)`. Write `it` names as Korean sentences that keep particles and end in noun form (`-함`).

Test only logic and branches. Do not test values a mock returns as is, or behavior a child component's own test already covers.

Run tests with `pnpm test` (Vitest, jsdom, Testing Library). CI runs it in `frontend-ci`.

A new test must be shown to fail: break the target code on purpose, run the test, confirm it fails, then restore.

Seed components import CSS, so `vitest.config.ts` inlines `@seed-design` (`server.deps.inline`). Keep it when editing the config.

**Incorrect:**

```ts
it("returns the trimmed string", () => {});
it("문자열_trim_반환", () => {});
```

**Correct:**

```ts
it("문자열이면 앞뒤 공백을 제거해 반환함", () => {});
```
