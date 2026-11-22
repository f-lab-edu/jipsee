# Jipsee (집씨)

공공데이터 기반 연립, 다세대 전월세 정보 서비스

## 디렉터리

| 경로 | 내용 |
|---|---|
| `backend/` | Spring Boot |
| `frontend/` | Next.js |
| `infra/` | Docker Compose, nginx, 관측 설정 |
| `docs/` | 기획서, 기술 명세 |
| `scripts/` | 커밋 제목 검사 스크립트 |
| `lefthook.yml` | Git 훅 설정(pre-commit, commit-msg) |
| `.github/` | 워크플로우, PR 템플릿, 리뷰 규칙 |

## 문서

- [기획서(PRD)](docs/prd.md)
- [기술 명세](docs/tech-spec.md)
- [백엔드](backend/README.md)
- [운영 서버 실행](infra/README.md)

## 개발 환경

- Git 훅 설치(저장소 루트): `lefthook install`
- 프론트엔드(`frontend/`, pnpm): 환경 변수는 `.env.example` 참고
- 설치와 개발 서버: `pnpm install`, `pnpm dev`
- 검증: `pnpm check`, `pnpm lint:boundaries`, `pnpm typecheck`, `pnpm build`

## 커밋

- 형식: Conventional Commits(`type: 제목`)
- 검사: lefthook `commit-msg`와 GitHub Actions `commit-check`가 `scripts/check-commit-subject.sh` 실행

## PR

- 자동 실행: `frontend-ci`(Biome, 레이어 경계, 타입, 빌드), `commit-check`, `claude-review`
- `claude-review`: `frontend/`만 변경되고 CRITICAL 항목이 없으면 자동 승인
