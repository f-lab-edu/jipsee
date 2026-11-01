Before writing or reviewing code in frontend/, follow the `code-conventions`, `fsd`, `react-best-practices` and `nextjs` skills in `frontend/.claude/skills`.

## Structure

- FSD layers: `app` > `pages` > `widgets` > `features` > `entities` > `shared`. Imports go downward only, enforced by `.dependency-cruiser.js`.
- Root `app/` is the Next.js routing and also the FSD app layer. Other layers live in `src/`. Keep the empty root `pages/` directory so Next does not read `src/pages` as a Pages Router.
- BFF Route Handlers live in `app/api`. The backend URL comes from the `API_URL` env var via `src/shared/api/apiUrl.ts`.

## Verify

Run in `frontend/` before committing: `pnpm check`, `pnpm lint:boundaries`, `pnpm typecheck`, `pnpm test`.
