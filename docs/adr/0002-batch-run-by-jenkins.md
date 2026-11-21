# 0002. 배치 실행을 앱 내부 스케줄러에서 Jenkins로 변경

## 상태

- 채택 (2026-11-18)

## 맥락

- 앱 내부 스케줄러가 수집 Job을 실행
- 앱 배포 시 실행 중이던 Job이 중지될 수 있음
- 중지된 Job은 실행 상태가 `STARTED`로 남아서, 수동으로 `FAILED`로 바꾸기 전에는 재실행되지 않음

## 결정

### Job 실행 주체를 Jenkins로 변경

- Jenkins가 서버 위에서 별개의 컨테이너로 돌고, 그 안에서 배치 Job 컨테이너를 따로 띄우는 구조
- Jenkins가 Job마다 컨테이너를 실행하고 종료 코드를 결과로 사용
- 앱 내부 스케줄러는 삭제
- Docker 컨테이너는 스프링 부트 앱과 동일한 이미지를 사용하고, `jipsee.batch.run.job` 속성이 지정된 경우에만 `BatchJobRunner`가 Job 하나를 실행하고 종료

### 중복 실행 방지와 종료 코드

- 중복 실행은 Jenkins의 `disableConcurrentBuilds` 설정과 Docker 컨테이너 이름을 하나로 고정해서 방지
- `BatchJobRunner`는 Job 시작 전에 남아 있는 `STARTED` 실행을 모두 `FAILED`로 강제 변경
- `BatchJobRunner`에서 상황에 따라 종료 코드 반환
  - 종료 코드 0은 성공, 75는 공공데이터 호출 한도 초과(그때까지의 진행분은 임시 저장), 그 밖의 값은 실패를 의미
  - Jenkins가 코드별로 결과 구분

## 대안

- Spring Boot 기본 러너와 `CommandLineJobOperator`: 실패 유형별 종료 코드를 구분할 수 없어 채택하지 않음
- 앱 스케줄러 유지와 잠금 추가: 구현이 복잡하여 채택하지 않음

## 결과

- 스프링 부트 앱 Docker 컨테이너가 Job을 실행하지 않으므로 앱 배포와 배치 Job이 격리됨
