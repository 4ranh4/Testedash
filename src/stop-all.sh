#!/bin/bash

# Script para parar TUDO (Frontend + Backend)
# Para Linux e macOS

echo "🛑 Parando Ads Dashboard COMPLETO..."
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Parar Frontend
if [ -f ".frontend.pid" ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    echo -e "${BLUE}🌐 Parando Frontend (PID: $FRONTEND_PID)...${NC}"
    
    if ps -p $FRONTEND_PID > /dev/null; then
        kill $FRONTEND_PID
        echo -e "${GREEN}✅ Frontend parado!${NC}"
    else
        echo -e "${YELLOW}⚠️  Frontend já estava parado${NC}"
    fi
    
    rm .frontend.pid
else
    echo -e "${YELLOW}⚠️  Frontend PID não encontrado${NC}"
    echo -e "${BLUE}Tentando matar processos npm/vite...${NC}"
    pkill -f "vite" 2>/dev/null
fi

echo ""

# Parar Backend
echo -e "${BLUE}📦 Parando Backend...${NC}"
cd backend
docker-compose down

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend parado!${NC}"
else
    echo -e "${RED}❌ Erro ao parar backend${NC}"
fi

cd ..

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Todos os serviços foram parados!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
