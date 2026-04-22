@echo off
echo 🚀 EV Charging Optimization - Local Setup
echo ========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found. Please install from https://nodejs.org
    exit /b 1
)

REM Check Docker
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker not found. Please install from https://www.docker.com
    exit /b 1
)

echo ✓ Node.js is available
echo ✓ Docker is available
echo.

REM Setup backend
echo 📦 Setting up backend...
cd backend
call npm install
cd ..

REM Setup frontend
echo 📦 Setting up frontend...
cd frontend
call npm install
cd ..

echo.
echo ✅ Setup complete!
echo.
echo Start local development with:
echo   docker-compose up
echo.
echo Or manually:
echo   Terminal 1: cd backend ^&^& npm start
echo   Terminal 2: cd frontend ^&^& npm start
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
