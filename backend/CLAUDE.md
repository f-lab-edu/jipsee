# backend

backend/에서 코드를 작성하거나 리뷰할 때는 `backend/.claude/skills`의 스킬을 따름.

Gradle 멀티 모듈(`core`, `api`, `batch`)로 구성함. 패키지 루트는 `kr.jipsee`이고, 도메인별로 패키지를 나눔.

## 모듈

- `core`: 도메인 코드의 `dto`, `repository`, `service`, `global/common`, 법정동 사전. 실행하지 않는 일반 jar이고 api와 batch가 의존함. 테스트 공용 코드는 `testFixtures`
- `api`: 웹 서버(`bootJar`). 컨트롤러, 예외 처리(`global/core/exception`), 지표
- `batch`: Job 실행(`bootJar`). `batch/*` 패키지, 공공데이터 클라이언트(`*/client`, `global/publicdata`), 러너
- api와 batch는 서로 의존하지 않고 core에만 의존함. core는 api와 batch를 import하지 않음
- 이미지는 `backend/Dockerfile`의 타깃 `api`, `batch`로 따로 빌드함

## 구조

- 최상위 패키지는 업무 도메인(`deal`, `building`, `region`, 이후 `matching`, `law` 등), 진입점 `batch`, 기반 코드 `global`임. 코드가 생길 때만 만듦.
- `batch` 모듈의 최상위 패키지 `batch`는 Job 단위 하위 패키지(`batch/deal`, `batch/building`)와 공통(`batch/common`)으로 나누고, Job과 Step 설정, Reader, Processor, Writer, Tasklet, 스케줄러를 둠. 배치 코드는 core의 `service`와 batch의 `client`를 부름.
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
