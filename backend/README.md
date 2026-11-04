# backend

Spring Boot 4, Java 25, MySQL 8.4

## 로컬 실행

명령은 저장소 루트에서 실행함

1. DB 실행: `docker compose -f backend/compose.yaml up -d mysql`
2. 스키마 적용: `SCHEMA_DIR=<스키마 폴더> docker compose -f backend/compose.yaml -f backend/compose.schema.yaml run --rm flyway`
3. 앱 실행: `cd backend && ./gradlew bootRun`

프론트엔드 BFF는 `${API_URL}/actuator/health`를 호출함

## 스키마

- 이 저장소에는 SQL과 마이그레이션을 두지 않음. 스키마 SQL은 저장소 밖의 `$SCHEMA_DIR`에 있고, `backend/compose.schema.yaml`의 `flyway` 서비스가 적용함
- Spring은 마이그레이션을 실행하지 않음. 엔티티는 `ddl-auto: validate`로 검증함

## 검증

Docker를 실행한 상태에서 `cd backend && SCHEMA_DIR=<스키마 폴더 절대 경로> ./gradlew build`

테스트는 Testcontainers MySQL에 `SCHEMA_DIR`의 SQL을 Flyway로 적용한 뒤 실행함
