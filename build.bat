@echo off
chcp 936 >nul

echo === Build Start ===

pip install pyinstaller >nul 2>&1

echo [1/2] PyInstaller packing...
pyinstaller build.spec --noconfirm

echo [2/2] Check dependencies...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARN] Node.js not found in PATH
)

where mitmdump >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARN] mitmdump not found, run: pip install mitmproxy
)

echo.
echo === Build Done ===
echo Output: dist\
pause
