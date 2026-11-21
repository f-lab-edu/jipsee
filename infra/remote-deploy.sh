#!/usr/bin/env bash
# 운영 서버에서 앱 이미지를 교체함
# 표준 입력 3줄: 이미지 태그(커밋 해시), ghcr 사용자 이름, 토큰
# 마지막 줄에 RESULT DEPLOYED, ROLLED_BACK, ROLLBACK_FAILED, FAILED 중 하나를 출력함
set -uo pipefail

DEPLOY_DIR=${DEPLOY_DIR:-/opt/jipsee}
LOG_DIR=${LOG_DIR:-/var/log/jipsee/app}
WAIT_TIMEOUT=${WAIT_TIMEOUT:-60}
LEGACY_IMAGE=${LEGACY_IMAGE:-jipsee-backend:latest}
IMAGE_REPO=ghcr.io/f-lab-edu/jipsee-backend
HEALTH_URL=http://127.0.0.1:8090/actuator/health
KEEP_IMAGES=3

finish() {
  echo "RESULT $1"
  exit "$2"
}

fail() {
  echo "ERROR: $1" >&2
  finish FAILED 1
}

# IMAGE_TAG를 비워 DEPLOY_ENV 파일의 값만 쓰게 함, 기본은 .env.deploy
compose() {
  env -u IMAGE_TAG docker compose --env-file .env --env-file "${DEPLOY_ENV:-.env.deploy}" "$@" </dev/null
}

wait_healthy() {
  local end=$((SECONDS + WAIT_TIMEOUT))
  while [ "$SECONDS" -lt "$end" ]; do
    if curl -fs --max-time 2 "$HEALTH_URL" 2>/dev/null | grep -q '"status":"UP"'; then
      return 0
    fi
    sleep 2
  done
  return 1
}

deploy_app() {
  compose up -d --no-deps --wait --wait-timeout "$WAIT_TIMEOUT" app >/dev/null && wait_healthy
}

# 지금 태그, 직전 태그, 만든 시각이 가장 최근인 나머지를 합쳐 KEEP_IMAGES개만 남기고 지움
remove_old_images() {
  local ref prev_tag
  prev_tag=$(sed -n 's/^IMAGE_TAG=//p' .env.deploy.prev 2>/dev/null)
  docker images "$IMAGE_REPO" --format '{{.Repository}}:{{.Tag}}' | grep -v '<none>' |
    while read -r ref; do
      echo "$(docker image inspect -f '{{.Created}}' "$ref") $ref"
    done | sort -r | awk '{print $2}' | grep -vFx -e "$IMAGE_REPO:$tag" -e "$IMAGE_REPO:$prev_tag" |
    tail -n +"$((KEEP_IMAGES - 1))" |
    while read -r ref; do
      docker rmi "$ref" >/dev/null 2>&1 || true
    done
  # 옛 로컬 이미지는 쓰는 컨테이너가 없을 때만 지움
  if docker image inspect "$LEGACY_IMAGE" >/dev/null 2>&1 &&
    [ -z "$(docker ps -a -q --filter "ancestor=$LEGACY_IMAGE")" ]; then
    docker rmi "$LEGACY_IMAGE" >/dev/null 2>&1 || true
  fi
}

# 1. 입력 검증
read -r -t 30 tag || fail "이미지 태그를 읽지 못함"
read -r -t 30 user || fail "ghcr 사용자 이름을 읽지 못함"
read -r -t 30 token || fail "토큰을 읽지 못함"
[[ $tag =~ ^[0-9a-f]{40}$ ]] || fail "이미지 태그는 40자리 소문자 16진수여야 함"
[[ $user =~ ^[A-Za-z0-9-]{1,39}$ ]] || fail "ghcr 사용자 이름 형식이 틀림"
[ -n "$token" ] || fail "토큰이 비어 있음"

# 2. 서버 준비 확인
cd "$DEPLOY_DIR" 2>/dev/null || fail "$DEPLOY_DIR 없음"
for f in .env compose.yaml; do
  [ -f "$f" ] || fail "$f 없음"
done
[ -d "$LOG_DIR" ] || fail "$LOG_DIR 없음"
command -v flock >/dev/null || fail "flock 없음"
exec 9>.deploy.lock
flock -n 9|| fail "다른 배포가 실행 중임"
docker network inspect jipsee-db >/dev/null 2>&1 || fail "네트워크 jipsee-db 없음"

# 3. 이미지 받기, 도커 설정은 임시 폴더만 씀
docker_config=$(mktemp -d) || fail "임시 폴더를 만들지 못함"
trap 'rm -rf "$docker_config"' EXIT
printf '%s' "$token" |
  DOCKER_CONFIG=$docker_config docker login ghcr.io -u "$user" --password-stdin >/dev/null ||
  fail "ghcr 로그인 실패, 토큰 확인"
DOCKER_CONFIG=$docker_config docker pull "$IMAGE_REPO:$tag" >/dev/null ||
  fail "이미지 받기 실패, 토큰 권한과 디스크 확인"
DOCKER_CONFIG=$docker_config docker logout ghcr.io >/dev/null 2>&1
unset token

# 4. 교체, 7일이 지난 실패 로그는 지움
find "$LOG_DIR" -name 'deploy-failed-*.log' -mtime +7 -delete
if [ -f .env.deploy ]; then
  cp .env.deploy .env.deploy.prev || fail ".env.deploy.prev를 쓰지 못함"
else
  rm -f .env.deploy.prev
fi
printf 'IMAGE_TAG=%s\n' "$tag" >.env.deploy.next || fail ".env.deploy.next를 쓰지 못함"

# 새 태그는 .env.deploy.next로 띄우고, 헬스 체크를 통과한 뒤에만 .env.deploy로 바꿈
if DEPLOY_ENV=.env.deploy.next deploy_app; then
  mv .env.deploy.next .env.deploy || fail ".env.deploy를 쓰지 못함"
  remove_old_images
  echo "배포 완료: $tag"
  finish DEPLOYED 0
fi

# 5. 실패하면 로그를 저장하고 이전 태그로 되돌림
failed_log=$LOG_DIR/deploy-failed-${tag:0:7}.log
DEPLOY_ENV=.env.deploy.next compose logs --no-color app >"$failed_log" 2>&1
echo "--- 앱 로그 마지막 30줄"
tail -n 30 "$failed_log"
if [ -f .env.deploy.prev ]; then
  rm -f .env.deploy.next
  if deploy_app; then
    finish ROLLED_BACK 1
  fi
  finish ROLLBACK_FAILED 1
fi

# 최초 배포라 되돌릴 대상이 없으면 앱을 멈춤
DEPLOY_ENV=.env.deploy.next compose stop app >/dev/null 2>&1
rm -f .env.deploy.next
finish FAILED 1
