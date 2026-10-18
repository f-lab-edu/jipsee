#!/usr/bin/env bash
# BFF /api/health 검증: 빌드 후 next start로 4개 케이스 확인
set -u
cd "$(dirname "$0")/.."

UP_PORT=8099
PIDS=()
FAIL=0

cleanup() {
  for p in "${PIDS[@]:-}"; do [ -n "$p" ] && kill "$p" 2>/dev/null; done
  wait 2>/dev/null
}
trap cleanup EXIT

free_port() { node -e 'const s=require("net").createServer().listen(0,()=>{console.log(s.address().port);s.close()})'; }

start_upstream() {
  node -e '
const http=require("http");
const mode=process.argv[1];
http.createServer((q,r)=>{
  if(mode==="hang")return;
  if(q.url==="/actuator/health"){r.setHeader("content-type","application/json");r.end("{\"status\":\"UP\"}");return}
  r.statusCode=404;r.end();
}).listen(8099);' "$1" &
  UPSTREAM_PID=$!
  PIDS+=("$UPSTREAM_PID")
  sleep 0.5
}

stop_upstream() { kill "$UPSTREAM_PID" 2>/dev/null; wait "$UPSTREAM_PID" 2>/dev/null; }

# $1=API_URL 값 (빈 값이면 미설정)
start_next() {
  NEXT_PORT=$(free_port)
  if [ -n "$1" ]; then
    API_URL="$1" pnpm exec next start -p "$NEXT_PORT" >/dev/null 2>&1 &
  else
    env -u API_URL pnpm exec next start -p "$NEXT_PORT" >/dev/null 2>&1 &
  fi
  NEXT_PID=$!
  PIDS+=("$NEXT_PID")
  for _ in $(seq 1 50); do
    curl -s -o /dev/null "http://localhost:$NEXT_PORT/" && return
    sleep 0.2
  done
  echo "next start 기동 실패"; FAIL=1
}

stop_next() { pkill -P "$NEXT_PID" 2>/dev/null; kill "$NEXT_PID" 2>/dev/null; wait "$NEXT_PID" 2>/dev/null; }

check() { # $1=이름 $2=기대 상태 $3=실제 상태
  if [ "$2" = "$3" ]; then echo "PASS $1 (status $3)"; else echo "FAIL $1 (expected $2, got ${3:0:80})"; FAIL=1; fi
}

echo "== build (API_URL unset)"
env -u API_URL pnpm build || { echo "FAIL build"; exit 1; }

echo "== (a) upstream up"
start_upstream ok
start_next "http://localhost:$UP_PORT"
BODY=$(curl -s -w '\n%{http_code}' "http://localhost:$NEXT_PORT/api/health")
CODE=${BODY##*$'\n'}; BODY=${BODY%$'\n'*}
check "a status" 200 "$CODE"
check "a body" '{"status":"UP"}' "$BODY"

echo "== (b) upstream down"
stop_upstream
CODE=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$NEXT_PORT/api/health")
check "b status" 502 "$CODE"

echo "== (c) upstream hangs"
start_upstream hang
START=$(date +%s)
CODE=$(curl -s -m 10 -o /dev/null -w '%{http_code}' "http://localhost:$NEXT_PORT/api/health")
ELAPSED=$(( $(date +%s) - START ))
check "c status" 502 "$CODE"
if [ "$ELAPSED" -le 5 ]; then echo "PASS c elapsed ${ELAPSED}s"; else echo "FAIL c elapsed ${ELAPSED}s"; FAIL=1; fi
stop_upstream
stop_next

echo "== (d) API_URL unset"
start_next ""
RES=$(curl -s -w '\n%{http_code}' "http://localhost:$NEXT_PORT/api/health")
CODE=${RES##*$'\n'}; MSG=${RES%$'\n'*}
check "d status" 500 "$CODE"
if echo "$MSG" | grep -q "API_URL"; then echo "PASS d cause message: $MSG"; else echo "FAIL d cause message missing: ${MSG:0:80}"; FAIL=1; fi
stop_next

[ "$FAIL" -eq 0 ] && echo "ALL PASS" || echo "SOME FAILED"
exit "$FAIL"
