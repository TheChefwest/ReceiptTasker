#!/usr/bin/env bash
set -euo pipefail

# Config (override via env)
NAMESPACE="${DOCKERHUB_NAMESPACE:-chefwest}"
IMAGE="${IMAGE_NAME:-receipttasker}"
VITE_API_BASE="${VITE_API_BASE:-/api}"

# Args
TAG="${1:-}"
if [[ -z "${TAG}" ]]; then
  echo "Usage: $0 <tag>"; exit 1
fi

FQIN="docker.io/${NAMESPACE}/${IMAGE}:${TAG}"

if [[ "${USE_BUILDX:-0}" == "1" ]]; then
  docker buildx create --use >/dev/null 2>&1 || true
  docker buildx build \
    --platform "${PLATFORMS:-linux/amd64,linux/arm64}" \
    -t "${FQIN}" \
    -t "docker.io/${NAMESPACE}/${IMAGE}:latest" \
    --build-arg VITE_API_BASE="${VITE_API_BASE}" \
    --push .
else
  docker build -t "${FQIN}" --build-arg VITE_API_BASE="${VITE_API_BASE}" .
  docker tag "${FQIN}" "docker.io/${NAMESPACE}/${IMAGE}:latest"
  echo "Logging in to Docker Hub (you can skip if already logged in)…"
  docker login docker.io
  docker push "${FQIN}"
  docker push "docker.io/${NAMESPACE}/${IMAGE}:latest"
fi

echo "✅ Pushed ${FQIN}"
