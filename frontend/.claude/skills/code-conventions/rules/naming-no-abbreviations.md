---
title: No Abbreviations in Names
tags: naming
---

## No Abbreviations in Names

Name variables, parameters, properties, and URL search params with full words, never abbreviations or single letters (e.g. `q`, `idx`, `btn`, `res`, `e`).

**Incorrect:**

```tsx
const { q } = await searchParams;

<TextFieldRoot name="q" />
```

**Correct:**

```tsx
const { keyword } = await searchParams;

<TextFieldRoot name="keyword" />
```
