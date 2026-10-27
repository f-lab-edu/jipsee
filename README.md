# Jipsee (집씨)

공공데이터를 가져와 화면과 챗봇으로 그대로 보여주는 연립, 다세대 전세 정보 서비스

## 개요

- 대상: 연립, 다세대 전세 세입(희망)자 (전국, 아파트와 오피스텔 제외)
- 데이터: 국토교통부 실거래가, 건축HUB 건축물대장, 법제처 법령
- 기능: 건물 검색, 건물 거래 이력, 주변 전세 거래 조회, 법령 기반 챗봇
- 핵심 과제: 실거래와 건축물대장의 건물 매칭, 데이터 정합성

## 표시 원칙

- 원본 데이터만 표시. 계산, 통계, 추정값 없음
- 임의의 판단, 결론 문구 절대 금지
- 모든 수치에 출처와 기준일 표시

## 기술 스택

| 영역       | 선택                                                         |
| ---------- | ------------------------------------------------------------ |
| 백엔드     | Java 25, Spring Boot 4.1, Spring Batch 6, Spring AI 2.0      |
| 프론트엔드 | Next.js 16 (App Router), TypeScript, Seed Design, FSD, Biome |
| 데이터     | MySQL 8.4, Redis 8.2                                         |
| 인프라     | Oracle A1, Docker Compose, nginx, Cloudflare, GitHub Actions |

## 디렉터리 구조

```
jipsee/
├── backend/     Spring Boot
├── frontend/    Next.js
├── infra/       Docker Compose, nginx, 관측 설정
├── docs/        기획서, 기술 명세
├── scripts/     커밋 제목 검사
├── lefthook.yml Git 훅 (pre-commit, commit-msg)
└── .github/     워크플로우, PR 템플릿, 리뷰 규칙
```

## 문서

- [기획서 (PRD)](docs/prd.md)
- [기술 명세](docs/tech-spec.md)

## 개발 환경

- Git 훅 설치: `lefthook install` (루트)
- 프론트엔드 (`frontend/`, pnpm)
  - 환경 변수: `.env.example` 참고
  - `pnpm install`, `pnpm dev`
  - 검증: `pnpm check`, `pnpm lint:boundaries`, `pnpm typecheck`, `pnpm build`

## 커밋 컨벤션

Conventional Commits 형식 (`type: 제목`)

- lefthook `commit-msg`와 GitHub Actions `commit-check`가 같은 스크립트(`scripts/check-commit-subject.sh`)로 검사

## PR

- PR 생성 시 `frontend-ci`(Biome, 레이어 경계, 타입, 빌드), `commit-check`, `claude-review` 실행
- `claude-review`: Claude 코드 리뷰, `frontend/`만 변경되고 CRITICAL이 없으면 자동 승인
