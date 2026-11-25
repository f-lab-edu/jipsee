#!/usr/bin/env bash
set -euo pipefail
cd /opt/jipsee
set -a; . backup/backup.env; set +a
F=/tmp/jipsee-$(date -u +%Y%m%dT%H%M%SZ).sql.gz

docker compose -f db/compose.yaml --env-file .env exec -T mysql sh -c \
  'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --single-transaction --routines --triggers jipsee' | gzip > "$F"
zcat "$F" | tail -1 | grep -q -- '-- Dump completed' || { rm -f "$F"; echo "dump check failed"; exit 1; }

aws() { docker run --rm -e AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY -e AWS_DEFAULT_REGION \
  -e AWS_REQUEST_CHECKSUM_CALCULATION=when_required -e AWS_RESPONSE_CHECKSUM_VALIDATION=when_required \
  -v /tmp:/tmp amazon/aws-cli:2.40.3 --endpoint-url "$S3_ENDPOINT" "$@"; }

aws s3 cp "$F" "s3://$BACKUP_BUCKET/mysql/$(basename "$F")"
rm -f "$F"
# 최신 7개만 남김
aws s3 ls "s3://$BACKUP_BUCKET/mysql/" | awk '{print $4}' | sort | head -n -7 | while read -r k; do
  aws s3 rm "s3://$BACKUP_BUCKET/mysql/$k"
done
