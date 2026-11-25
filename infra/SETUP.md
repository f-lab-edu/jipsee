# 최초 서버 설정

서버 `/opt/jipsee` 기준. 복사 규칙은 [README.md](README.md) 참조

## 1. GitHub

1. `production` 환경 생성, Deployment branches를 `main`으로 제한
2. 시크릿 4개 등록: `VM_HOST`, `VM_USER`, `VM_SSH_KEY`, `VM_SSH_HOST_KEY` (`VM_SSH_HOST_KEY`는 `ssh-keyscan -t ed25519 <서버 주소>` 출력)

## 2. 배포 키

1. 로컬에서 생성: `ssh-keygen -t ed25519 -N '' -C jipsee-deploy -f jipsee-deploy`
2. 개인키를 `VM_SSH_KEY`에 등록 후 로컬 삭제
3. 서버 `~/.ssh/authorized_keys`에 추가

```
restrict,command="/opt/jipsee/bin/remote-deploy.sh" ssh-ed25519 AAAA... jipsee-deploy
```

## 3. 서버 폴더와 파일

```bash
sudo install -d -o 1000 -g ubuntu -m 775 /var/log/jipsee/app
sudo install -d -m 755 /var/lib/jipsee/fluent-bit
sudo install -d -o 1000 -g 1000 -m 755 /var/lib/jipsee-jenkins
```

1. 저장소 파일을 README의 복사 규칙대로 서버에 복사
2. `chmod 755 bin/remote-deploy.sh`

## 4. 환경 변수 파일

| 파일              | 변수                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `.env`            | `MYSQL_ROOT_PASSWORD`, `DB_USERNAME`, `DB_PASSWORD`                                                                                        |
| `job.env`         | `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `DATA_GO_KR_KEY`                                                                                   |
| `jenkins/.env`    | `DOCKER_GID` (필수), `ALERT_WEBHOOK_URL` (선택)                                                                                            |
| `monitoring/.env` | `GRAFANA_ADMIN_USER`, `GRAFANA_ADMIN_PASSWORD`, `JIPSEE_ALERT_WEBHOOK_URL`, `LOKI_S3_ENDPOINT`, `LOKI_S3_ACCESS_KEY`, `LOKI_S3_SECRET_KEY` |

- `job.env`: `KEY=값` 형식, 따옴표 없음. `umask 077`로 작성 후 `sudo chown ubuntu:1000 job.env && chmod 640 job.env`
- `jenkins/.env`: `DOCKER_GID`는 `getent group docker | cut -d: -f3`, `chmod 600 jenkins/.env`
- `.env.deploy`는 배포 스크립트가 기록

## 5. DB

```bash
docker compose -f db/compose.yaml --env-file .env up -d mysql
docker compose -f db/compose.yaml --env-file .env --profile schema run --rm flyway
```

## 6. 앱

1. Actions에서 `deploy-backend`를 `main`으로 수동 실행
2. 첫 배포 후 ghcr 패키지 `jipsee-backend`, `jipsee-batch`의 Manage Actions access에 `f-lab-edu/jipsee` Read 추가
3. 로그 전송 시작

```bash
docker compose --env-file .env --env-file .env.deploy up -d --no-deps fluent-bit
```

## 7. Jenkins

```bash
docker compose -f jenkins/compose.yaml build
docker compose -f jenkins/compose.yaml up -d
```

nginx 사이트(9단계) 설정 후 `https://jenkins.jipsee.link/` 접속

1. `docker compose -f jenkins/compose.yaml exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword`로 잠금 해제
2. 관리자 계정 생성, Jenkins URL `https://jenkins.jipsee.link/`
3. `prometheus` 플러그인 설치, Built-In Node executors `1`
4. Pipeline `jipsee-deal-collect` 생성: Git `https://github.com/f-lab-edu/jipsee.git`, 브랜치 `*/main`, Script Path `infra/jenkins/Jenkinsfile`
5. Build Now (cron 트리거 등록)

## 8. 모니터링

1. MySQL에 exporter 계정 생성

```sql
CREATE USER 'exporter'@'%' IDENTIFIED BY '<비밀번호>' WITH MAX_USER_CONNECTIONS 3;
GRANT PROCESS, REPLICATION CLIENT ON *.* TO 'exporter'@'%';
GRANT SELECT ON performance_schema.* TO 'exporter'@'%';
```

2. `monitoring/exporter.my.cnf` 작성

```
[client]
user=exporter
password=<비밀번호>
host=mysql
port=3306
```

3. 권한 설정과 시작

```bash
chmod 600 monitoring/exporter.my.cnf && sudo chown 65534:65534 monitoring/exporter.my.cnf
docker compose -f monitoring/compose.yaml --env-file monitoring/.env up -d
```

## 9. nginx 사이트

README의 nginx 사이트 표의 도메인마다 실행. 인증서 갱신은 `certbot.timer`가 자동 수행

```bash
sudo certbot certonly --nginx -d <도메인>
sudo cp <파일> /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/<파일> /etc/nginx/sites-enabled/<파일>
sudo nginx -t && sudo systemctl reload nginx
sudo certbot renew --dry-run
```

## 10. DB 백업

```bash
sudo install -d -o ubuntu -m 700 /opt/jipsee/backup
install -m 700 backup.sh /opt/jipsee/backup/backup.sh
cp backup.env.example /opt/jipsee/backup/backup.env
chmod 600 /opt/jipsee/backup/backup.env
sudo install -o root -g root -m 644 jipsee-backup.cron /etc/cron.d/jipsee-backup
sudo touch /var/log/jipsee-backup.log && sudo chown ubuntu /var/log/jipsee-backup.log
```

- `backup.env`의 `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` 입력
- 수동 실행으로 확인: `/opt/jipsee/backup/backup.sh`
