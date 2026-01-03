#!/bin/bash

# Brittany Group API - Start Script
# This script starts the NestJS backend in production mode

echo "🚀 Starting Brittany Group API..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.production template..."
    cp .env.production .env
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci --omit=dev
fi

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "🔨 Building application..."
    npm run build
fi

# Start the application
echo "✅ Starting server..."
NODE_ENV=production node dist/main.js
