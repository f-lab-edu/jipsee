# infra

실거래 수집 배치를 운영 서버에서 Docker Compose로 실행. `main`에 머지하면 GitHub Actions가 이미지를 빌드해 ghcr에 올리고, ssh로 서버에 접속해 앱 컨테이너 교체

배치 Job은 서버의 Jenkins 컨테이너가 매일 04:00(KST)에 `jipsee-batch` 이미지로 실행. 호스트 Docker 소켓으로 Job 컨테이너를 직접 띄움

## 서버 폴더 구성

### `/opt/jipsee`

- `compose.yaml`: 이 폴더의 `compose.yaml`(앱과 fluent-bit, 프로젝트 `jipsee`)
- `db/compose.yaml`: 이 폴더의 `db/compose.yaml`(MySQL과 Flyway, 프로젝트 `jipsee-db`)
- `db/schema/`: 스키마 SQL (저장소에 두지 않음)
- `fluent-bit/fluent-bit.conf`: 이 폴더의 `fluent-bit/fluent-bit.conf`
- `bin/remote-deploy.sh`: 이 폴더의 `remote-deploy.sh`. 배포 키로 접속하면 이 파일만 실행
- `jenkins/compose.yaml`: 이 폴더의 `jenkins/compose.yaml`(Jenkins, 프로젝트 `jipsee-jenkins`)
- `jenkins/Dockerfile`: 이 폴더의 `jenkins/Dockerfile`(Jenkins LTS와 `docker` CLI)
- `jenkins/.env`: 서버에서 만드는 Jenkins 환경 변수
- `job.env`: Job 컨테이너 환경 변수. 소유자 `ubuntu`, 그룹 1000, 권한 640(Jenkins 컨테이너 uid 1000이 그룹 권한으로 읽음)
- `.env`: 아래 환경 변수
  - `.env.deploy`: 지금 배포된 이미지 태그(`IMAGE_TAG`). 배포 스크립트가 기록하고 Jenkins도 이 태그로 Job 컨테이너 실행
  - `.env.deploy.prev`: 직전 배포의 이미지 태그. 롤백 시 사용

### 로그 폴더

- `/var/log/jipsee/app`: 앱 로그 폴더
  - 컨테이너의 `/app/logs`에 마운트
  - 소유자 1000, 그룹 `ubuntu`, 모드 775로 미리 생성(컨테이너 uid가 1000)
- `/var/lib/jipsee/fluent-bit`: fluent-bit 상태 폴더
  - `tail.db`: SQLite 파일, `jipsee.log`를 읽은 위치를 기록
  - `s3/`: 업로드 전 로그를 임시 저장

### 그 밖의 경로

- `/var/lib/jipsee-jenkins`: Jenkins 홈 폴더. 컨테이너의 `/var/jenkins_home`에 마운트. 소유자 1000으로 미리 생성(컨테이너 uid가 1000)
  - 설정, 플러그인, 빌드 기록이 들어 있어 컨테이너와 이미지를 바꿔도 유지
- `/etc/nginx/sites-available/jipsee-jenkins.conf`: 이 폴더의 `nginx/jipsee-jenkins.conf`. `sites-enabled`에 링크

### 환경 변수

- `.env`: 두 Compose가 공유. 하나라도 빈 값이면 실행되지 않음

#### DB

- `MYSQL_ROOT_PASSWORD`
- `DB_USERNAME`
- `DB_PASSWORD`

#### 로그 업로드

- `LOGS_S3_ENDPOINT`
- `LOGS_S3_ACCESS_KEY_ID`
- `LOGS_S3_SECRET_ACCESS_KEY`

#### Job (`job.env`)

- `.env`와 별개 파일(`/opt/jipsee/job.env`). Job 컨테이너에만 전달
- 변수 4개: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `DATA_GO_KR_KEY`
- 값은 따옴표 없이 `KEY=값` 한 줄씩 작성. `docker run --env-file`로 전달
- Jenkins 컨테이너가 `/opt/jipsee`를 `/etc/jipsee`로 읽기 전용 마운트해 읽음. uid 1000이 읽지 못하면 `docker run`이 종료 코드 125로 실패
- `DB_URL`은 `compose.yaml`에 고정된 값과 같은 값 사용

#### Jenkins (`jenkins/.env`)

- `.env`와 별개 파일(`/opt/jipsee/jenkins/.env`). 권한 600
- `DOCKER_GID`: 필수. 호스트 `docker` 그룹의 gid(`getent group docker | cut -d: -f3`). Jenkins 컨테이너가 호스트 Docker 소켓을 쓰려면 필요
- `ALERT_WEBHOOK_URL`: 선택. 토큰 포함 전체 웹훅 URL. 비면 알림 없음. 성공이 아닌 Job마다 job, result, buildUrl, exitCode, build를 JSON으로 POST

## 배포

### 흐름

1. `main`에 `backend/**`나 `.github/workflows/deploy-backend.yml` 변경사항이 반영되면 `deploy-backend` 워크플로 실행. Actions 탭에서 `main`을 골라 수동으로도 실행할 수 있음
2. ARM 러너에서 `backend/Dockerfile`의 `api`, `batch` 타깃을 각각 빌드해 `ghcr.io/f-lab-edu/jipsee-backend:<커밋 해시>`와 `ghcr.io/f-lab-edu/jipsee-batch:<커밋 해시>`로 업로드
3. 서버에 ssh로 접속해 커밋 해시, 사용자 이름, `GITHUB_TOKEN`을 표준 입력으로 전달
4. 서버의 `bin/remote-deploy.sh`가 두 이미지를 받고(하나라도 실패하면 배포 중단) 앱 컨테이너 교체. 관리 포트 `127.0.0.1:8081`의 `/actuator/health`가 60초 안에 `UP`이 되지 않으면 직전 태그로 되돌리고 실패 처리 후 종료
5. 성공하면 이미지 저장소마다 지금 태그, 직전 태그, 그 밖에 가장 최근 태그 1개만 남기고 이미지 삭제

### 결과

워크플로 실행 요약에 아래 중 하나를 기록. `RESULT DEPLOYED`가 아니면 워크플로 실패

- `RESULT DEPLOYED`: 배포 성공
- `RESULT ROLLED_BACK`: 새 버전이 실패해 직전 태그로 되돌리기
- `RESULT ROLLBACK_FAILED`: 되돌리기도 실패. 서버에서 직접 확인 필요
- `RESULT FAILED`: 서버 상태를 바꾸기 전에 실패했거나, 최초 배포가 실패해 앱 중지

실패한 앱의 컨테이너 로그는 `/var/log/jipsee/app/deploy-failed-<커밋 앞 7자리>.log`에 기록. 7일이 지난 파일은 다음 배포 때 삭제

### 인프라 파일 변경

워크플로는 서버에 파일을 올리지 않음. `compose.yaml`, `db/compose.yaml`, `fluent-bit/fluent-bit.conf`, `remote-deploy.sh`, `jenkins/compose.yaml`, `jenkins/Dockerfile`, `nginx/jipsee-jenkins.conf`가 바뀐 PR은 머지한 뒤 서버에 직접 복사. 배포 키는 `remote-deploy.sh` 실행만 허용(`restrict,command=`)해서 파일을 올릴 수 없음

- `jenkins/compose.yaml`, `jenkins/Dockerfile`: 복사한 뒤 `docker compose -f jenkins/compose.yaml build`와 `up -d`
- `jenkins/Jenkinsfile`: `main` 머지만으로 다음 빌드부터 반영되어 서버 작업 없음

## 처음 설정

### GitHub

1. Settings, Environments에서 `production` 환경 생성
2. 같은 화면의 Deployment branches and tags를 Selected branches and tags로 바꾸고 `main` 추가. 설정하지 않으면 다른 브랜치도 수동 실행으로 배포 가능
3. `production` 환경의 시크릿으로 등록
   - `VM_HOST`: 서버 주소
   - `VM_USER`: 서버 사용자
   - `VM_SSH_KEY`: 배포 키의 개인키 전체
   - `VM_SSH_HOST_KEY`: `ssh-keyscan -t ed25519 <서버 주소>`의 출력 한 줄(`<서버 주소> ssh-ed25519 AAAA...`)
4. 첫 배포로 ghcr 패키지 `jipsee-backend`와 `jipsee-batch`가 생기면 각 패키지의 Package settings, Manage Actions access에서 `f-lab-edu/jipsee`를 Read 역할로 추가. 조직이 공개 패키지를 막아서 서버가 `GITHUB_TOKEN`으로 받으려면 필요. 첫 배포가 이미지 받기에서 실패하면 이 설정 뒤 다시 실행

### 배포 키

1. 로컬에서 `ssh-keygen -t ed25519 -N '' -C jipsee-deploy -f jipsee-deploy`
2. 서버 `~/.ssh/authorized_keys`에 공개키를 아래처럼 한 줄로 추가. 이 키로 접속하면 보낸 명령과 상관없이 스크립트만 실행되고 포트 포워딩과 pty 차단

```
restrict,command="/opt/jipsee/bin/remote-deploy.sh" ssh-ed25519 AAAA... jipsee-deploy
```

3. 개인키(`jipsee-deploy`)는 `VM_SSH_KEY` 시크릿에 넣고 로컬에서 삭제

### 서버

`/opt/jipsee`에서 실행

1. 옛 단일 Compose 종료(볼륨 유지): `docker compose -p jipsee down`
2. 스키마 이동: `mkdir -p db && mv schema db/schema`
3. 폴더 만들기
   - `sudo install -d -o 1000 -g ubuntu -m 775 /var/log/jipsee/app`
   - `sudo install -d -m 755 /var/lib/jipsee/fluent-bit`
4. 저장소의 `infra/compose.yaml`, `infra/db/compose.yaml`, `infra/fluent-bit/fluent-bit.conf`를 같은 경로로, `infra/remote-deploy.sh`를 `bin/remote-deploy.sh`로 복사하고 `chmod 755 bin/remote-deploy.sh`
   - 저장소의 `backend/schema/*.sql`을 `db/schema`로 복사(7단계 flyway 실행 전)
5. `.env`에 로그 업로드 변수 3개 추가
6. DB 실행: `docker compose -f db/compose.yaml --env-file .env up -d mysql`. 앱이 붙는 네트워크 `jipsee-db`도 이때 생성
7. 스키마 적용: `docker compose -f db/compose.yaml --env-file .env --profile schema run --rm flyway`
8. Actions에서 `deploy-backend`를 `main`으로 수동 실행해 앱 실행
9. 로그 전송 실행: `docker compose --env-file .env --env-file .env.deploy up -d --no-deps fluent-bit`. `.env.deploy`가 있어야 해서 첫 배포 뒤에 실행
10. `job.env` 작성: 4개 변수(`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `DATA_GO_KR_KEY`). `umask 077`로 만든 뒤 `sudo chown ubuntu:1000 job.env && chmod 640 job.env`
11. Jenkins 실행
    - `sudo install -d -o 1000 -g 1000 -m 755 /var/lib/jipsee-jenkins`
    - 저장소의 `infra/jenkins/`의 `compose.yaml`, `Dockerfile`을 `jenkins/`로 복사하고 `jenkins/.env`에 `DOCKER_GID` 작성(`chmod 600`)
    - `docker compose -f jenkins/compose.yaml build`, `docker compose -f jenkins/compose.yaml up -d`
12. nginx 설정
    - `sudo certbot certonly --nginx -d jenkins.jipsee.link`로 인증서를 먼저 발급. 갱신은 `certbot.timer`가 80 포트의 챌린지 경로로 자동 처리
    - `nginx/jipsee-jenkins.conf`를 `/etc/nginx/sites-available`에 복사하고 `sites-enabled`에 링크
    - `sudo nginx -t && sudo systemctl reload nginx`
    - `sudo certbot renew --dry-run`으로 갱신 확인
13. Jenkins 화면 설정(처음 한 번만). `https://jenkins.jipsee.link`에 접속
    1. 잠금 해제: `docker compose -f jenkins/compose.yaml exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword`의 값 입력
    2. 추천 플러그인 설치, 관리자 계정 생성(회원가입 비활성). Jenkins URL은 `https://jenkins.jipsee.link/`
    3. Manage Jenkins, Plugins에서 `prometheus` 플러그인 설치
    4. Manage Jenkins, Nodes, Built-In Node, Configure에서 Number of executors를 `1`로 변경
    5. 새 Item에서 이름 `jipsee-deal-collect`, 종류 Pipeline 생성
       - Definition: Pipeline script from SCM, SCM: Git
       - Repository URL: `https://github.com/f-lab-edu/jipsee.git`(인증 정보 없음)
       - Branch Specifier: `*/main`
       - Script Path: `infra/jenkins/Jenkinsfile`
    6. Build Now로 첫 수동 빌드 실행. `Jenkinsfile`의 cron(매일 04:00 KST)이 이 빌드에서 Job에 등록됨

## 서버 운영 명령

`/opt/jipsee`에서 실행. 앱 Compose는 `IMAGE_TAG`가 필요해서 항상 `--env-file .env --env-file .env.deploy` 사용

- 앱 상태: `curl -s http://127.0.0.1:8081/actuator/health`
- 직전 태그로 직접 되돌리기: `cp .env.deploy.prev .env.deploy && docker compose --env-file .env --env-file .env.deploy up -d --no-deps app`
- 스키마 적용: `docker compose -f db/compose.yaml --env-file .env --profile schema run --rm flyway`. 워크플로는 스키마를 적용하지 않음
- `fluent-bit.conf`를 고친 뒤: `docker compose --env-file .env --env-file .env.deploy restart fluent-bit`
- DB가 내려가 있으면 앱은 재시작을 반복하며 대기
- Jenkins 상태: `docker compose -f jenkins/compose.yaml ps`. 로그는 `docker compose -f jenkins/compose.yaml logs --tail 100 jenkins`
- `jenkins/compose.yaml`이나 `Dockerfile`을 고친 뒤: `docker compose -f jenkins/compose.yaml build`와 `docker compose -f jenkins/compose.yaml up -d`
- 실행 중인 Job 컨테이너: `docker ps --filter name=jipsee-job`
- Job 컨테이너를 `docker run`으로 직접 실행하지 않고 항상 Jenkins 빌드로 실행
- 배치 중지: 화면에서 `jipsee-deal-collect`를 비활성화(Disable Project). 다시 켜려면 활성화

## 로그

### 앱 로그

- `/var/log/jipsee/app/jipsee.log`에 기록
- 하루마다 새로운 파일로 생성하고, 7일치만 보관
- 컨테이너를 지워도 호스트에 그대로 유지

### 업로드

- fluent-bit이 `jipsee.log`를 OCI Object Storage 버킷 `jipsee-logs`의 `app/`에 업로드
- 10MB가 쌓이거나 10분이 지나면 gzip으로 압축해 업로드
- 30일 뒤 버킷에서 삭제
- 업로드가 실패하면 호스트 로그 파일(7일 보관)에서 다시 업로드

### 콘솔 로그

- `json-file` 로그를 10MB 3개 유지

## 포트

- 앱: `127.0.0.1:8090`
- 관리 포트: `127.0.0.1:8081`
- MySQL: `127.0.0.1:3307`
- DB Tool: `127.0.0.1:3307` (SSH)
- Jenkins: `127.0.0.1:8095`. 외부 접속은 nginx `https://jenkins.jipsee.link`(로그인 필수)

## 모니터링

서버 `monitoring/.env` 변수

- `GRAFANA_ADMIN_USER`, `GRAFANA_ADMIN_PASSWORD`: Grafana 관리자 계정
- `JIPSEE_ALERT_WEBHOOK_URL`: Grafana 알림 웹훅, 토큰 포함 전체 URL

Grafana 접속은 nginx `https://grafana.jipsee.link`에서 로그인(회원가입, 익명 접속 비활성)
