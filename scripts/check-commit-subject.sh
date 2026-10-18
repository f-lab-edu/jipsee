#!/usr/bin/env bash
# 표준입력의 커밋 제목을 줄마다 검사하고, 위반 제목을 출력한 뒤 종료 코드 1을 반환
bad=$(grep -vE '^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert): .+' || true)
if [ -n "$bad" ]; then
  echo "위반:"
  echo "$bad"
  exit 1
fi
