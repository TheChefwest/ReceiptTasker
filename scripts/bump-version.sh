#!/usr/bin/env bash
set -euo pipefail

# Script to bump version in VERSION file and frontend
# Usage: ./scripts/bump-version.sh 1.4.0

NEW_VERSION="${1:-}"
if [[ -z "${NEW_VERSION}" ]]; then
  CURRENT=$(cat VERSION 2>/dev/null || echo "unknown")
  echo "Current version: ${CURRENT}"
  echo "Usage: $0 <new-version>"
  echo "Example: $0 1.4.0"
  exit 1
fi

echo "Updating VERSION file to ${NEW_VERSION}"
echo "${NEW_VERSION}" > VERSION

echo "Updating frontend version display"
sed -i "s/© TaskPrinter v[0-9]\+\.[0-9]\+\.[0-9]\+/© TaskPrinter v${NEW_VERSION}/g" frontend/src/App.tsx

echo "✅ Version bumped to ${NEW_VERSION}"
echo "Next steps:"
echo "  1. Review changes: git diff"
echo "  2. Commit: git add . && git commit -m 'Bump version to ${NEW_VERSION}'"
echo "  3. Release: ./scripts/release.sh"