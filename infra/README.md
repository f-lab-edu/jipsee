# infra

## 서버 경로

| 경로 | 설명 |
|---|---|
| `/opt/jipsee/compose.yaml` | 앱, fluent-bit Compose (프로젝트 `jipsee`) |
| `/opt/jipsee/db/compose.yaml` | MySQL, Flyway Compose (프로젝트 `jipsee-db`) |
| `/opt/jipsee/db/schema/` | 스키마 SQL (저장소 미포함) |
| `/opt/jipsee/fluent-bit/fluent-bit.conf`, `parsers.conf` | fluent-bit 설정, 파서 |
| `/opt/jipsee/bin/remote-deploy.sh` | 배포 키로 실행되는 유일한 스크립트 |
| `/opt/jipsee/jenkins/` | `compose.yaml`, `Dockerfile`, `.env` (Jenkins, 프로젝트 `jipsee-jenkins`) |
| `/opt/jipsee/.env.deploy`, `.env.deploy.prev` | 현재, 직전 이미지 태그 (배포 스크립트 기록, 롤백용) |
| `/opt/jipsee/job.env` | Job 컨테이너 환경 변수 (소유자 `ubuntu`, 그룹 1000, 권한 640) |
| `/opt/jipsee/monitoring/` | `compose.yaml`, `.env`, `exporter.my.cnf` (mysqld-exporter 접속 계정) |
| `/var/log/jipsee/app` | 앱 로그 `jipsee.log` (7일 보관), 실패 로그 `deploy-failed-<커밋 앞 7자리>.log` |
| `/var/lib/jipsee/fluent-bit` | fluent-bit 상태 (`tail.db`, `storage/`) |
| `/var/lib/jipsee-jenkins` | Jenkins 홈 (컨테이너 `/var/jenkins_home`) |
| `/etc/nginx/sites-available/jipsee-jenkins.conf`, `jipsee-grafana.conf` | nginx 설정 (`sites-enabled`에 링크) |

## 환경 변수

| 파일 | 변수 |
|---|---|
| `/opt/jipsee/.env` | `MYSQL_ROOT_PASSWORD`, `DB_USERNAME`, `DB_PASSWORD` |
| `.env.deploy` | `IMAGE_TAG` |
| `job.env` | `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `DATA_GO_KR_KEY` (`KEY=값`, 따옴표 없음, `docker run --env-file`) |
| `jenkins/.env` | `DOCKER_GID` (필수), `ALERT_WEBHOOK_URL` (선택) |
| `monitoring/.env` | `GRAFANA_ADMIN_USER`, `GRAFANA_ADMIN_PASSWORD`, `JIPSEE_ALERT_WEBHOOK_URL`, `LOKI_S3_ENDPOINT`, `LOKI_S3_ACCESS_KEY`, `LOKI_S3_SECRET_KEY` |
| GitHub `production` 시크릿 | `VM_HOST`, `VM_USER`, `VM_SSH_KEY`, `VM_SSH_HOST_KEY` (ssh 시 `GITHUB_TOKEN` 전달) |

## 배포 흐름

1. `main`의 `backend/**`, `.github/workflows/deploy-backend.yml` 변경 시 `deploy-backend` 실행 (Actions에서 수동 실행 가능)
2. ARM 러너에서 `api`, `batch` 빌드 후 ghcr `jipsee-backend`, `jipsee-batch` (`<커밋 해시>` 태그) 업로드
3. ssh로 `remote-deploy.sh` 실행: 이미지 수신, 앱 교체, `127.0.0.1:8082/actuator/health` 60초 내 `UP` 아니면 직전 태그로 롤백
4. 결과: `RESULT DEPLOYED`, `RESULT ROLLED_BACK`, `RESULT ROLLBACK_FAILED`, `RESULT FAILED` (`DEPLOYED` 외 워크플로 실패)

## 수동 복사 파일 규칙

- `compose.yaml`, `db/compose.yaml`, `fluent-bit/fluent-bit.conf`, `fluent-bit/parsers.conf`, `remote-deploy.sh`, `jenkins/compose.yaml`, `jenkins/Dockerfile`, `nginx/jipsee-jenkins.conf`, `nginx/jipsee-grafana.conf`, `monitoring/compose.yaml` 변경 시 머지 후 서버에 직접 복사 (`jenkins/Jenkinsfile`은 서버 작업 없음)

## 로그 전송

- fluent-bit가 앱 로그를 Loki로 전송. Loki가 유일한 로그 저장소이며 90일 보관
- 여러 줄 로그(스택 트레이스)는 한 건으로 묶이고 `level` 키가 붙음
- 기존 `tail.db`를 그대로 사용하므로 과거 로그는 Loki에 보내지 않고 적용 시점부터 적재

## 최초 설정

1. GitHub: `production` 환경 생성, Deployment branches를 `main`으로 제한, 시크릿 4개 등록 (`VM_SSH_HOST_KEY`는 `ssh-keyscan -t ed25519 <서버 주소>` 출력)
2. 첫 배포 후 ghcr 패키지 `jipsee-backend`, `jipsee-batch`의 Manage Actions access에 `f-lab-edu/jipsee` Read 추가
3. 배포 키 (로컬): `ssh-keygen -t ed25519 -N '' -C jipsee-deploy -f jipsee-deploy`, 개인키는 `VM_SSH_KEY`에 등록 후 로컬 삭제
4. 서버 `~/.ssh/authorized_keys`에 추가: `restrict,command="/opt/jipsee/bin/remote-deploy.sh" ssh-ed25519 AAAA... jipsee-deploy`
5. 서버 `/opt/jipsee`: `docker compose -p jipsee down`, `mkdir -p db && mv schema db/schema`
6. 폴더 생성: `sudo install -d -o 1000 -g ubuntu -m 775 /var/log/jipsee/app`, `sudo install -d -m 755 /var/lib/jipsee/fluent-bit`, `sudo install -d -o 1000 -g 1000 -m 755 /var/lib/jipsee-jenkins`
7. 저장소 `infra/` 파일을 같은 경로로 복사, `chmod 755 bin/remote-deploy.sh`, `backend/schema/*.sql`을 `db/schema`로 복사
8. `.env` 작성
9. DB: `docker compose -f db/compose.yaml --env-file .env up -d mysql`, 스키마: `docker compose -f db/compose.yaml --env-file .env --profile schema run --rm flyway`
10. Actions에서 `deploy-backend`를 `main`으로 수동 실행
11. 로그 전송: `docker compose --env-file .env --env-file .env.deploy up -d --no-deps fluent-bit`
12. `job.env`: `umask 077`로 작성 후 `sudo chown ubuntu:1000 job.env && chmod 640 job.env`
13. Jenkins: `jenkins/.env`에 `DOCKER_GID` 작성 (`getent group docker | cut -d: -f3`), `chmod 600 jenkins/.env`, `docker compose -f jenkins/compose.yaml build`, `docker compose -f jenkins/compose.yaml up -d`
14. certbot: `sudo certbot certonly --nginx -d jenkins.jipsee.link`, 확인 `sudo certbot renew --dry-run`
15. nginx: `nginx/jipsee-jenkins.conf`를 `sites-available`에 복사 후 `sites-enabled` 링크, `sudo nginx -t && sudo systemctl reload nginx`
16. Jenkins 화면 (`https://jenkins.jipsee.link/`): `docker compose -f jenkins/compose.yaml exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword`로 잠금 해제, 관리자 계정 생성, Jenkins URL `https://jenkins.jipsee.link/`, `prometheus` 플러그인, Built-In Node executors `1`, Pipeline `jipsee-deal-collect` (Git `https://github.com/f-lab-edu/jipsee.git`, `*/main`, `infra/jenkins/Jenkinsfile`), Build Now
17. 모니터링: MySQL에 계정 생성
    ```sql
    CREATE USER 'exporter'@'%' IDENTIFIED BY '<비밀번호>' WITH MAX_USER_CONNECTIONS 3;
    GRANT PROCESS, REPLICATION CLIENT ON *.* TO 'exporter'@'%';
    GRANT SELECT ON performance_schema.* TO 'exporter'@'%';
    ```
18. `monitoring/exporter.my.cnf` 작성: `[client]`, `user=exporter`, `password=<비밀번호>`, `host=mysql`, `port=3306`
19. `chmod 600 monitoring/exporter.my.cnf && sudo chown 65534:65534 monitoring/exporter.my.cnf`
20. 모니터링 시작: `docker compose -f monitoring/compose.yaml --env-file monitoring/.env up -d`
21. Grafana certbot: `sudo certbot certonly --nginx -d grafana.jipsee.link` (갱신은 `certbot.timer`가 자동 수행)
22. Grafana nginx: `nginx/jipsee-grafana.conf`를 `sites-available`에 복사 후 `sites-enabled` 링크, `sudo nginx -t && sudo systemctl reload nginx`

## 운영 명령

`/opt/jipsee`에서 실행. 앱 Compose는 `--env-file .env --env-file .env.deploy` 필수

- 앱 상태: `curl -s http://127.0.0.1:8082/actuator/health`
- 수동 롤백: `cp .env.deploy.prev .env.deploy && docker compose --env-file .env --env-file .env.deploy up -d --no-deps app`
- `fluent-bit.conf`, `parsers.conf` 수정 후: `docker compose --env-file .env --env-file .env.deploy restart fluent-bit`
- Jenkins 상태: `docker compose -f jenkins/compose.yaml ps`, 로그 `docker compose -f jenkins/compose.yaml logs --tail 100 jenkins`
- Jenkins 파일 수정 후: `docker compose -f jenkins/compose.yaml build`, `docker compose -f jenkins/compose.yaml up -d`
- Job 컨테이너: `docker ps --filter name=jipsee-job` (직접 `docker run` 금지, Jenkins 빌드로만 실행)
- 배치 중지: 화면에서 `jipsee-deal-collect` Disable Project (매일 04:00 KST 실행)

## 포트

| 대상 | 주소 |
|---|---|
| 앱 | `127.0.0.1:8090` |
| 관리 | `127.0.0.1:8082` |
| MySQL, DB Tool (SSH) | `127.0.0.1:3307` |
| Jenkins | `127.0.0.1:8095` (외부 `https://jenkins.jipsee.link`) |
| Grafana | `127.0.0.1:3001` (외부 `https://grafana.jipsee.link`) |
