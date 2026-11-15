Before writing or reviewing code in frontend/, follow the `code-conventions`, `fsd`, `react-best-practices` and `nextjs` skills in `frontend/.claude/skills`.

## Structure

- FSD layers: `app` > `pages` > `widgets` > `features` > `entities` > `shared`. Imports go downward only, enforced by `.dependency-cruiser.js`.
- Root `app/` is the Next.js routing and also the FSD app layer. Other layers live in `src/`. Keep the empty root `pages/` directory so Next does not read `src/pages` as a Pages Router.
- BFF Route Handlers live in `app/api`. The backend URL comes from the `API_URL` env var via `src/shared/api/apiUrl.ts`.

## Verify

Run in `frontend/` before committing: `pnpm check`, `pnpm lint:boundaries`, `pnpm typecheck`, `pnpm test`.

## Mocks

- The mock session and chat scenario are not source constants. They are read per request from the cookies `jipsee-mock-session` (`KAKAO`, `GOOGLE`, `NAVER`, `none`) and `jipsee-mock-chat` (`normal`, `dailyLimit`, `serverError`, `rateLimit`, `noHistory`), falling back to the env vars `MOCK_SESSION` and `MOCK_CHAT` in `.env.local` (see `.env.example`). Never edit source to switch a mock.
- Production builds (`NODE_ENV=production`) ignore both cookies and env vars: the session is always `null` and the scenario is always `normal` (`src/shared/lib/mock/isMockEnabled.ts`).
- Mock-only types and helpers live next to the mocks in `entities/*/api/`, not in `model/` or `lib/`.
- e2e: `playwright.config.ts` puts the cookies into every browser from `TC_SESSION=in`, `TC_PROVIDER` and `TC_CHAT` (`e2e/support/mockStorageState.ts`), so one dev server serves every mode. Run `TC_SESSION=in pnpm test:e2e <spec>` for the logged-in mode.
