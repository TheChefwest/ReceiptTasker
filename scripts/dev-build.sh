#!/usr/bin/env bash
set -euo pipefail
docker build -t receipttasker:dev --build-arg VITE_API_BASE=/api .
echo "✅ Built receipttasker:dev"
