#!/bin/bash

# Script de inicialização COMPLETA - Frontend + Backend juntos
# Para Linux e macOS

echo "🚀 Iniciando Ads Dashboard COMPLETO..."
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não instalado!${NC}"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker não está rodando!${NC}"
    exit 1
fi

echo -e "${BLUE}🐳 Docker OK!${NC}"

# Verificar Node
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não instalado!${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm não instalado!${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Node.js OK!${NC}"
echo ""

# 1. Iniciar Backend
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  INICIANDO BACKEND${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cd backend
docker-compose up -d

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao iniciar backend!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend iniciado!${NC}"
cd ..

# 2. Aguardar Backend
echo ""
echo -e "${BLUE}⏳ Aguardando backend ficar pronto...${NC}"
sleep 5

MAX_ATTEMPTS=30
ATTEMPT=0
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if curl -s http://localhost:4000/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend online!${NC}"
        break
    fi
    ATTEMPT=$((ATTEMPT + 1))
    echo -n "."
    sleep 1
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo -e "${RED}❌ Backend não respondeu!${NC}"
    exit 1
fi

# 3. Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo ""
    echo -e "${YELLOW}📦 Instalando dependências do frontend...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Erro ao instalar dependências!${NC}"
        exit 1
    fi
fi

# 4. Iniciar Frontend em background
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  INICIANDO FRONTEND${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Salvar PID do frontend
npm run dev &
FRONTEND_PID=$!
echo $FRONTEND_PID > .frontend.pid

echo -e "${GREEN}✅ Frontend iniciando (PID: $FRONTEND_PID)${NC}"
echo ""

# Aguardar frontend
echo -e "${BLUE}⏳ Aguardando frontend ficar pronto...${NC}"
sleep 3

# Verificar se frontend está rodando
if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Frontend rodando!${NC}"
else
    echo -e "${RED}❌ Frontend falhou ao iniciar!${NC}"
    exit 1
fi

# 5. Resumo final
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ TUDO RODANDO COM SUCESSO!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📊 Frontend:${NC}      http://localhost:5173"
echo -e "${BLUE}🔌 Backend API:${NC}   http://localhost:4000/api"
echo -e "${BLUE}💾 PostgreSQL:${NC}    localhost:5432"
echo -e "${BLUE}🗄️  pgAdmin:${NC}      http://localhost:5050"
echo ""
echo -e "${YELLOW}🎯 Acesse: ${NC}${GREEN}http://localhost:5173${NC}"
echo ""
echo -e "${BLUE}🛑 Para parar tudo:${NC}   ./stop-all.sh"
echo -e "${BLUE}📋 Logs do backend:${NC}   cd backend && docker-compose logs -f"
echo ""
echo -e "${GREEN}Pressione CTRL+C para parar o frontend${NC}"
echo ""

# Manter o script rodando
wait $FRONTEND_PID
