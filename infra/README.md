# infra

실거래 수집 배치의 운영 서버 Docker Compose 구성

## 실행 구성

- 앱과 fluent-bit: `compose.yaml`
- DB: `db/compose.yaml`, MySQL과 Flyway
- Jenkins: `jenkins/compose.yaml`, 호스트 Docker 소켓으로 배치 Job 컨테이너 실행
- 배포: GitHub Actions `deploy-backend`

Jenkins는 `127.0.0.1:8091`로만 게시, 접속은 SSH 터널(`ssh -L 8091:127.0.0.1:8091 <서버>`)

## 파일 구성

- `compose.yaml`: 앱과 fluent-bit
- `db/compose.yaml`: MySQL과 Flyway
- `fluent-bit/fluent-bit.conf`: fluent-bit 설정
- `remote-deploy.sh`: 배포 키 접속 시 실행되는 배포 스크립트
- `jenkins/compose.yaml`: Jenkins 컨테이너
- `jenkins/Dockerfile`: Jenkins 이미지
- `jenkins/Jenkinsfile`: 배치 파이프라인
- `job.env`(저장소에 없음, 서버 `/opt/jipsee/job.env`): Job 컨테이너 환경 변수(DB 접속 정보와 공공데이터 API 키)
