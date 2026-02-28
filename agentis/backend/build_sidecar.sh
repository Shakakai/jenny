#!/bin/bash
set -e

echo "Building Agentis backend sidecar..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
BINARY_DIR="$REPO_ROOT/src-tauri/binaries"

mkdir -p "$BINARY_DIR"

cd "$SCRIPT_DIR"

# Create virtual environment and install dependencies
uv venv .venv --python 3.11
source .venv/bin/activate
uv pip install -r requirements.txt pyinstaller

# Build binary with PyInstaller
pyinstaller \
  --onefile \
  --name agentis-backend \
  --distpath "$BINARY_DIR" \
  --workpath /tmp/agentis-build \
  --specpath /tmp/agentis-build \
  main.py

# Rename to Tauri expected format: name-arch-os
ARCH=$(uname -m)
if [ "$ARCH" = "arm64" ]; then
  TAURI_ARCH="aarch64"
else
  TAURI_ARCH="x86_64"
fi

mv "$BINARY_DIR/agentis-backend" \
   "$BINARY_DIR/agentis-backend-$TAURI_ARCH-apple-darwin"

echo "Sidecar built: $BINARY_DIR/agentis-backend-$TAURI_ARCH-apple-darwin"
deactivate
