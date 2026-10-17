# Jipsee (집씨)

공공데이터를 가져와 화면과 챗봇으로 그대로 보여주는 연립, 다세대 전세 정보 서비스

## 개요

- 대상: 연립, 다세대 전세 세입(희망)자 (전국, 아파트와 오피스텔 제외)
- 데이터: 국토교통부 실거래가, 건축HUB 건축물대장, 법제처 법령과 판례
- 기능: 건물 검색, 건물 거래 이력, 주변 전세 거래 조회, 법령 기반 챗봇
- 핵심 과제: 실거래와 건축물대장의 건물 매칭, 데이터 정합성

## 표시 원칙

- 원본 데이터만 표시. 계산, 통계, 추정값 없음
- 임의의 판단, 결론 문구 절대 금지
- 모든 수치에 출처와 기준일 표시

## 기술 스택

| 영역   | 선택                                                         |
| ------ | ------------------------------------------------------------ |
| 백엔드 | Java 25, Spring Boot 4.1, Spring Batch 6, Spring AI 2.0      |
| 프론트 | Next.js 16, TypeScript                                       |
| 데이터 | MySQL 8.4, Redis 8.2                                         |
| 인프라 | Oracle A1, Docker Compose, nginx, Cloudflare, GitHub Actions |

## 디렉터리 구조

```
jipsee/
├── backend/     Spring Boot
├── frontend/    Next.js
├── infra/       Docker Compose, nginx, 관측 설정
├── docs/        기획서, 기술 명세
└── .github/workflows/
```

## 문서

- [기획서 (PRD)](docs/prd.md)
- [기술 명세](docs/tech-spec.md)

## 커밋 컨벤션

Conventional Commits 형식 (`type: 제목`)
