# 0009. Prometheus, Loki, Grafana 기반 모니터링 구성

## 상태

- 채택 (2026-11-17)

## 맥락

- 앱은 `/actuator/health`만 노출해서 요청 수, 응답 시간, 에러율, 자원 사용량을 볼 수 없음
- 앱 로그는 Object Storage에만 있어 화면에서 검색할 수 없음
- 수집 실패나 앱 다운을 알릴 방법이 없음

## 결정

### 같은 서버에 모니터링 스택 구성

- Prometheus(15일치 지표), Loki(30일치 로그, Object Storage (Oracle의 S3) 저장), Grafana(대시보드, 로그 검색, 알림)
- 수집은 node-exporter(서버), cadvisor(컨테이너), mysqld-exporter(MySQL), fluent-bit(앱 로그) 로 진행
- 메모리 상한 합계 약 2.4GB

### 알림

- 앱 다운, 5xx 증가, 배치 Job 실패, 디스크, 메모리, 컨테이너 재시작, ERROR 로그 급증, 모니터링 등의 규칙을 미리 정의
- 알림 채널은 환경 변수로 연결. 채널은 아직 미정

## 대안

- Grafana Cloud 무료 플랜: 직접 구성 경험을 위해 채택하지 않음
- 별도 VM에 Grafana 분리: 비용 때문에 채택하지 않음

## 결과

- 같은 서버라서 서버 전체가 죽으면 알림 불가
- 분산 추적과 nginx 접근 로그는 범위 밖
