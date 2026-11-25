# infra

최초 서버 설정은 [SETUP.md](SETUP.md) 참조

## 구성 요소와 포트

| 서비스          | 역할                                                | 포트                                              |
| --------------- | --------------------------------------------------- | ------------------------------------------------- |
| nginx           | TLS 종단, 역방향 프록시 (호스트 설치)               | 80, 443                                           |
| app             | API                                                 | `127.0.0.1:8090`, 관리(actuator) `127.0.0.1:8082` |
| batch job       | Jenkins가 실행하는 배치 컨테이너 `jipsee-job-<job>` | 없음                                              |
| mysql           | DB                                                  | `127.0.0.1:3307` (DB 툴은 SSH 터널)               |
| flyway          | 스키마 마이그레이션 (수동 실행)                     | 없음                                              |
| fluent-bit      | 앱 로그를 Loki로 전송                               | 내부 2020                                         |
| jenkins         | 배치 스케줄 실행 (매일 04:00 KST)                   | `127.0.0.1:8095`                                  |
| grafana         | 대시보드, 알림                                      | `127.0.0.1:3001`                                  |
| loki            | 로그 저장소 (90일 보관)                             | 내부 3100                                         |
| prometheus      | 지표 수집                                           | 내부 9090                                         |
| node-exporter   | 서버 지표                                           | 내부 9100                                         |
| cadvisor        | 컨테이너 지표                                       | 내부 8080                                         |
| mysqld-exporter | MySQL 지표                                          | 내부 9104                                         |

### nginx 사이트

설정 파일은 서버 `/etc/nginx/sites-available`에 두고 `/etc/nginx/sites-enabled`에 링크

| 도메인                | 파일                        | 업스트림         | 비고                                       |
| --------------------- | --------------------------- | ---------------- | ------------------------------------------ |
| `api.jipsee.link`     | `nginx/jipsee-api.conf`     | `127.0.0.1:8090` | 80에서 443으로 리다이렉트, `/actuator` 404 |
| `jenkins.jipsee.link` | `nginx/jipsee-jenkins.conf` | `127.0.0.1:8095` | `/prometheus/` 404                         |
| `grafana.jipsee.link` | `nginx/jipsee-grafana.conf` | `127.0.0.1:3001` |                                            |

## 배포 흐름

### 앱

1. `main`의 `backend/**`, `.github/workflows/deploy-backend.yml` 변경 시 `deploy-backend` 실행 (Actions에서 수동 실행 가능)
2. ARM 러너에서 `api`, `batch` 이미지를 빌드해 ghcr `jipsee-backend`, `jipsee-batch`에 `<커밋 해시>` 태그로 업로드
3. ssh로 `remote-deploy.sh` 실행: 이미지 수신, 앱 교체, `127.0.0.1:8082/actuator/health`가 60초 내 `UP`이 아니면 직전 태그로 롤백
4. 결과 `RESULT DEPLOYED`, `ROLLED_BACK`, `ROLLBACK_FAILED`, `FAILED` (`DEPLOYED` 외에는 워크플로 실패)

### 인프라 파일

머지 후 서버에 직접 복사, 이후 적용 명령 실행

복사 규칙

| 저장소                            | 서버                               |
| --------------------------------- | ---------------------------------- |
| `infra/**`                        | `/opt/jipsee/**` (같은 상대 경로)  |
| `infra/remote-deploy.sh`          | `/opt/jipsee/bin/remote-deploy.sh` |
| `infra/nginx/*.conf`              | `/etc/nginx/sites-available/`      |
| `infra/backup/jipsee-backup.cron` | `/etc/cron.d/jipsee-backup`        |
| `backend/schema/*.sql`            | `/opt/jipsee/db/schema/`           |

복사 제외: `infra/jenkins/Jenkinsfile` (Jenkins가 Git에서 조회), `infra/test/`, `infra/backup/backup.env.example`

적용 명령 (`/opt/jipsee`에서 실행)

| 변경                                         | 명령                                                                                           |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `compose.yaml`                               | `docker compose --env-file .env --env-file .env.deploy up -d --no-deps app`                    |
| `fluent-bit/*`                               | `docker compose --env-file .env --env-file .env.deploy restart fluent-bit`                     |
| `db/compose.yaml`                            | `docker compose -f db/compose.yaml --env-file .env up -d mysql`                                |
| `db/schema/*.sql`                            | `docker compose -f db/compose.yaml --env-file .env --profile schema run --rm flyway`           |
| `jenkins/compose.yaml`, `jenkins/Dockerfile` | `docker compose -f jenkins/compose.yaml build && docker compose -f jenkins/compose.yaml up -d` |
| `monitoring/**`                              | `docker compose -f monitoring/compose.yaml --env-file monitoring/.env up -d`                   |
| `nginx/*.conf`                               | `sudo nginx -t && sudo systemctl reload nginx`                                                 |

## 운영 명령

`/opt/jipsee`에서 실행. 앱 Compose는 `--env-file .env --env-file .env.deploy` 필수

| 작업               | 명령                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| 앱 상태            | `curl -s http://127.0.0.1:8082/actuator/health`                                                                    |
| 앱 로그            | `docker compose --env-file .env --env-file .env.deploy logs --tail 100 app`, 파일 `/var/log/jipsee/app/jipsee.log` |
| 앱 중지            | `docker compose --env-file .env --env-file .env.deploy stop app`                                                   |
| 앱 시작            | `docker compose --env-file .env --env-file .env.deploy up -d --no-deps app`                                        |
| 수동 롤백          | `cp .env.deploy.prev .env.deploy` 후 앱 시작 명령                                                                  |
| 배포 실패 로그     | `/var/log/jipsee/app/deploy-failed-<커밋 앞 7자리>.log`                                                            |
| Jenkins 상태, 로그 | `docker compose -f jenkins/compose.yaml ps`, `docker compose -f jenkins/compose.yaml logs --tail 100 jenkins`      |
| 배치 컨테이너 확인 | `docker ps --filter name=jipsee-job` (직접 `docker run` 금지, Jenkins 빌드로만 실행)                               |
| 배치 중지          | Jenkins 화면에서 `jipsee-deal-collect` Disable Project                                                             |
| 모니터링 상태      | `docker compose -f monitoring/compose.yaml --env-file monitoring/.env ps`                                          |

## DB 백업

- 매일 18:40 UTC (03:40 KST) cron 실행, 버킷 `jipsee-db-backup`의 `mysql/`에 최근 7개 보관
- 수동 실행: `/opt/jipsee/backup/backup.sh`
- 로그: `/var/log/jipsee-backup.log`
