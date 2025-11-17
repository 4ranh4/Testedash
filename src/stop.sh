#!/bin/bash

# Script para parar todos os serviços
# Para Linux e macOS

echo "🛑 Parando Ads Dashboard..."
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Parar Backend
echo -e "${BLUE}📦 Parando Backend...${NC}"
cd backend
docker-compose down

echo -e "${GREEN}✅ Backend parado!${NC}"
echo ""

echo -e "${YELLOW}⚠️  Frontend (npm run dev) precisa ser parado manualmente com CTRL+C${NC}"
echo ""
echo -e "${GREEN}✅ Serviços parados com sucesso!${NC}"
