@echo off
title SupplementTracker - Local Server
cd /d "%~dp0"

echo.
echo  ========================================
echo   SupplementTracker - Local Server
echo  ========================================
echo.

:: ── Try Python 3 ──────────────────────────────────────
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo  [OK] Python found. Starting server on port 8080...
    echo.
    echo  Open your browser and go to:
    echo  http://localhost:8080
    echo.
    echo  Press Ctrl+C to stop the server.
    echo.
    python -m http.server 8080
    goto end
)

:: ── Try Python launcher (py) ───────────────────────────
py --version >nul 2>&1
if %errorlevel% == 0 (
    echo  [OK] Python found via py launcher. Starting on port 8080...
    echo.
    echo  Open your browser and go to:
    echo  http://localhost:8080
    echo.
    echo  Press Ctrl+C to stop the server.
    echo.
    py -m http.server 8080
    goto end
)

:: ── Try Node.js / npx ─────────────────────────────────
npx --version >nul 2>&1
if %errorlevel% == 0 (
    echo  [OK] Node.js found. Starting server via npx serve...
    echo.
    echo  Open your browser and go to:
    echo  http://localhost:3000
    echo.
    echo  Press Ctrl+C to stop the server.
    echo.
    npx serve . -p 3000
    goto end
)

:: ── Nothing found ─────────────────────────────────────
echo  [ERROR] Neither Python nor Node.js was found on your system.
echo.
echo  Please install one of the following:
echo.
echo  Option A - Python (easiest):
echo    https://www.python.org/downloads/
echo    Tick "Add Python to PATH" during install, then re-run this file.
echo.
echo  Option B - Node.js:
echo    https://nodejs.org/
echo    Install, then re-run this file.
echo.

:end
pause
