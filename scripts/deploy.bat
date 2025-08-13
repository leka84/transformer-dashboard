@echo off
REM Deployment script for Transformer Asset Dashboard (Windows)
REM This script deploys the application using Docker

echo 🚀 Starting deployment process for Transformer Asset Dashboard...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo ✅ Docker version: 
docker --version
echo ✅ Docker Compose version: 
docker-compose --version

REM Build the application first
echo 🏗️ Building application...
call npm run build

REM Build Docker image
echo 🐳 Building Docker image...
docker build -t transformer-dashboard:latest .

REM Stop existing containers
echo 🛑 Stopping existing containers...
docker-compose down

REM Start the application
echo 🚀 Starting application...
docker-compose up -d

REM Wait for the application to be ready
echo ⏳ Waiting for application to be ready...
timeout /t 10 /nobreak >nul

REM Check if the application is running
echo 📊 Container status:
docker-compose ps

echo 🎉 Deployment completed successfully!
echo 🌐 Access your application at: http://localhost:8080
pause
