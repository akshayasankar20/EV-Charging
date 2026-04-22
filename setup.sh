#!/bin/bash

echo "🚀 EV Charging Optimization - Local Setup"
echo "========================================"
echo ""

# Check dependencies
echo "✓ Checking dependencies..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker from https://www.docker.com"
    exit 1
fi

echo "✓ Node.js: $(node --version)"
echo "✓ Docker: $(docker --version)"
echo ""

# Setup backend
echo "📦 Setting up backend..."
cd backend
npm install
cd ..

# Setup frontend
echo "📦 Setting up frontend..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Start local development with:"
echo "  docker-compose up"
echo ""
echo "Or manually:"
echo "  Terminal 1: cd backend && npm start"
echo "  Terminal 2: cd frontend && npm start"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
