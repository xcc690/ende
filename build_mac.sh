#!/bin/bash
set -e

echo "=== Build CryptoProxy for macOS ==="

pip3 install pyinstaller >/dev/null 2>&1 || true

echo "[1/2] PyInstaller packing..."
pyinstaller build.spec --noconfirm

echo "[2/2] Check dependencies..."
if ! command -v node &>/dev/null; then
    echo "[WARN] Node.js not found. Install: brew install node"
fi
if ! command -v mitmdump &>/dev/null; then
    echo "[WARN] mitmdump not found. Install: pip3 install mitmproxy"
fi

echo ""
echo "=== Build Done ==="
echo "Output: dist/CryptoProxy.app"
echo ""
echo "To run: open dist/CryptoProxy.app"
echo "Note: Target machine needs Node.js and mitmproxy in PATH"
