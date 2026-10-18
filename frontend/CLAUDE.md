Before writing or reviewing code in frontend/, follow the `react-best-practices` and `nextjs` skills in `frontend/.claude/skills`.

## Structure

- FSD layers: `app` > `pages` > `widgets` > `features` > `entities` > `shared`. Imports go downward only, enforced by `.dependency-cruiser.js`.
- Root `app/` is the Next.js routing and also the FSD app layer. Other layers live in `src/`. Keep the empty root `pages/` directory so Next does not read `src/pages` as a Pages Router.
- BFF Route Handlers live in `app/api`. The backend URL comes from the `API_URL` env var via `src/shared/api/apiUrl.ts`.

## Rules

- No barrel files (`index.ts`) and no re-exports. Import from each file directly.
- Components use `export default function`. File names under `src/**/ui/` are PascalCase, other files in `src` are camelCase.
- Seed Design: import flat names (`TextFieldRoot`). Dotted access (`TextField.Root`) needs `"use client"`.
- Biome only for lint and format (tabs). No ESLint or Prettier.

## Verify

Run in `frontend/` before committing: `pnpm check`, `pnpm lint:boundaries`, `pnpm typecheck`.
