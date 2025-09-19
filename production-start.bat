@echo off
echo ========================================
echo    Mohamed Al-Fateh School Website
echo    Production Server
echo ========================================
echo.

echo Building for production...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo Starting production server...
echo Server will be available at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

call npm start
pause
