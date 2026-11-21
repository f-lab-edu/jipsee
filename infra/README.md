# infra

실거래 수집 배치를 운영 서버에서 Docker Compose로 실행. `main`에 머지하면 GitHub Actions가 이미지를 빌드해 ghcr에 올리고, ssh로 서버에 접속해 앱 컨테이너 교체

배치 Job은 서버의 Jenkins 컨테이너가 스케줄하고, 호스트 Docker 소켓으로 Job 컨테이너를 직접 실행(아래 "Jenkins 배치 실행")

## 서버 폴더 구성

### `/opt/jipsee`

- `compose.yaml`: 이 폴더의 `compose.yaml`(앱과 fluent-bit, 프로젝트 `jipsee`)
- `db/compose.yaml`: 이 폴더의 `db/compose.yaml`(MySQL과 Flyway, 프로젝트 `jipsee-db`)
- `db/schema/`: 저장소 `backend/schema/`(Flyway 파일 `V<n>__*.sql`)의 서버 복사본
- `fluent-bit/fluent-bit.conf`: 이 폴더의 `fluent-bit/fluent-bit.conf`
- `bin/remote-deploy.sh`: 이 폴더의 `remote-deploy.sh`. 배포 키로 접속하면 이 파일만 실행
- `jenkins/`: 이 폴더의 `jenkins/`(`compose.yaml`, `Dockerfile`, 프로젝트 `jipsee-jenkins`)와 서버에서 만드는 `.env`. `Jenkinsfile`은 Jenkins가 저장소에서 직접 읽음
- `job.env`: Job 컨테이너 환경 변수 4개. 소유자 `ubuntu`, 그룹 1000, 권한 640(Jenkins 컨테이너 사용자 uid 1000이 그룹 권한으로 읽음)
- `.env`: 아래 환경 변수
  - `.env.deploy`: 지금 배포된 이미지 태그(`IMAGE_TAG`). 배포 스크립트가 기록하고 Jenkins도 이 태그로 Job 컨테이너 실행
  - `.env.deploy.prev`: 직전 배포의 이미지 태그. 롤백 시 사용

### 로그 폴더

- `/var/log/jipsee/app`: 앱 로그 폴더
  - 컨테이너의 `/app/logs`에 마운트
  - 소유자 1000, 그룹 `ubuntu`, 모드 775로 미리 생성(컨테이너 uid가 1000)
- `/var/lib/jipsee-jenkins`: Jenkins 홈 폴더. 컨테이너의 `/var/jenkins_home`에 마운트. 소유자 1000, 그룹 1000으로 미리 생성(컨테이너 uid가 1000)
  - 설정, 플러그인, 빌드 기록이 들어 있어 컨테이너와 이미지를 바꿔도 유지
- `/var/lib/jipsee/fluent-bit`: fluent-bit 상태 폴더
  - `tail.db`: SQLite 파일, `jipsee.log`를 읽은 위치를 기록
  - `s3/`: 업로드 전 로그를 임시 저장

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

#### Job (`job.env`)

- `.env`와 별개 파일(`/opt/jipsee/job.env`). Job 컨테이너에만 전달
- 변수 4개: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `DATA_GO_KR_KEY`
- 값은 따옴표 없이 `KEY=값` 한 줄씩 작성. `docker run --env-file`로 전달하므로 `$`도 그대로 유지
- Jenkins 컨테이너의 `docker` 명령이 `/etc/jipsee/job.env`를 읽어 전달하므로 uid 1000이 읽을 수 있어야 함. 읽지 못하면 `docker run`이 종료 코드 125로 실패(FAILURE). 값은 콘솔에 출력되지 않음
- 앱의 `DB_URL`은 `compose.yaml`에 고정된 값이므로 같은 값을 사용

#### Jenkins (`jenkins/.env`)

- `.env`와 별개 파일(`/opt/jipsee/jenkins/.env`). 권한 600
- `DOCKER_GID`: 필수. 호스트 `docker` 그룹의 gid(`getent group docker | cut -d: -f3`). Jenkins 컨테이너가 호스트 Docker 소켓을 쓰려면 이 그룹이 필요
- `ALERT_WEBHOOK_URL`: 선택. 모니터링의 `ALERT_CONTACT_URL`과 같은 수신처. 비면 알림 없음. 실패, 불안정, 중단 빌드가 이 주소로 POST 1회(job, result, url)

## 배포

### 흐름

1. `main`에 `backend/**`나 `.github/workflows/deploy-backend.yml` 변경사항이 반영되면 `deploy-backend` 워크플로 실행. Actions 탭에서 `main`을 골라 수동으로도 실행할 수 있음
2. ARM 러너에서 `backend/Dockerfile`로 빌드해 `ghcr.io/f-lab-edu/jipsee-backend:<커밋 해시>`로 업로드
3. 서버에 ssh로 접속해 커밋 해시, 사용자 이름, `GITHUB_TOKEN`을 표준 입력으로 전달
4. 서버의 `bin/remote-deploy.sh`가 이미지를 받고 앱 컨테이너 교체. `/actuator/health`가 60초 안에 `UP`이 되지 않으면 직전 태그로 되돌리고 실패 처리 후 종료
5. 성공하면 지금 태그, 직전 태그, 그 밖에 가장 최근 태그 1개만 남기고 이미지 삭제

이미지는 `ghcr.io/f-lab-edu/jipsee-backend` 하나이며 앱과 Job 컨테이너가 `.env.deploy`의 같은 태그를 사용. 그래서 앱 롤백은 Job도 함께 이전 태그로 되돌림. 이미지를 앱과 배치로 나누는 분리 단계에서 `jipsee-batch`가 추가

### 결과

워크플로 실행 요약에 아래 중 하나를 기록. `RESULT DEPLOYED`가 아니면 워크플로 실패

- `RESULT DEPLOYED`: 배포 성공
- `RESULT ROLLED_BACK`: 새 버전이 실패해 직전 태그로 되돌리기
- `RESULT ROLLBACK_FAILED`: 되돌리기도 실패. 서버에서 직접 확인 필요
- `RESULT FAILED`: 서버 상태를 바꾸기 전에 실패했거나, 최초 배포가 실패해 앱 중지

실패한 앱의 컨테이너 로그는 `/var/log/jipsee/app/deploy-failed-<커밋 앞 7자리>.log`에 기록. 7일이 지난 파일은 다음 배포 때 삭제

### 배치 Job 주의

- 매일 04:00부터 07:00(KST)에는 배포하지 않음
  - 배포는 앱 컨테이너만 교체해 실행 중인 Job 컨테이너에는 영향이 없음
  - 다만 Jenkins 빌드 중에 배포하면 스테이지마다 Job 컨테이너의 이미지 태그가 달라질 수 있음. 태그는 스테이지마다 빌드 설명에 기록
- 모든 Job 실행은 Jenkins 빌드를 거침. Job 컨테이너를 `docker run`으로 직접 실행하는 것은 금지
  - 러너가 시작할 때 그 Job의 `STARTED` 실행을 복구하므로, 다른 곳에서 실행 중인 같은 Job을 가로챌 수 있음
- 중단으로 `STARTED` 실행이 남은 경우
  - 신호로 중단(종료 코드 143)되거나 강제 종료(137)되면 앱은 종료 줄 없이 끝나고 실행이 `STARTED`로 남음
  - 다음 실행의 러너가 시작할 때 그 Job의 `STARTED` 실행을 복구해 이어서 실행(최대 키 하나를 다시 처리). 따로 정리할 필요 없음
  - 복구되지 않을 때의 마지막 수단으로만 아래 SQL로 정리

```sql
UPDATE BATCH_STEP_EXECUTION SET STATUS = 'FAILED', EXIT_CODE = 'FAILED', END_TIME = NOW() WHERE STATUS IN ('STARTING', 'STARTED', 'STOPPING');
UPDATE BATCH_JOB_EXECUTION SET STATUS = 'FAILED', EXIT_CODE = 'FAILED', END_TIME = NOW() WHERE STATUS IN ('STARTING', 'STARTED', 'STOPPING');
```

- SQL 접속: `docker compose -f db/compose.yaml --env-file .env exec mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" jipsee'`

### 인프라 파일 변경

워크플로는 서버에 파일을 올리지 않음. `compose.yaml`, `db/compose.yaml`, `fluent-bit/fluent-bit.conf`, `remote-deploy.sh`, `jenkins/`, `backend/schema/`가 바뀐 PR은 머지한 뒤 서버에 직접 복사. 배포 키는 `remote-deploy.sh` 실행만 허용(`restrict,command=`)해서 파일을 올릴 수 없음

- `backend/schema/`: `db/schema/`로 복사한 뒤 Flyway 실행(아래 "서버 운영 명령"의 스키마 적용)
- `jenkins/`: `compose.yaml`과 `Dockerfile`이 바뀌면 복사한 뒤 `docker compose -f jenkins/compose.yaml build`와 `up -d`(아래 "이미지 갱신"). `Jenkinsfile` 변경은 `main` 머지만으로 다음 빌드부터 반영되어 서버 작업 없음

## Jenkins 배치 실행

### 구성

```
Jenkins 컨테이너(127.0.0.1:8091, jipsee-db 네트워크, 호스트 /var/run/docker.sock 마운트)
  파이프라인 jipsee-deal-collect, 매일 04:00(KST)에 스테이지 순차 실행(첫 수동 빌드 뒤)
    호스트 Docker 데몬에 docker run --rm 요청(호스트의 Job 컨테이너, MySQL 접속)
      이미지: ghcr.io/f-lab-edu/jipsee-backend:<.env.deploy 태그>
      출력: Jenkins 콘솔
```

- 파이프라인 스테이지: `dailyRentCollectJob`, `dailySaleCollectJob`, `initialRentLoadJob`, `initialSaleLoadJob` 순서로 하나씩 실행. 앞 스테이지가 실패해도 뒤 스테이지 실행
  - 스테이지 제한 시간: 일일 Job 30분, 초기 적재 Job 60분. 초과하면 ABORTED
- Jenkins 컨테이너: 메모리 1g, CPU 1, 실행기 1개
- 이미지는 Jenkins LTS와 `docker` CLI만 포함. 파이프라인은 `Jenkinsfile`(저장소 `main`)에서 읽고, 동시 실행 방지, 빌드 기록 30건 보관, 매일 04:00(KST) cron도 `Jenkinsfile`이 정함
- Jenkins 설정(계정, 플러그인, Job)은 `/var/lib/jipsee-jenkins`에 저장. 서버를 잃으면 "처음 설정"의 화면 설정을 다시 수행
- cron 트리거는 빌드가 실행될 때 등록되므로 첫 수동 빌드가 등록(아래 "cron 켜기와 끄기"). Jenkins가 04:00에 꺼져 있으면 그 실행은 따라잡지 않음
- Job 컨테이너는 환경 변수 `JIPSEE_BATCH_RUN_JOB`으로 Job을 선택하는 러너 모드로 실행. 러너가 없는 컷오버 배포 전 이미지는 이 변수를 무시하고 앱이 그대로 기동할 수 있음(추정). 그래서 컷오버 배포 전에는 Jenkins 수동 빌드를 하지 않음

### Docker 소켓과 마운트

- Jenkins 컨테이너는 이미지에 들어 있는 `docker` CLI(데몬 없음)로 호스트 Docker 데몬에 Job 컨테이너를 요청. ssh와 호스트 스크립트는 쓰지 않음
- **호스트 Docker 소켓을 쓰는 Jenkins는 호스트 root와 같은 권한**. Jenkins 관리자나 플러그인이 뚫리면 같은 서버의 다른 컨테이너까지 노출됨. 그래서 포트를 `127.0.0.1`로만 게시하고 터널로만 접속하며 로그인 필수(아래 "접속")
- `jenkins/compose.yaml`의 마운트와 설정

| 호스트 | 컨테이너 | 용도 |
|---|---|---|
| `/var/run/docker.sock` | `/var/run/docker.sock` | Docker 데몬. `group_add`에 `DOCKER_GID`가 필요 |
| `/opt/jipsee`(읽기 전용) | `/etc/jipsee` | `/etc/jipsee/job.env`(`--env-file`)와 `/etc/jipsee/.env.deploy`(이미지 태그) |

- `job.env`와 `.env.deploy`는 파일이 아닌 `/opt/jipsee` 폴더로 마운트. `remote-deploy.sh`가 `mv`로 `.env.deploy`를 교체하면 파일 마운트는 옛 파일을 계속 가리켜 태그를 갱신하지 못함. 이 폴더에는 `.env`도 있으나 권한 600이고 소유자가 컨테이너 uid와 다르면 읽히지 않음. 소켓으로 호스트 전체에 접근할 수 있으므로 이 구분에 기대지 않음
- Job 컨테이너 설정: `--rm --name jipsee-job-<Job 이름> --stop-timeout 60 --memory 1g --cpus 2 --network jipsee-db --log-opt max-size=10m --log-opt max-file=3`, 환경 변수 `SPRING_PROFILES_ACTIVE=prod`, `SPRING_MAIN_WEB_APPLICATION_TYPE=none`, `SPRING_MAIN_BANNER_MODE=off`, `JIPSEE_BATCH_RUN_JOB=<Job 이름>`과 `job.env`. 명령 인자 없음
- 스테이지가 끝날 때마다 `docker stop -t 60 jipsee-job-<Job 이름>` 실행(`finally`). 중단이나 시간 초과 때 Job 컨테이너를 멈추는 수단이며, 이미 끝났으면 오류를 무시

### 접속

- 사용자 PC에서 터널 생성: `ssh -L 8091:127.0.0.1:8091 <서버>`
- 주소창과 CLI 모두 `localhost`로 접속(`http://localhost:8091/`). Jenkins URL이 `localhost`로 설정되어 있어 `127.0.0.1`로 접속하면 CLI(웹소켓)가 `Unexpected request origin` 403으로 거부
- 로그인은 "처음 설정"에서 만든 관리자 계정

### 결과 읽는 법

- 스테이지 결과는 Job 컨테이너의 종료 코드로 결정

| 종료 코드 | 의미 | 초기 적재 Job | 일일 Job |
|---|---|---|---|
| 0 | 성공. 이미 완료된 JobInstance면 새 실행 없이 0 | SUCCESS | SUCCESS |
| 75 | 호출 한도 도달 | SUCCESS, 빌드 설명에 `<Job 이름>: 한도 도달, 내일 이어감` | UNSTABLE |
| 1, 2 | 앱 실패 | FAILURE | FAILURE |
| 143, 137 | 신호로 종료(143은 앱이 즉시 종료, 137은 강제 종료). 둘 다 종료 줄 없음, 실행은 `STARTED`로 남음 | ABORTED | ABORTED |
| 125, 126, 127 | `docker run` 오류(이미지 없음, `job.env` 읽기 실패 등) | FAILURE | FAILURE |
| 그 밖의 값 | 알 수 없는 오류 | FAILURE | FAILURE |

- 종료 줄 `Job 종료: <Job 이름> 상태 <상태> 종료 코드 <코드>`는 앱이 정상 종료한 경우(종료 코드 0, 1, 2, 75)에만 로그에 한 줄 기록. 종료 줄이 없고 Jenkins 결과가 ABORTED이면 중단된 실행
- 빌드 결과는 스테이지 결과 중 가장 나쁜 값(SUCCESS, UNSTABLE, FAILURE, ABORTED 순)
- 화면에서 사람이 중단하면 빌드는 ABORTED, 중단 시점의 스테이지만 ABORTED이고 남은 스테이지는 실행되지 않음(NOT_EXECUTED)
- 빌드 설명에 스테이지마다 `<Job 이름>: 이미지 태그 <태그>` 한 줄.
- `.env.deploy`에서 `IMAGE_TAG`를 읽지 못하면(파일 없음, `IMAGE_TAG` 줄 없음, 빈 값) Job 컨테이너를 띄우지 않고 그 스테이지는 FAILURE
- 콘솔 타임스탬프(`timestamps()`)는 UTC(`Z`)로 표시. 컨테이너 시계와 JVM 시간대는 Asia/Seoul

### 운영

#### 수동 실행

- 지금 빌드: 파라미터가 없어 스테이지 4개를 모두 실행. 한 스테이지만 다시 실행하는 방법은 없음
- Job 컨테이너를 직접 실행하는 것은 금지(위 "배치 Job 주의")

#### cron 켜기와 끄기

- 켜기: 화면에서 수동 빌드를 한 번 실행. `Jenkinsfile`의 `triggers`(`TZ=Asia/Seoul\n0 4 * * *`)가 이 빌드에서 Job에 등록됨. 컷오버 당일 수동 시험이 이 역할
- 끄기: 화면에서 Job을 비활성화(Disable Project). 비활성화는 홈 폴더에 저장되어 컨테이너를 다시 만들어도 유지. 다시 켜려면 활성화
- 확인: `docker compose -f jenkins/compose.yaml exec jenkins grep -E '<spec>|<disabled>' /var/jenkins_home/jobs/jipsee-deal-collect/config.xml`

#### 이미지 갱신

- 월 1회 Jenkins LTS 패치 버전(`.1`, `.2`, `.3`) 확인. `Dockerfile`의 베이스 이미지 태그를 올린 뒤 `docker compose -f jenkins/compose.yaml build`와 `up -d`. 홈 폴더가 호스트에 있어 설정과 기록은 유지
- 베이스 이미지는 버전까지 고정. `latest`와 `lts` 금지. 플러그인은 화면에서 설치하며 버전을 고정하지 않음. 문제가 나오면 베이스를 `2.580.2-lts-jdk21`로 변경

#### 문제 대응

- 종료 코드 125: `docker run` 자체가 실패. 콘솔의 docker 오류 문구 확인. 이미지가 서버에 없거나 `job.env`를 uid 1000이 읽지 못하는 경우, 같은 이름의 Job 컨테이너가 멈춘 채 남아 있는 경우(`docker rm -f jipsee-job-<Job 이름>`)
- Jenkins에서 docker 명령이 권한 오류로 실패: `DOCKER_GID`가 호스트 `docker` 그룹의 gid와 같은지 확인한 뒤 `up -d`. 확인 명령은 "처음 설정"의 확인 단계
- 종료 코드 143, 137: 종료 줄이 없고 `STARTED` 실행이 남음. 다음 실행의 러너가 시작할 때 복구하므로 다시 실행. 복구되지 않을 때의 마지막 수단으로만 "배치 Job 주의"의 SQL 사용

#### 컷오버 롤백

- 순서 고정. 04:00부터 07:00(KST) 밖에 수행. 다음 04:00 전에 끝내지 못하면 그날 Job이 실행되지 않음(Jenkins cron은 꺼지고 컷오버 릴리스 이미지에는 앱 스케줄러가 없음)
- (1) Jenkins cron 끄기: 위 "cron 켜기와 끄기"의 끄기(Job 비활성화). 먼저 하는 이유는 이전 태그 재배포로 앱 스케줄러가 돌아오면 같은 Job이 동시에 실행될 수 있고 앱 락이 없어 서로를 막을 수 없기 때문. cron을 켜지 않았다면(첫 수동 빌드 전) Job이 비활성화이거나 없는지만 확인
- (2) 이전 태그 재배포(둘 중 하나)
  - `main`에서 컷오버 PR을 revert해 머지(자동 배포)
  - GitHub Actions에서 이전 커밋의 배포 실행을 재실행. 이전 태그는 `/opt/jipsee/.prev-tag`로 확인. 그 배포 실행이 남아 있어야 하고, 없으면 revert
- (3) 배포 확인: 실행 요약 `RESULT DEPLOYED`, 재실행이면 `cmp /opt/jipsee/.env.deploy /opt/jipsee/.prev-tag`가 같음, `curl -fs http://127.0.0.1:8090/actuator/health`가 `"status":"UP"`, `docker logs jipsee-app-1`에서 스케줄러 빈과 기동 완료 줄 확인
- (4) Jenkins 알림 규칙 3개(`jipsee-jenkins-down`, `jipsee-jenkins-batch-failed`, `jipsee-jenkins-batch-not-run`) 일시 정지
- (5) 수행한 내용 기록
- 롤백 뒤에는 `main`에서 컷오버 PR을 고친 뒤 다시 진행. `DATA_GO_KR_KEY` 줄은 분리 단계까지 `compose.yaml`에 유지하므로 복원 단계가 없음
- `/opt/jipsee/.prev-tag`는 컷오버 배포 직전에 기록해 두는 이전 태그의 기록이며 `remote-deploy.sh`는 읽지 않음

#### Jenkins 복원

- 앱 롤백과 별개. 앱 롤백은 위 "컷오버 롤백" 참고
- 저장소의 `jenkins/` 복사, 홈 폴더 생성, `jenkins/.env` 재작성, `build`와 `up -d`, "처음 설정"의 화면 설정 다시 수행
- 홈 폴더가 남아 있으면 화면 설정은 필요 없고 `up -d`만 실행
- Job 1회 수동 실행으로 확인. 홈 폴더를 잃으면 이전 빌드 기록은 복구하지 않음(백업 없음)

## 처음 설정

### GitHub

1. Settings, Environments에서 `production` 환경 생성
2. 같은 화면의 Deployment branches and tags를 Selected branches and tags로 바꾸고 `main` 추가. 설정하지 않으면 다른 브랜치도 수동 실행으로 배포 가능
3. `production` 환경의 시크릿으로 등록
   - `VM_HOST`: 서버 주소
   - `VM_USER`: 서버 사용자
   - `VM_SSH_KEY`: 배포 키의 개인키 전체
   - `VM_SSH_HOST_KEY`: `ssh-keyscan -t ed25519 <서버 주소>`의 출력 한 줄(`<서버 주소> ssh-ed25519 AAAA...`)
4. 첫 배포로 ghcr 패키지 `jipsee-backend`가 생기면 Package settings, Manage Actions access에서 `f-lab-edu/jipsee`를 Read 역할로 추가. 조직이 공개 패키지를 막아서 서버가 `GITHUB_TOKEN`으로 받으려면 필요. 첫 배포가 이미지 받기에서 실패하면 이 설정 뒤 다시 실행

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
2. 스키마 복사: 저장소의 `backend/schema/`를 서버 `/opt/jipsee/db/schema/`로 복사(`mkdir -p db` 먼저)
3. 폴더 만들기
   - `sudo install -d -o 1000 -g ubuntu -m 775 /var/log/jipsee/app`
   - `sudo install -d -m 755 /var/lib/jipsee/fluent-bit`
4. 저장소의 `infra/compose.yaml`, `infra/db/compose.yaml`, `infra/fluent-bit/fluent-bit.conf`를 같은 경로로, `infra/remote-deploy.sh`를 `bin/remote-deploy.sh`로 복사하고 `chmod 755 bin/remote-deploy.sh`
5. `.env`에 로그 업로드 변수 3개 추가
6. DB 실행: `docker compose -f db/compose.yaml --env-file .env up -d mysql`. 앱이 붙는 네트워크 `jipsee-db`도 이때 생성
7. 스키마 적용: 저장소의 `backend/schema/`를 `db/schema/`로 복사한 뒤 `docker compose -f db/compose.yaml --env-file .env --profile schema run --rm flyway`
8. Actions에서 `deploy-backend`를 `main`으로 수동 실행해 앱 실행
9. 로그 전송 실행: `docker compose --env-file .env --env-file .env.deploy up -d --no-deps fluent-bit`. `.env.deploy`가 있어야 해서 첫 배포 뒤에 실행

### Jenkins

`/opt/jipsee`에서 실행. 선행 조건은 위 "서버" 절차를 마친 앱과 DB 실행 상태

1. 홈 폴더 만들기: `sudo install -d -o 1000 -g 1000 -m 755 /var/lib/jipsee-jenkins`
2. `job.env` 작성: 앱과 같은 값 4개(`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `DATA_GO_KR_KEY`). `umask 077`로 만든 뒤 `sudo chown ubuntu:1000 job.env && chmod 640 job.env`. 값은 화면에 출력하지 않음
3. Jenkins 파일 복사와 환경 변수 파일 작성
   - `infra/jenkins/`의 `compose.yaml`, `Dockerfile`을 `jenkins/`로
   - `jenkins/.env`: `DOCKER_GID`(`getent group docker | cut -d: -f3`의 값). `chmod 600`
4. 이미지 빌드와 실행: `docker compose -f jenkins/compose.yaml build`, `docker compose -f jenkins/compose.yaml up -d`
5. 확인: `docker compose -f jenkins/compose.yaml exec jenkins sh -c 'docker ps -q >/dev/null && test -r /etc/jipsee/job.env && test -r /etc/jipsee/.env.deploy && echo OK'`가 `OK`
6. 터널(`ssh -L 8091:127.0.0.1:8091 <서버>`)로 `http://localhost:8091/` 접속. 화면 설정은 처음 한 번만 수행
   1. 잠금 해제: `docker compose -f jenkins/compose.yaml exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword`의 값 입력
   2. 추천 플러그인 설치(git, workflow-aggregator, timestamper 포함)
   3. 관리자 계정 생성, Jenkins URL은 `http://localhost:8091/`
   4. Manage Jenkins, Plugins에서 `prometheus` 플러그인 설치(`plugins.txt` 없이 마법사와 플러그인 관리자로 설치). 모니터링 Prometheus가 jipsee-db 네트워크로 `jenkins:8080`의 `/prometheus/`를 수집
   5. Manage Jenkins, Nodes, Built-In Node, Configure에서 Number of executors를 `1`로 변경
   6. 새 Item에서 이름 `jipsee-deal-collect`, 종류 Pipeline 생성
      - Definition: Pipeline script from SCM, SCM: Git
      - Repository URL: `https://github.com/f-lab-edu/jipsee.git`(공개 저장소, 인증 정보 없음)
      - Branch Specifier: `*/main`
      - Script Path: `infra/jenkins/Jenkinsfile`
      - Lightweight checkout 체크
   7. Build Now로 첫 수동 빌드 실행. `Jenkinsfile`의 옵션과 cron이 이 빌드에서 Job에 반영됨. 컷오버 배포 전에는 이 빌드를 하지 않음

컷오버 배포 전에는 Jenkins 수동 빌드를 하지 않음. 빌드 전에는 cron이 등록되지 않으며, 컷오버 시험을 통과한 첫 수동 빌드가 cron을 켬(위 "cron 켜기와 끄기")

## 서버 운영 명령

`/opt/jipsee`에서 실행. 앱 Compose는 `IMAGE_TAG`가 필요해서 항상 `--env-file .env --env-file .env.deploy` 사용

- 앱 상태: `curl -s http://127.0.0.1:8090/actuator/health`
- 직전 태그로 직접 되돌리기: `cp .env.deploy.prev .env.deploy && docker compose --env-file .env --env-file .env.deploy up -d --no-deps app`
- 스키마 적용: 저장소의 `backend/schema/`를 서버 `/opt/jipsee/db/schema/`로 먼저 복사한 뒤 `docker compose -f db/compose.yaml --env-file .env --profile schema run --rm flyway`. 워크플로는 스키마를 적용하지 않음
- `fluent-bit.conf`를 고친 뒤: `docker compose --env-file .env --env-file .env.deploy restart fluent-bit`
- DB가 내려가 있으면 앱은 재시작을 반복하며 대기
- Jenkins 상태: `docker compose -f jenkins/compose.yaml ps`. 로그는 `docker compose -f jenkins/compose.yaml logs --tail 100 jenkins`
- `jenkins/compose.yaml`이나 `Dockerfile`을 고친 뒤: `docker compose -f jenkins/compose.yaml build`와 `docker compose -f jenkins/compose.yaml up -d`
- 실행 중인 Job 컨테이너: `docker ps --filter name=jipsee-job`

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
- MySQL: `127.0.0.1:3307`
- DB Tool: `127.0.0.1:3307` (SSH)
- Jenkins: `127.0.0.1:8091` (SSH 터널, 접속은 `localhost`로)
