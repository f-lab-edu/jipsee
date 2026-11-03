---
title: No Barrel Files or Re-exports
tags: imports, file
---

## No Barrel Files or Re-exports

Do not create `index.ts` files that re-export, and do not re-export from any file. Import from each file directly. Biome (`noBarrelFile`, `noReExportAll`) also reports this.

**Incorrect:**

```ts
// widgets/header/index.ts
export { default as Header } from "./ui/Header";
```

**Correct:**

```ts
import Header from "@/widgets/header/ui/Header";
```
