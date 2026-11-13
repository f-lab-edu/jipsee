# infra

실거래 수집 배치를 운영 서버에서 Docker Compose로 실행함. 이미지는 레지스트리 없이 서버에 직접 올림

## 서버 폴더 구성

- `compose.yaml`: 이 폴더의 `compose.yaml`
- `.env`: `MYSQL_ROOT_PASSWORD`, `DB_USERNAME`, `DB_PASSWORD`, `DATA_GO_KR_KEY`. 하나라도 비면 실행되지 않음
- `schema/`: 스키마 SQL(저장소에 두지 않음)

## 실행

1. 이미지 빌드(저장소 루트): `docker build -t jipsee-backend:latest backend`
2. 이미지 옮기기: `docker save jipsee-backend:latest | gzip | ssh <서버> 'gunzip | docker load'`
3. DB 실행: `docker compose up -d mysql`
4. 스키마 적용: `docker compose --profile schema run --rm flyway`
5. 앱 실행: `docker compose up -d app`. 이미지만 바꿀 때는 `docker compose up -d --no-deps app`

앱은 `127.0.0.1:8090`, MySQL은 `127.0.0.1:3307`에만 열림. DB 도구는 SSH 터널로 `127.0.0.1:3307`에 접속함
