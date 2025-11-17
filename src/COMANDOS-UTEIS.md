# 🛠️ COMANDOS ÚTEIS - Ads Dashboard

## 🚀 INICIAR/PARAR

### Iniciar Tudo (Frontend + Backend)
```bash
# Windows
start-all.bat

# Linux/Mac
./start-all.sh
```

### Parar Tudo
```bash
# Windows
stop-all.bat

# Linux/Mac
./stop-all.sh
```

### Iniciar Apenas Backend
```bash
cd backend
docker-compose up -d
```

### Iniciar Apenas Frontend
```bash
npm run dev
```

---

## 🐳 DOCKER

### Ver Containers Rodando
```bash
cd backend
docker-compose ps
```

### Ver Logs do Backend
```bash
cd backend
docker-compose logs -f
```

### Ver Logs de um Serviço Específico
```bash
cd backend
docker-compose logs -f app      # API
docker-compose logs -f db       # PostgreSQL
docker-compose logs -f pgadmin  # pgAdmin
```

### Reiniciar Backend
```bash
cd backend
docker-compose restart
```

### Parar Backend
```bash
cd backend
docker-compose down
```

### Parar e Remover Volumes (⚠️ APAGA DADOS!)
```bash
cd backend
docker-compose down -v
```

### Rebuild do Backend
```bash
cd backend
docker-compose build --no-cache
docker-compose up -d
```

---

## 💾 BANCO DE DADOS

### Acessar PostgreSQL via CLI
```bash
cd backend
docker-compose exec db psql -U postgres -d ads_dashboard
```

### Comandos Úteis do PostgreSQL
```sql
-- Ver todas as tabelas
\dt

-- Ver usuários
SELECT * FROM "User";

-- Ver plataformas conectadas
SELECT * FROM "Platform";

-- Ver campanhas
SELECT * FROM "Campaign";

-- Ver métricas
SELECT * FROM "Metric";

-- Sair
\q
```

### Resetar Banco de Dados
```bash
cd backend
docker-compose down -v
docker-compose up -d
# Aguardar 15 segundos
docker-compose exec app npx prisma migrate deploy
```

### Backup do Banco
```bash
cd backend
docker-compose exec db pg_dump -U postgres ads_dashboard > backup.sql
```

### Restaurar Backup
```bash
cd backend
docker-compose exec -T db psql -U postgres ads_dashboard < backup.sql
```

---

## 📦 NPM (Frontend)

### Instalar Dependências
```bash
npm install
```

### Atualizar Dependências
```bash
npm update
```

### Limpar Cache e Reinstalar
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build para Produção
```bash
npm run build
```

### Preview do Build
```bash
npm run preview
```

---

## 🔍 DEBUG

### Ver Variáveis de Ambiente (Frontend)
```bash
# Windows
type .env

# Linux/Mac
cat .env
```

### Ver Variáveis de Ambiente (Backend)
```bash
# Windows
type backend\.env

# Linux/Mac
cat backend/.env
```

### Testar Conexão com Backend
```bash
curl http://localhost:4000/api/health
```

### Testar Conexão com PostgreSQL
```bash
cd backend
docker-compose exec db pg_isready -U postgres
```

### Ver Processos Node Rodando
```bash
# Windows
tasklist | findstr node

# Linux/Mac
ps aux | grep node
```

### Matar Processos Node
```bash
# Windows
taskkill /F /IM node.exe

# Linux/Mac
pkill -f node
```

---

## 🔌 PORTAS

### Verificar Porta em Uso (Windows)
```bash
# Porta 5173 (Frontend)
netstat -ano | findstr :5173

# Porta 4000 (Backend)
netstat -ano | findstr :4000

# Porta 5432 (PostgreSQL)
netstat -ano | findstr :5432
```

### Verificar Porta em Uso (Linux/Mac)
```bash
# Porta 5173 (Frontend)
lsof -i :5173

# Porta 4000 (Backend)
lsof -i :4000

# Porta 5432 (PostgreSQL)
lsof -i :5432
```

### Liberar Porta (Windows)
```bash
# Encontre o PID
netstat -ano | findstr :5173

# Mate o processo
taskkill /PID [NUMERO] /F
```

### Liberar Porta (Linux/Mac)
```bash
# Mata processo na porta 5173
lsof -ti:5173 | xargs kill -9

# Ou
sudo kill -9 $(lsof -t -i:5173)
```

---

## 🧹 LIMPEZA

### Limpar Docker
```bash
# Parar tudo
cd backend
docker-compose down -v

# Remover imagens não usadas
docker image prune -a

# Remover volumes não usados
docker volume prune
```

### Limpar Cache do npm
```bash
npm cache clean --force
```

### Limpar Tudo (Frontend)
```bash
rm -rf node_modules package-lock.json
rm -rf .vite
npm install
```

### Limpar Tudo (Backend)
```bash
cd backend
rm -rf node_modules package-lock.json
docker-compose down -v
npm install
docker-compose up -d
```

---

## 🔄 SINCRONIZAÇÃO

### Sincronizar Dados Manualmente (via API)
```bash
# Obter token (substitua EMAIL e SENHA)
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"EMAIL","password":"SENHA"}' \
  | jq -r '.token')

# Sincronizar Meta Ads
curl -X POST http://localhost:4000/api/platforms/meta/sync \
  -H "Authorization: Bearer $TOKEN"

# Sincronizar Google Ads
curl -X POST http://localhost:4000/api/platforms/google/sync \
  -H "Authorization: Bearer $TOKEN"

# Sincronizar TikTok Ads
curl -X POST http://localhost:4000/api/platforms/tiktok/sync \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🧪 TESTES

### Testar Endpoint de Health
```bash
curl http://localhost:4000/api/health
```

### Testar Registro de Usuário
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"teste@email.com",
    "password":"senha123",
    "name":"Usuario Teste"
  }'
```

### Testar Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"teste@email.com",
    "password":"senha123"
  }'
```

### Testar Endpoint Protegido
```bash
# Primeiro faça login e pegue o token
TOKEN="SEU_TOKEN_AQUI"

# Depois teste
curl http://localhost:4000/api/platforms \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 MONITORAMENTO

### Ver Uso de Memória dos Containers
```bash
cd backend
docker stats
```

### Ver Espaço em Disco Usado pelo Docker
```bash
docker system df
```

### Ver Logs em Tempo Real (Frontend)
```bash
npm run dev
# Logs aparecem no terminal
```

### Ver Logs em Tempo Real (Backend)
```bash
cd backend
docker-compose logs -f app
```

---

## 🔧 CONFIGURAÇÃO

### Mudar Porta do Frontend
Edite `vite.config.ts`:
```typescript
server: {
  port: 3000, // Altere aqui
}
```

### Mudar Porta do Backend
Edite `backend/.env`:
```env
PORT=5000  # Altere aqui
```

E `backend/src/index.ts`:
```typescript
const PORT = process.env.PORT || 5000;
```

### Mudar Porta do PostgreSQL
Edite `backend/docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Altere o primeiro número
```

---

## 🚀 PRODUÇÃO

### Build do Frontend
```bash
npm run build
```

### Preview do Build
```bash
npm run preview
```

### Build do Backend
```bash
cd backend
npm run build
```

### Rodar Backend em Produção
```bash
cd backend
npm start
```

---

## 📝 SCRIPTS PACKAGE.JSON

### Frontend
```bash
npm run dev       # Desenvolvimento
npm run build     # Build produção
npm run preview   # Preview do build
```

### Backend
```bash
npm run dev       # Desenvolvimento (nodemon)
npm run build     # Build produção
npm start         # Rodar produção
```

---

## 🔐 SEGURANÇA

### Gerar Nova JWT Secret
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64
```

### Ver Hashes de Senhas no Banco
```bash
cd backend
docker-compose exec db psql -U postgres -d ads_dashboard \
  -c "SELECT email, password FROM \"User\";"
```

---

## 📦 DEPENDÊNCIAS

### Ver Dependências Desatualizadas (Frontend)
```bash
npm outdated
```

### Ver Dependências Desatualizadas (Backend)
```bash
cd backend
npm outdated
```

### Atualizar Dependência Específica
```bash
npm update [package-name]
```

---

## 🆘 EMERGÊNCIA

### Sistema Não Inicia
```bash
# 1. Parar tudo
./stop-all.sh  # ou stop-all.bat

# 2. Limpar Docker
cd backend
docker-compose down -v

# 3. Limpar npm
cd ..
rm -rf node_modules
npm install

# 4. Reiniciar tudo
./start-all.sh  # ou start-all.bat
```

### Banco de Dados Corrompido
```bash
cd backend
docker-compose down -v
docker-compose up -d
# Aguarde 15 segundos
docker-compose exec app npx prisma migrate deploy
```

### Porta em Uso
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID [NUMERO] /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

---

## 💡 DICAS

1. **Sempre use os scripts** `start-all` e `stop-all`
2. **Veja os logs** quando algo der errado
3. **Aguarde 15 segundos** após iniciar o backend
4. **Mantenha Docker Desktop aberto** enquanto usa
5. **Use `docker-compose logs -f`** para debug em tempo real
6. **Faça backup** antes de rodar `down -v`

---

## 📞 COMANDOS DE HELP

```bash
# Docker Compose
docker-compose --help

# npm
npm --help

# Docker
docker --help

# Node
node --help
```

---

**Estes comandos cobrem 99% do uso diário do sistema!** 🛠️
