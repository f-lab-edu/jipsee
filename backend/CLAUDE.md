# backend

Before writing or reviewing code in backend/, follow the skills in `backend/.claude/skills` unless this file says otherwise.

## Overrides (take precedence over skills)

- No Lombok.
- Entity ids are `BIGINT` (`Long`), not UUID.
- No response wrapper (no `ApiResponse`). Return the body directly; errors use Problem Details (RFC 9457).
- No Flyway or migrations in this repo, including Spring Batch tables. See Schema section.
- Use Spring Boot 4 APIs. Where a skill shows Boot 3 code (e.g. `TestRestTemplate`), use the Boot 4 equivalent.

Spring Boot single module. Package root `kr.jipsee`, package-by-domain.

## Structure

- Domain packages live under `kr.jipsee` (building, deal, matching, collect, common). Create one only when it has code.
- Each domain uses `controller`, `service`, `repository`, `domain` subpackages as needed.

## Rules

- Never access another domain's repository. Go through its service.
- No barrel files or re-export-style indirection. Import directly from the defining class.
- Run `./gradlew build` before committing.

## Local run

- DB: `docker compose -f backend/compose.yaml up -d mysql`
- Schema: see Schema section
- App: `cd backend && ./gradlew bootRun`
- The frontend BFF calls `${API_URL}/actuator/health` (`API_URL` defaults to http://localhost:8080 in `frontend/.env.example`).

## Schema

- No SQL or migrations in this repo. Schema SQL lives in `$SCHEMA_DIR` (outside the repo), applied by the `flyway` service in `backend/compose.schema.yaml`.
- Spring does not migrate. Entities are checked with `ddl-auto: validate`.
- Apply schema (after `up -d mysql`): `SCHEMA_DIR=<schema folder> docker compose -f backend/compose.yaml -f backend/compose.schema.yaml run --rm flyway`
- Start app after schema is applied: `cd backend && ./gradlew bootRun`
