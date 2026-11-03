---
title: File Naming
tags: file, naming
---

## File Naming

Files under `src/**/ui/` are PascalCase. Other files in `src` are camelCase. Biome (`useFilenamingConvention`) enforces this.

**Incorrect:**

```
src/widgets/header/ui/header.tsx
src/entities/session/api/get-session.ts
```

**Correct:**

```
src/widgets/header/ui/Header.tsx
src/entities/session/api/getSession.ts
```
