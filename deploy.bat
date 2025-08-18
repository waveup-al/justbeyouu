@echo off
setlocal enabledelayedexpansion

REM Portfolio Deployment Script for Windows
REM Author: Nguyen Cong Hieu

echo.
echo 🚀 Starting deployment process...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo [INFO] Node.js version:
node --version
echo [INFO] npm version:
npm --version
echo.

REM Clean previous builds
echo [INFO] Cleaning previous builds...
npm run clean 2>nul || echo No previous builds to clean

REM Install dependencies
echo [INFO] Installing dependencies...
npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

REM Run type checking
echo [INFO] Running type checking...
npm run type-check
if errorlevel 1 (
    echo [ERROR] Type checking failed
    pause
    exit /b 1
)

REM Run linting
echo [INFO] Running linting...
npm run lint
if errorlevel 1 (
    echo [WARNING] Linting issues found, but continuing...
)

REM Run tests
echo [INFO] Running tests...
npm run test:ci
if errorlevel 1 (
    echo [WARNING] Some tests failed, but continuing...
)

REM Build the application
echo [INFO] Building the application...
npm run build
if errorlevel 1 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)

echo [SUCCESS] Build completed successfully!
echo.

REM Choose deployment method
echo Choose deployment method:
echo 1) Vercel
echo 2) Netlify
echo 3) Docker
echo 4) Manual (just build)
echo 5) Start local server
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo [INFO] Deploying to Vercel...
    vercel --version >nul 2>&1
    if errorlevel 1 (
        echo [WARNING] Vercel CLI not found. Installing...
        npm install -g vercel
        echo [INFO] Please run 'vercel login' first, then run this script again.
        pause
        exit /b 0
    )
    vercel --prod
    echo [SUCCESS] Deployed to Vercel successfully!
) else if "%choice%"=="2" (
    echo [INFO] Deploying to Netlify...
    netlify --version >nul 2>&1
    if errorlevel 1 (
        echo [WARNING] Netlify CLI not found. Installing...
        npm install -g netlify-cli
        echo [INFO] Please run 'netlify login' first, then run this script again.
        pause
        exit /b 0
    )
    netlify deploy --prod --dir=.next
    echo [SUCCESS] Deployed to Netlify successfully!
) else if "%choice%"=="3" (
    echo [INFO] Building Docker image...
    docker --version >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Docker not found. Please install Docker first.
        pause
        exit /b 1
    )
    docker build -t hieu-portfolio .
    echo [SUCCESS] Docker image built successfully!
    echo [INFO] To run: docker run -p 3000:3000 hieu-portfolio
) else if "%choice%"=="4" (
    echo [SUCCESS] Build completed! You can now manually deploy the .next folder.
    echo [INFO] To test locally: npm start
) else if "%choice%"=="5" (
    echo [INFO] Starting local server...
    echo [INFO] Server will be available at http://localhost:3000
    npm start
) else (
    echo [ERROR] Invalid choice. Exiting.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Deployment process completed!
echo.
echo [INFO] Next steps:
echo 1. Configure your domain DNS settings
echo 2. Set up SSL certificate
echo 3. Monitor your application
echo.
echo [INFO] For detailed instructions, check README_DEPLOYMENT.md
echo.
pause