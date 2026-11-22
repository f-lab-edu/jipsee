#!/usr/bin/env bash
# 로컬 실행: ./backend/local.sh api | ./backend/local.sh batch <Job 이름>
set -euo pipefail
cd "$(dirname "$0")/.."
app=${1:-}
if [[ $app != api && ! ($app == batch && -n ${2:-}) ]]; then
  echo "사용법: $0 api | $0 batch <Job 이름>" >&2
  exit 1
fi
docker compose -f backend/compose.yaml up -d --wait mysql
docker compose -f backend/compose.yaml -f backend/compose.schema.yaml run --rm flyway
conf=backend/core/src/main/resources/jipsee-core-local.yml
[[ -f "$conf" ]] || cp "$conf.example" "$conf"
cd backend
if [[ "$app" = batch ]]; then
  # DATA_GO_KR_KEY가 환경 변수에 없으면 ~/.config/jipsee/env에서 읽음
  if [[ -z "${DATA_GO_KR_KEY:-}" ]] && [[ -f ~/.config/jipsee/env ]]; then
    # shellcheck source=/dev/null
    set -a && . ~/.config/jipsee/env && set +a
  fi
  JIPSEE_BATCH_RUN_JOB=$2 ./gradlew :batch:bootRun
else
  ./gradlew :api:bootRun
fi
