# docker CLI 바이너리만 추가, 데몬은 호스트 것을 소켓으로 사용
FROM jenkins/jenkins:2.580.2-lts-jdk25
COPY --from=docker:29-cli /usr/local/bin/docker /usr/local/bin/docker
