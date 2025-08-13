#!/bin/bash

# Deployment script for Transformer Asset Dashboard
# This script deploys the application using Docker

set -e

echo "🚀 Starting deployment process for Transformer Asset Dashboard..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker version: $(docker --version)"
echo "✅ Docker Compose version: $(docker-compose --version)"

# Build the application first
echo "🏗️ Building application..."
./scripts/build.sh

# Build Docker image
echo "🐳 Building Docker image..."
docker build -t transformer-dashboard:latest .

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Start the application
echo "🚀 Starting application..."
docker-compose up -d

# Wait for the application to be ready
echo "⏳ Waiting for application to be ready..."
sleep 10

# Check if the application is running
if curl -f http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ Application is running successfully!"
    echo "🌐 Access your application at: http://localhost:8080"
    echo "📊 Container status:"
    docker-compose ps
else
    echo "❌ Application failed to start properly!"
    echo "📋 Container logs:"
    docker-compose logs
    exit 1
fi

echo "🎉 Deployment completed successfully!"
