#!/usr/bin/env bash
set -euo pipefail
docker rm -f receipttasker-dev >/dev/null 2>&1 || true
echo "🛑 Stopped receipttasker-dev"
