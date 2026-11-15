# backend

backend/에서 코드를 작성하거나 리뷰할 때는 `backend/.claude/skills`의 스킬을 따름.

Spring Boot 단일 모듈로 구성함. 패키지 루트는 `kr.jipsee`이고, 도메인별로 패키지를 나눔.

## 구조

- 최상위 패키지는 업무 도메인(`deal`, `building`, `region`, 이후 `matching`, `law` 등), 진입점 `batch`, 기반 코드 `global`임. 코드가 생길 때만 만듦.
- `batch`는 Job 단위 하위 패키지(`batch/deal`, `batch/building`)와 공통(`batch/common`)으로 나누고, Job과 Step 설정, Reader, Processor, Writer, Tasklet, 스케줄러를 둠. 배치 코드는 도메인의 `service`와 `client`를 부름.
- 도메인 하위 패키지는 필요한 것만 둠: `controller`(REST 컨트롤러), `service`(트랜잭션 경계), `repository`(DB 접근, JdbcTemplate 클래스도 `*Repository`), `client`(외부 API 호출과 응답 변환), `entity`(JPA 엔티티), `dto`, `config`, `exception`.
- `global`에는 업무 개념이 없는 기반 코드만 둠(공공데이터 호출 기반, 예외 처리, 공통 상수). 법정동 사전은 `region` 도메인임.

## 규칙

- 다른 도메인의 리포지토리에 직접 접근하지 않고, 그 도메인의 서비스를 거침.
- 배럴 파일이나 다시 내보내는 방식의 간접 참조를 만들지 않음. 클래스를 정의한 곳에서 바로 import함.
- 커밋하기 전에 `./gradlew build`를 실행하여 검증.

## 스키마

- 스키마 SQL은 `backend/schema`에 둠. 이미 적용한 버전 파일은 고치지 않고 새 버전 파일을 추가함

## 실행과 스키마

@README.md
