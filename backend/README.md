# backend

Spring Boot 4, Java 25, MySQL 8.4

## 로컬 실행

저장소 루트에서 실행

- API: `./backend/local.sh api`
- 배치: `DATA_GO_KR_KEY=<공공데이터포털 인코딩 키> ./backend/local.sh batch <Job 이름>`
- 스크립트 순서: DB 실행, 스키마 적용, `core/src/main/resources/jipsee-core-local.yml` 생성(없을 때만 example 복사), 앱 실행
- 기본 프로필은 `local`. `dev`, `prod`는 `SPRING_PROFILES_ACTIVE`, `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` 필요

## 스키마

- 위치는 `backend/schema`, 적용은 `backend/compose.schema.yaml`의 `flyway` 서비스. 다른 폴더는 `SCHEMA_DIR`로 지정
- 적용된 버전 파일은 수정 금지. 변경은 새 파일 `V<번호>__<이름>.sql`로 추가
- 각 모듈의 `src/main/resources`에는 SQL 배치 금지
- Spring은 마이그레이션을 실행하지 않음. 엔티티는 `ddl-auto: validate`로 검증

## 검증

- 빌드(Docker 실행 필요): `cd backend && ./gradlew build`
- 테스트는 Testcontainers MySQL에 `backend/schema`의 SQL을 Flyway로 적용한 뒤 실행. 다른 폴더는 `SCHEMA_DIR=<스키마 폴더 절대 경로>`로 지정

운영 실행은 `infra/README.md` 참고
