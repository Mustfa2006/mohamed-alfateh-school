@echo off
echo ========================================
echo    Mohamed Al-Fateh School Website
echo    Developer Setup Script
echo ========================================
echo.

echo [1/5] Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo [2/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo [3/5] Checking environment variables...
if not exist .env.local (
    echo WARNING: .env.local file not found!
    echo Please copy .env.local.example to .env.local and configure it.
    echo.
    copy .env.local.example .env.local
    echo Created .env.local from example. Please edit it with your Supabase credentials.
    pause
)

echo [4/5] Building the project...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo [5/5] Starting development server...
echo.
echo ========================================
echo    Setup completed successfully!
echo    Opening http://localhost:3000
echo    Press Ctrl+C to stop the server
echo ========================================
echo.

start http://localhost:3000
call npm run dev

pause
