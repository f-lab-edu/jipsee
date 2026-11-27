# backend

backend/에서 코드를 작성하거나 리뷰할 때는 `backend/.claude/skills`의 스킬을 따름.

Gradle 멀티 모듈(`core`, `api`, `batch`)로 구성함. 패키지 루트는 `kr.jipsee`임. core는 도메인 우선(`kr.jipsee.<도메인>`)이고 모듈 접두사를 붙이지 않음. api와 batch는 모듈 접두사를 붙임(`kr.jipsee.api...`, `kr.jipsee.batch...`).

## 모듈

| 모듈 | 두는 것 | 두지 않는 것 |
|---|---|---|
| `core` | 도메인 패키지(`kr.jipsee.<도메인>`)의 `entity`, `dto`(서비스와 리포지토리가 주고받는 데이터), `repository`, `service`, 법정동 사전(`kr.jipsee.region`, `bjd.csv`), `kr.jipsee.global`(업무 개념이 없고 둘 이상의 모듈이 공유하는 코드: `TimeZones`, `exception`의 `BusinessException`, `ErrorCode`, `ErrorKind`). 실행하지 않는 일반 jar. 테스트 공용 코드는 `testFixtures` | 컨트롤러, 응답 dto, `ErrorResponse`, `GlobalExceptionHandler`, Job, 외부 API 클라이언트, spring-web과 배치 의존 |
| `api` | `kr.jipsee.api...`: 컨트롤러, 요청 `dto`(`*Request`)와 응답 `dto`(`*Response`), 요청 검사용 커스텀 제약과 `ConstraintValidator`(`kr.jipsee.api.deal.validation`), 예외 처리(`kr.jipsee.api.exception`의 `ErrorResponse`, `GlobalExceptionHandler`, `ValidationPayload`), 지표 설정. 진입점 `JipseeApiApplication`(`bootJar`) | Job, 외부 API 클라이언트, `DATA_GO_KR_KEY` |
| `batch` | `kr.jipsee.batch...`: Job 단위 패키지(`batch.deal`)의 Job 설정, Reader, Processor, Writer, Tasklet, 공통(`batch.common`)의 `BatchJobRunner`, 외부 API `client`(`batch.deal.client`), 공공데이터 호출 기반(`batch.publicdata`). 진입점 `JipseeBatchApplication`(`bootJar`) | 컨트롤러, 웹 서버 |

- api와 batch는 서로 의존하지 않고 core에만 의존. core는 api와 batch를 import하지 않음
- 어떤 패키지도 두 모듈이 함께 갖지 않음. 진입점 클래스(`JipseeApiApplication`, `JipseeBatchApplication`)와 테스트 루트는 `kr.jipsee`에 위치
- core 서비스의 `Optional`은 빈 결과가 정상 응답인 경우(검색, 배치 조회)에만 사용. 조회 대상이 반드시 있어야 하는 조회는 `BusinessException(ErrorCode.X_NOT_FOUND)`(`kr.jipsee.global.exception`)를 던지고, api의 `GlobalExceptionHandler`가 `ErrorKind`를 HTTP 상태로 변환. 불변 조건 위반은 `IllegalStateException`이며 500으로 응답. 요청 검사(400)는 api 요청 DTO(`*Request` record)의 Bean Validation이 수행하고 컨트롤러는 `@Valid @ModelAttribute`로 바인딩만 함. 제약마다 `payload`로 `kr.jipsee.api.exception.ValidationPayload`의 표식을 지정하면 `GlobalExceptionHandler`가 첫 오류의 payload로 `ErrorCode`를 정하며, payload가 없으면 `VALIDATION_FAILED`, 타입 불일치는 `INVALID_REQUEST`. 검사 순서는 `@GroupSequence`로 지정
- `ErrorCode`는 spring-web에 의존하지 않고 `ErrorKind`를 가짐. `ErrorKind`에서 `HttpStatus`로의 변환은 `GlobalExceptionHandler` 한 곳에서만 수행
- 테스트는 대상 클래스와 같은 모듈에 위치. 컨트롤러 테스트는 api, 서비스와 리포지토리 통합 테스트는 core, Job과 클라이언트 테스트는 batch
- core `testFixtures`의 `application-test.yml`에 batch 전용 공공데이터 키(`jipsee.public-data.api.service-key`)가 있으므로 api 테스트는 `DATA_GO_KR_KEY` 의존을 감지하지 못함
- core 공통 설정 `jipsee-core.yml`은 api와 batch의 `application.yml`이 `spring.config.import`로 가져옴. 프로필별 `jipsee-core-<프로필>.yml`(`dev`, `prod`, 로컬은 gitignore 대상 `jipsee-core-local.yml`)도 함께 로드
- 이미지는 `backend/Dockerfile`의 타깃 `api`, `batch`로 따로 빌드

## 구조

- core 최상위 패키지는 업무 도메인(`deal`, `region`)과 기반 코드 `global`. 코드가 생길 때만 생성. api와 batch 최상위 패키지는 각각 `api`, `batch`
- `batch` 패키지는 Job 단위 하위 패키지(`batch.deal`)와 공통(`batch.common`)으로 구분. Job과 Step 설정, Reader, Processor, Writer, Tasklet, `BatchJobRunner`를 배치. 배치 코드는 core의 `service`와 batch의 `client`를 호출. Job 실행은 Jenkins가 담당하며 앱 내부 스케줄러는 없음
- 도메인 하위 패키지는 클래스가 많을 때만 분리: `controller`(REST 컨트롤러, api), `validation`(커스텀 제약, api), `service`(트랜잭션 경계), `repository`(DB 접근, JdbcTemplate 클래스도 `*Repository`), `client`(외부 API 호출과 응답 변환, batch), `entity`(JPA 엔티티), `dto`, `config`, `exception`. 현재 `deal`은 `dto`, `repository`, `service`로 분리(api의 `deal`은 `controller`, `dto`, `validation`)하고 `region`은 단일 패키지
- `kr.jipsee.global`에는 업무 개념이 없고 둘 이상의 모듈이 공유하는 코드만 배치(`TimeZones`, 예외 기반 `exception`). 한 모듈만 쓰는 기반 코드는 그 모듈의 접두사 패키지에 배치(공공데이터 호출 기반 `kr.jipsee.batch.publicdata`, 예외 처리 `kr.jipsee.api.exception`). 법정동 사전은 `region` 도메인

## 규칙

- 다른 도메인의 리포지토리에 직접 접근하지 않고, 그 도메인의 서비스를 거침.
- 배럴 파일이나 다시 내보내는 방식의 간접 참조를 만들지 않음. 클래스를 정의한 곳에서 바로 import함.
- 커밋하기 전에 `./gradlew build`를 실행하여 검증.
- `rest-api-conventions` 스킬의 예외: 건물 id는 `Long` 대신 `{sigungu_code}-{legal_dong_name}-{lot_number}` 형식의 `String` 자연 키 사용(ADR 0005)
- `rest-api-conventions` 스킬의 예외: 페이지 나눔은 `Pageable` 대신 `page` 쿼리(0부터)와 고정 20건 상수를 사용하고, 한 건 더 조회해 `hasNext` 판정(ADR 0008)

## 스키마

- 스키마 SQL은 `backend/schema`에 둠. 이미 적용한 버전 파일은 고치지 않고 새 버전 파일을 추가함

## 실행과 스키마

@README.md
