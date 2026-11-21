# backend

Spring Boot 4, Java 25, MySQL 8.4

## 로컬 실행

명령은 저장소 루트에서 실행함

- API: `./backend/local.sh api`
- 배치: `DATA_GO_KR_KEY=<공공데이터포털 인코딩 키> ./backend/local.sh batch <Job 이름>`

스크립트가 DB 실행, 스키마 적용, `core/src/main/resources/jipsee-core-local.yml` 생성(없을 때만 example 복사), 실행을 차례로 함

프로필을 지정하지 않으면 `local`로 실행함. `dev`, `prod`는 `SPRING_PROFILES_ACTIVE`와 `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`가 필요함

프론트엔드 BFF는 `${API_URL}/actuator/health`를 호출함

## 스키마

- 스키마 SQL은 `backend/schema`에 있고, `backend/compose.schema.yaml`의 `flyway` 서비스가 적용함. `SCHEMA_DIR`을 지정하면 다른 폴더를 씀
- 이미 적용한 버전 파일은 고치지 않음. 변경은 새 버전 파일(`V<번호>__<이름>.sql`)로 추가함
- 각 모듈의 `src/main/resources`에는 SQL을 두지 않음. Spring이 읽지 않게 하기 위함
- Spring은 마이그레이션을 실행하지 않음. 엔티티는 `ddl-auto: validate`로 검증함

## 검증

Docker를 실행한 상태에서 `cd backend && ./gradlew build`

테스트는 Testcontainers MySQL에 `backend/schema`의 SQL을 Flyway로 적용한 뒤 실행함. 다른 폴더를 쓰려면 `SCHEMA_DIR=<스키마 폴더 절대 경로>`를 지정함

운영 실행은 `infra/README.md`를 따름
