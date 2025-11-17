#!/bin/bash

# Script de inicialização completa - Frontend + Backend
# Para Linux e macOS

echo "🚀 Iniciando Ads Dashboard..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não está instalado!${NC}"
    echo "Instale o Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Verificar se Docker está rodando
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker não está rodando!${NC}"
    echo "Inicie o Docker Desktop e tente novamente."
    exit 1
fi

echo -e "${BLUE}🐳 Docker detectado e rodando!${NC}"
echo ""

# Iniciar Backend
echo -e "${BLUE}📦 Iniciando Backend (Docker)...${NC}"
cd backend

# Verificar se já está rodando
if docker-compose ps | grep -q "Up"; then
    echo -e "${YELLOW}⚠️  Backend já está rodando. Reiniciando...${NC}"
    docker-compose restart
else
    docker-compose up -d
fi

echo -e "${GREEN}✅ Backend iniciado!${NC}"
echo ""

# Aguardar backend estar pronto
echo -e "${BLUE}⏳ Aguardando backend inicializar...${NC}"
sleep 5

# Verificar se backend respondeu
MAX_ATTEMPTS=30
ATTEMPT=0
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if curl -s http://localhost:4000/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend está online!${NC}"
        break
    fi
    ATTEMPT=$((ATTEMPT + 1))
    echo -n "."
    sleep 1
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo -e "${RED}❌ Backend não respondeu em 30 segundos!${NC}"
    echo "Verifique os logs com: cd backend && docker-compose logs -f"
    exit 1
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ SISTEMA INICIADO COM SUCESSO!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📊 Frontend:${NC} http://localhost:5173"
echo -e "${BLUE}🔌 Backend API:${NC} http://localhost:4000/api"
echo -e "${BLUE}💾 PostgreSQL:${NC} localhost:5432"
echo -e "${BLUE}🗄️  pgAdmin:${NC} http://localhost:5050"
echo ""
echo -e "${YELLOW}📝 O frontend já deve estar rodando automaticamente.${NC}"
echo -e "${YELLOW}   Se não estiver, execute: npm run dev${NC}"
echo ""
echo -e "${BLUE}🛑 Para parar tudo:${NC} ./stop.sh"
echo -e "${BLUE}📋 Ver logs do backend:${NC} cd backend && docker-compose logs -f"
echo ""
echo -e "${GREEN}🎉 Acesse http://localhost:5173 e crie sua conta!${NC}"
echo ""
