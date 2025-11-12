#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🚀 Starting Clarelations AI CRM..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ Error: .env.local file not found${NC}"
    echo "Please create .env.local with required environment variables:"
    echo "  - VITE_SUPABASE_URL"
    echo "  - VITE_SUPABASE_ANON_KEY"
    echo "  - OPENAI_API_KEY"
    exit 1
fi

# Check if backend is already running
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  Backend already running on port 3001${NC}"
else
    echo -e "${GREEN}✓ Starting backend server...${NC}"
    npm run backend:dev &
    BACKEND_PID=$!
    
    # Wait for backend to start
    echo "Waiting for backend to start..."
    for i in {1..10}; do
        if curl -s http://localhost:3001/health > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Backend server started successfully!${NC}"
            break
        fi
        sleep 1
        if [ $i -eq 10 ]; then
            echo -e "${RED}❌ Backend failed to start${NC}"
            exit 1
        fi
    done
fi

# Check if frontend is already running
if lsof -Pi :5175 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  Frontend already running on port 5175${NC}"
else
    echo -e "${GREEN}✓ Starting frontend...${NC}"
    npm run dev &
    FRONTEND_PID=$!
    sleep 2
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Clarelations is running!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo ""
echo "📱 Frontend: http://localhost:5175"
echo "🔧 Backend:  http://localhost:3001"
echo "💚 Health:   http://localhost:3001/health"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for user to press Ctrl+C
wait
