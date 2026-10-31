# backend

backend/에서 코드를 작성하거나 리뷰할 때는 `backend/.claude/skills`의 스킬을 따름.

Spring Boot 단일 모듈로 구성함. 패키지 루트는 `kr.jipsee`이고, 도메인별로 패키지를 나눔.

## 구조

- 도메인 패키지는 `kr.jipsee` 아래에 둠(building, deal, matching, collect, global). 코드가 생길 때만 만듦.
- 도메인 패키지마다 필요한 만큼 `api`, `application`, `dao`, `domain`, `dto` 하위 패키지를 둠.
- 예외 처리기, 기본 엔티티, 설정처럼 여러 도메인이 함께 쓰는 코드는 `kr.jipsee.global`에 둠.

## 규칙

- 다른 도메인의 리포지토리에 직접 접근하지 않고, 그 도메인의 서비스를 거침.
- 배럴 파일이나 다시 내보내는 방식의 간접 참조를 만들지 않음. 클래스를 정의한 곳에서 바로 import함.
- 커밋하기 전에 `./gradlew build`를 실행하여 검증.

## 실행과 스키마

@README.md
