@echo off
REM Starts the ReactMart store (Laravel + React) at http://localhost:8001
cd /d "%~dp0"
if not exist public\build\manifest.json call npm run build
echo.
echo   Store:  http://localhost:8001
echo   Admin:  http://localhost:8001/admin
echo.
"C:\wamp64\bin\php\php8.3.28\php.exe" -d xdebug.mode=off artisan serve --port=8001
pause
