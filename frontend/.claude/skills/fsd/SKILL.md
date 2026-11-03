---
name: fsd
description: Use when deciding where frontend code goes (which FSD layer, slice, or segment), when creating new folders or files under frontend/src, or when reviewing whether a change fits Feature-Sliced Design.
---

# FSD placement for Jipsee frontend

`.dependency-cruiser.js` already enforces import direction, cross-slice imports, segment names (`ui`, `api`, `model`, `lib`, `config`) and the ban on `shared/types`. This skill covers the calls a regex cannot make.

## Layer

| Layer | Put here | Example |
|---|---|---|
| `app/` (root) | Routing files, root layout, global CSS, BFF Route Handlers (`app/api`). Keep route files thin: import the page and pass params | `app/page.tsx` |
| `pages` | One slice per screen. Composes widgets, features, entities and calls adapters | `pages/home` |
| `widgets` | Large UI blocks reused across screens, built from features and entities | `widgets/header`, `widgets/footer` |
| `features` | A user action: something the user does | `features/searchBuildings`, `features/askChatbot` |
| `entities` | A thing the backend owns: its screen contract type, adapter, and display of one item | `entities/building`, `entities/session` |
| `shared` | No domain knowledge. API base URL, generic helpers and types | `shared/api/apiUrl.ts`, `shared/lib/utilityTypes/nullable.ts` |

Deciding between entity and feature: a noun the backend returns is an entity. A verb the user performs is a feature.

Two slices on the same layer need each other: move the shared part down a layer, or compose both in a higher layer. Do not import across.

## Scope

The frontend only displays what the backend returns. Data and business rules (search matching, query length limits, which building's value to show, computed fields) belong to the backend. Until the backend exists, the mock adapter in `api/` plays that role. `ui/` handles only display cases such as null.

## Route groups

Screens that share a header or layout go in one Next.js route group with its own `layout.tsx` (e.g. `app/(home)/layout.tsx` renders Header and Footer for S1). Screens with a different header (back-button header in S2~S6) get their own route group later. Route groups do not change URLs.

## Segment

| Segment | Put here |
|---|---|
| `ui` | Components |
| `api` | Adapter functions that fetch data, backend DTO types, DTO-to-contract mappers, mock data (`<name>Mock.ts`) |
| `model` | Screen contract types, client state |
| `lib` | Helpers used only inside the slice |
| `config` | Constants and flags for the slice (e.g. `widgets/footer/config/footerLinks.ts`) |

- `ui` imports contract types from `model` only. It never imports DTO types from `api`.
- A backend change touches only `api`. If it forces a `ui` change, the contract type in `model` was shaped after the backend instead of the screen.

## shared

- `shared/lib/<purpose>/`, one folder per purpose (`utilityTypes`, `dates`). No catch-all `utils` or `types`.
- `Nullable<T>` lives in `shared/lib/utilityTypes/nullable.ts`. Do not write `T | null`.

## Do not

- Create a slice or segment before there is code for it.
- Name a segment by what the code is (`types`, `hooks`, `components`, `server`). Name it by purpose.

## Sources

- https://feature-sliced.design/docs/reference/layers
- https://feature-sliced.design/docs/reference/slices-segments
- https://feature-sliced.design/docs/guides/examples/types
