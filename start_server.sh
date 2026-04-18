#!/bin/bash
cd "$(dirname "$0")"

echo ""
echo " ========================================"
echo "  SupplementTracker - Local Server"
echo " ========================================"
echo ""

# ── Try Python 3 ──────────────────────────────────────
if command -v python3 &>/dev/null; then
    echo " [OK] Python 3 found. Starting server on port 8080..."
    echo ""
    echo " Open your browser and go to:"
    echo " http://localhost:8080"
    echo ""
    echo " Press Ctrl+C to stop the server."
    echo ""
    python3 -m http.server 8080
    exit 0
fi

# ── Try Python 2 ──────────────────────────────────────
if command -v python &>/dev/null; then
    echo " [OK] Python found. Starting server on port 8080..."
    echo ""
    echo " Open your browser and go to:"
    echo " http://localhost:8080"
    echo ""
    echo " Press Ctrl+C to stop the server."
    echo ""
    python -m SimpleHTTPServer 8080
    exit 0
fi

# ── Try Node.js / npx ─────────────────────────────────
if command -v npx &>/dev/null; then
    echo " [OK] Node.js found. Starting server via npx serve..."
    echo ""
    echo " Open your browser and go to:"
    echo " http://localhost:3000"
    echo ""
    echo " Press Ctrl+C to stop the server."
    echo ""
    npx serve . -p 3000
    exit 0
fi

# ── Nothing found ─────────────────────────────────────
echo " [ERROR] Neither Python nor Node.js was found."
echo ""
echo " Install one of:"
echo "   Python: https://www.python.org/downloads/"
echo "   Node:   https://nodejs.org/"
echo ""
