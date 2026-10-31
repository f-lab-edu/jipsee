# Jipsee (집씨)

공공데이터를 가져와 화면과 챗봇으로 그대로 보여주는 연립, 다세대 전월세 정보 서비스

## 디렉터리 구조

```
jipsee/
├── backend/     Spring Boot
├── frontend/    Next.js
├── infra/       Docker Compose, nginx, 관측 설정
├── docs/        기획서, 기술 명세
├── scripts/     커밋 제목 검사 스크립트
├── lefthook.yml Git 훅 설정 (pre-commit, commit-msg)
└── .github/     워크플로우, PR 템플릿, 리뷰 규칙
```

## 문서

- [기획서 (PRD)](docs/prd.md)
- [기술 명세](docs/tech-spec.md)

## 개발 환경

- Git 훅 설치: 저장소 루트에서 `lefthook install` 실행
- 백엔드: [backend/README.md](backend/README.md)를 참고
- 프론트엔드 (`frontend/`에서 pnpm 사용)
  - 환경 변수: `.env.example`을 참고
  - 설치와 개발 서버 실행: `pnpm install`, `pnpm dev`
  - 검증 실행: `pnpm check`, `pnpm lint:boundaries`, `pnpm typecheck`, `pnpm build`

## 커밋 컨벤션

Conventional Commits 형식(`type: 제목`)을 따름

- lefthook `commit-msg`와 GitHub Actions `commit-check`가 같은 스크립트(`scripts/check-commit-subject.sh`)로 커밋 제목을 검사함

## PR

- PR을 생성하면 `frontend-ci`(Biome, 레이어 경계, 타입, 빌드), `commit-check`, `claude-review`가 실행됨
- `claude-review`: Claude가 코드를 리뷰하며, `frontend/`만 변경되고 CRITICAL 항목이 없으면 자동으로 승인함
