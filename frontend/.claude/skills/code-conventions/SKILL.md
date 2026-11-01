---
name: code-conventions
description: Use when writing or reviewing any TypeScript or TSX file under frontend/src or frontend/app (components, props, branching, links, nullable types, imports, file names, Seed usage).
---

# Code conventions for Jipsee frontend

Read the rule file for each item the change touches. Lint and format are Biome only (tabs), no ESLint or Prettier.

| Rule | File |
|---|---|
| One function per file (component, hook, or function) | `rules/one-function-per-file.md` |
| Props as `<Component>Props` interface above the component | `rules/component-props-interface.md` |
| No abbreviations in names | `rules/naming-no-abbreviations.md` |
| No ternary for either/or branches | `rules/branching-no-ternary.md` |
| Route paths from `paths` | `rules/routes-paths-constant.md` |
| `Nullable<T>` instead of `T \| null` | `rules/types-nullable.md` |
| No barrel files or re-exports | `rules/imports-no-barrel.md` |
| File naming | `rules/files-naming.md` |
| Seed flat imports | `rules/seed-flat-import.md` |
| Seed components and tokens first, global base in app/theme.css | `rules/styles-seed-first.md` |
| Test names in Korean, colocated test files | `rules/tests-korean-names.md` |
