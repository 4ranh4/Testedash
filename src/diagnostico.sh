#!/bin/bash

# Script de diagnóstico automático

echo "🔍 DIAGNÓSTICO DO SISTEMA - Ads Dashboard"
echo "=========================================="
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Verificar Node.js
echo "1️⃣ Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js instalado: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js NÃO instalado!${NC}"
fi
echo ""

# 2. Verificar npm
echo "2️⃣ Verificando npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm instalado: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm NÃO instalado!${NC}"
fi
echo ""

# 3. Verificar Docker
echo "3️⃣ Verificando Docker..."
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✅ Docker instalado: $DOCKER_VERSION${NC}"
    
    if docker info &> /dev/null; then
        echo -e "${GREEN}✅ Docker está rodando${NC}"
    else
        echo -e "${RED}❌ Docker NÃO está rodando!${NC}"
    fi
else
    echo -e "${RED}❌ Docker NÃO instalado!${NC}"
fi
echo ""

# 4. Verificar node_modules
echo "4️⃣ Verificando dependências..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules existe${NC}"
else
    echo -e "${RED}❌ node_modules NÃO existe! Execute: npm install${NC}"
fi
echo ""

# 5. Verificar arquivo .env
echo "5️⃣ Verificando arquivo .env..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env existe${NC}"
    echo "Conteúdo:"
    cat .env
else
    echo -e "${RED}❌ .env NÃO existe!${NC}"
    echo "Criando .env..."
    echo "VITE_API_URL=http://localhost:4000/api" > .env
    echo -e "${GREEN}✅ .env criado!${NC}"
fi
echo ""

# 6. Verificar backend
echo "6️⃣ Verificando backend..."
if [ -d "backend" ]; then
    echo -e "${GREEN}✅ Pasta backend existe${NC}"
    
    cd backend
    if docker-compose ps | grep -q "Up"; then
        echo -e "${GREEN}✅ Backend está rodando${NC}"
        
        # Testar endpoint
        if curl -s http://localhost:4000/api/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Backend respondendo em http://localhost:4000${NC}"
        else
            echo -e "${RED}❌ Backend NÃO está respondendo!${NC}"
        fi
    else
        echo -e "${RED}❌ Backend NÃO está rodando!${NC}"
        echo "Execute: cd backend && docker-compose up -d"
    fi
    cd ..
else
    echo -e "${RED}❌ Pasta backend NÃO existe!${NC}"
fi
echo ""

# 7. Verificar portas
echo "7️⃣ Verificando portas..."

# Porta 5173 (Frontend)
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Porta 5173 em uso (Frontend rodando)${NC}"
else
    echo -e "${YELLOW}⚠️  Porta 5173 livre (Frontend NÃO está rodando)${NC}"
fi

# Porta 4000 (Backend)
if lsof -Pi :4000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Porta 4000 em uso (Backend rodando)${NC}"
else
    echo -e "${YELLOW}⚠️  Porta 4000 livre (Backend NÃO está rodando)${NC}"
fi

# Porta 5432 (PostgreSQL)
if lsof -Pi :5432 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Porta 5432 em uso (PostgreSQL rodando)${NC}"
else
    echo -e "${YELLOW}⚠️  Porta 5432 livre (PostgreSQL NÃO está rodando)${NC}"
fi
echo ""

# 8. Resumo
echo "=========================================="
echo "📊 RESUMO DO DIAGNÓSTICO"
echo "=========================================="
echo ""

ALL_OK=true

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Instale Node.js: https://nodejs.org/${NC}"
    ALL_OK=false
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Instale Docker: https://www.docker.com/products/docker-desktop/${NC}"
    ALL_OK=false
fi

if ! docker info &> /dev/null 2>&1; then
    echo -e "${RED}❌ Inicie o Docker Desktop${NC}"
    ALL_OK=false
fi

if [ ! -d "node_modules" ]; then
    echo -e "${RED}❌ Execute: npm install${NC}"
    ALL_OK=false
fi

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env foi criado automaticamente${NC}"
fi

cd backend 2>/dev/null
if ! docker-compose ps | grep -q "Up" 2>/dev/null; then
    echo -e "${RED}❌ Execute: cd backend && docker-compose up -d${NC}"
    ALL_OK=false
fi
cd .. 2>/dev/null

if ! curl -s http://localhost:4000/api/health > /dev/null 2>&1; then
    echo -e "${RED}❌ Backend não está respondendo${NC}"
    ALL_OK=false
fi

echo ""
if $ALL_OK; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ TUDO OK! O sistema deve funcionar!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "🚀 Para iniciar, execute:"
    echo "   ./start-all.sh"
    echo ""
    echo "🌐 Depois acesse:"
    echo "   http://localhost:5173"
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ Há problemas! Corrija os erros acima.${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "📖 Veja: SOLUCAO-TELA-BRANCA.md"
fi
echo ""
