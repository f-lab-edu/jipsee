# 0003. Jenkins 구성 단순화

## 상태

- 채택 (2026-11-20)

## 맥락

- 배치 실행을 Jenkins로 옮기는 결정(0002)에 따라 Jenkins가 배치 Job 컨테이너 실행
- 서버의 모든 구성 요소는 Docker Compose로 운영

## 결정

### Docker로 설치

- `jenkins/jenkins` LTS 이미지에 docker CLI를 추가하고 호스트 Docker 소켓 마운트
- Jenkinsfile이 Job마다 `docker run --rm`으로 `ghcr.io/f-lab-edu/jipsee-batch:<태그>` 컨테이너를 직접 실행
  - 태그는 `.env.deploy`의 `IMAGE_TAG`에서 읽음
- Jenkinsfile 위치: `infra/jenkins/Jenkinsfile`(#25)

### 설정 최소화

- 실행 시각(cron 04:00 KST)과 실패 알림(웹훅 호출)은 Jenkinsfile에서 관리
- 나머지 설정은 Jenkins UI에서 수행
- JCasC는 사용하지 않음
- 배치 대시보드는 Jenkins Prometheus 플러그인 지표로 구성

## 대안

- 서버에 직접 설치: 서버가 Docker Compose로 통일되어 있어 채택하지 않음
- ssh와 `run-job.sh` 경유: 소켓 직접 실행이 더 단순하여 채택하지 않음

## 결과

- Docker 소켓의 권한은 호스트 root와 동등하지만 이 위험은 수용. Jenkins는 nginx를 통해 HTTPS URL로 구성하고, Jenkins 로그인으로만 접속 허용
- 플러그인과 설정은 Jenkins 홈 디렉터리에 저장되어 저장소에 남지 않음
- cron 등록은 첫 수동 빌드 이후
