#!/bin/bash

# MCP Puppeteer Gateway Docker Startup Script
# This script builds and runs the MCP gateway in Docker

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🐳 Building MCP Puppeteer Gateway Docker image..."
echo "Project root: $PROJECT_ROOT"

# Build the Docker image from project root
cd "$PROJECT_ROOT"
if ! docker build -f scripts/Dockerfile.puppeteer -t mcp-gateway:latest .; then
    echo "❌ Docker build failed!"
    exit 1
fi

echo "🚀 Starting MCP Puppeteer Gateway container..."

# Stop and remove existing container if it exists
docker stop mcp-gateway 2>/dev/null || true
docker rm mcp-gateway 2>/dev/null || true

# Run the container
if ! docker run -d \
  --name mcp-gateway \
  --restart unless-stopped \
  -p 9222:9222 \
  -e PUPPETEER_LAUNCH_OPTIONS='{"headless":true,"executablePath":"/usr/bin/chromium","args":["--no-sandbox"]}' \
  mcp-gateway:latest; then
    echo "❌ Failed to start container!"
    exit 1
fi

echo "✅ MCP Puppeteer Gateway started on port 9222"
echo "🔍 Check logs with: docker logs -f mcp-gateway"
echo "🛑 Stop with: docker stop mcp-gateway"
