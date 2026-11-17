# infra

실거래 수집 배치를 운영 서버에서 Docker Compose로 실행함. 이미지는 레지스트리 없이 서버에 직접 올림

## 서버 폴더 구성

### Compose 파일

- `compose.yaml`: `compose.yaml`(앱, 프로젝트 `jipsee`)
- `db/compose.yaml`: `db/compose.yaml`(MySQL과 Flyway, 프로젝트 `jipsee-db`)
- `fluent-bit/fluent-bit.conf`: 이 폴더의 `fluent-bit/fluent-bit.conf`

### 데이터 폴더

#### DB

- `db/schema/`: 스키마 SQL (저장소에 두지 않음)

#### 앱 로그

- `/var/log/jipsee/app`: 앱 로그 폴더
  - 컨테이너의 `/app/logs`에 마운트함
  - 소유자 1000, 그룹 `ubuntu`, 모드 775로 미리 만들어 둠(컨테이너 uid가 1000)

#### fluent-bit

- `/var/lib/jipsee/fluent-bit`: fluent-bit 상태 폴더
  - `tail.db`: SQLite 파일, `jipsee.log`를 읽은 위치를 기록함
  - `s3/`: 업로드 전 로그를 임시 저장함

### 환경 변수

- `.env`: 두 Compose가 공유. 하나라도 빈 값이면 실행되지 않음

#### DB

- `MYSQL_ROOT_PASSWORD`
- `DB_USERNAME`
- `DB_PASSWORD`

#### 앱

- `DATA_GO_KR_KEY`

#### 로그 업로드

- `LOGS_S3_ENDPOINT`
- `LOGS_S3_ACCESS_KEY_ID`
- `LOGS_S3_SECRET_ACCESS_KEY`

## 실행

### 1. 이미지 준비

#### 빌드

- 저장소 루트에서 `docker build --platform linux/arm64 -t jipsee-backend:latest backend`
- 운영 서버가 ARM64라 플랫폼을 지정함

#### 서버로 옮기기

- `docker save jipsee-backend:latest | gzip | ssh <서버> 'gunzip | docker load'`

### 2. 서버 접속

- `ssh <서버>`
- 이후 명령은 `compose.yaml`과 `.env`가 있는 `/opt/jipsee`에서 실행함(`cd /opt/jipsee`)

### 3. DB

#### DB 실행

- `docker compose -f db/compose.yaml --env-file .env up -d mysql`
- 앱이 붙는 네트워크 `jipsee-db`도 이때 만들어짐

#### 스키마 적용

- `docker compose -f db/compose.yaml --env-file .env --profile schema run --rm flyway`

### 4. 앱 실행

- `docker compose up -d app`
- 이미지만 바꿀 때는 `docker compose up -d --no-deps app`
- DB가 내려가 있으면 앱은 재시작을 반복하며 기다림

### 5. 로그 전송 실행

- `docker compose up -d --no-deps fluent-bit`
- 앱을 교체할 때는 실행하지 않음
- `fluent-bit.conf`를 고친 뒤에는 `docker compose restart fluent-bit`

## 로그

### 앱 로그

- `/var/log/jipsee/app/jipsee.log`에 씀
- 하루마다 새로운 파일로 생성하고, 7일치만 보관함
- 컨테이너를 지워도 호스트에 그대로 유지함

### 업로드

- fluent-bit이 `jipsee.log`를 OCI Object Storage 버킷 `jipsee-logs`의 `app/`에 업로드함
- 10MB가 쌓이거나 10분이 지나면 gzip으로 압축해 업로드함
- 30일 뒤 버킷에서 삭제함
- 업로드가 실패하면 호스트 로그 파일(7일 보관)에서 다시 올림

### 콘솔 로그

- `json-file` 로그를 10MB 3개 유지함

## 포트

- 앱: `127.0.0.1:8090`
- MySQL: `127.0.0.1:3307`
- DB Tool: `127.0.0.1:3307` (SSH)
