#!/bin/bash

# Brittany Group API - Stop Script
# This script stops the running NestJS backend

echo "🛑 Stopping Brittany Group API..."

# Find and kill the process running on port 3001
PID=$(lsof -ti:3001)

if [ -z "$PID" ]; then
    echo "⚠️  No process found running on port 3001"
else
    echo "🔍 Found process $PID running on port 3001"
    kill -9 $PID
    echo "✅ Process stopped successfully"
fi
