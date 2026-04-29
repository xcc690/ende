@echo off
chcp 936 >nul

echo === Build Start ===

pip install pyinstaller >nul 2>&1

echo [1/3] Checking dependencies...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found in PATH, required for bundling
    pause
    exit /b 1
)

pip show mitmproxy >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] mitmproxy not installed, run: pip install mitmproxy
    pause
    exit /b 1
)

echo [2/3] PyInstaller packing (main + mitmdump)...
pyinstaller build.spec --noconfirm

echo [3/3] Copying node_modules...
if exist "js_engine\node_modules" (
    xcopy /E /I /Q /Y "js_engine\node_modules" "dist\CryptoProxy\_internal\js_engine\node_modules" >nul
    echo node_modules copied.
) else (
    echo [WARN] js_engine\node_modules not found, run: cd js_engine ^&^& npm install
)

echo.
echo === Build Done ===
echo Output: dist\CryptoProxy\
echo Run: dist\CryptoProxy\CryptoProxy.exe
pause
