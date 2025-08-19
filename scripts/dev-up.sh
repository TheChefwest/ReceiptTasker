#!/usr/bin/env bash
set -euo pipefail
docker rm -f receipttasker-dev >/dev/null 2>&1 || true

docker run -d --name receipttasker-dev \
  -e TZ="${TZ:-Europe/Amsterdam}" \
  -e PRINTER_IP="${PRINTER_IP:-192.168.2.34}" \
  -e PRINTER_PORT="${PRINTER_PORT:-9100}" \
  -e DATABASE_URL="${DATABASE_URL:-sqlite:////data/app.db}" \
  -v receipttasker_data:/data \
  -p "${HOST_PORT:-8080}:8000" \
  receipttasker:dev

echo "✅ Up at http://localhost:${HOST_PORT:-8080}/"
