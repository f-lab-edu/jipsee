# infra

실거래 수집 배치를 운영 서버에서 Docker Compose로 실행함. 이미지는 레지스트리 없이 서버에 직접 올림

## 서버 폴더 구성

- `compose.yaml`: `compose.yaml`(앱, 프로젝트 `jipsee`)
- `db/compose.yaml`: `db/compose.yaml`(MySQL과 Flyway, 프로젝트 `jipsee-db`)
- `db/schema/`: 스키마 SQL (저장소에 두지 않음)
- `.env`: `MYSQL_ROOT_PASSWORD`, `DB_USERNAME`, `DB_PASSWORD`, `DATA_GO_KR_KEY`. 두 Compose가 공유. 하나라도 빈 값이면 실행되지 않음

## 실행

1. 이미지 빌드(저장소 루트): `docker build --platform linux/arm64 -t jipsee-backend:latest backend`. 운영 서버가 ARM64라 플랫폼을 지정함
2. 이미지 옮기기: `docker save jipsee-backend:latest | gzip | ssh <서버> 'gunzip | docker load'`
3. 서버 접속: `ssh <서버>`. 이후 명령은 `compose.yaml`과 `.env`가 있는 `/opt/jipsee`에서 실행함(`cd /opt/jipsee`)
4. DB 실행: `docker compose -f db/compose.yaml --env-file .env up -d mysql`. 앱이 붙는 네트워크 `jipsee-db`도 이때 만들어짐
5. 스키마 적용: `docker compose -f db/compose.yaml --env-file .env --profile schema run --rm flyway`
6. 앱 실행: `docker compose up -d app`. 이미지만 바꿀 때는 `docker compose up -d --no-deps app`. DB가 내려가 있으면 앱은 재시작을 반복하며 기다림

### 포트

- 앱: `127.0.0.1:8090`
- MySQL: `127.0.0.1:3307`
- DB Tool: `127.0.0.1:3307` (SSH)
