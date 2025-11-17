# 🚀 Ads SaaS Backend - API

Backend completo para o Dashboard de Tráfego Pago SaaS, com integração das APIs do Meta Ads, Google Ads e TikTok Ads.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Endpoints da API](#endpoints-da-api)
- [Deploy](#deploy)

---

## 🎯 Visão Geral

Este backend fornece:

- ✅ Autenticação JWT completa
- ✅ OAuth 2.0 para Meta, Google e TikTok Ads
- ✅ ETL automático com scheduler (cron)
- ✅ Armazenamento de insights em PostgreSQL
- ✅ API RESTful para consumo do frontend
- ✅ Logs detalhados de requisições
- ✅ Docker para deploy fácil

---

## 🛠 Tecnologias

- **Node.js 20+** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Express** - Framework web
- **Prisma** - ORM moderno
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação
- **Axios** - Cliente HTTP
- **Winston** - Logs profissionais
- **Node-cron** - Agendamento de tarefas
- **Docker** - Containerização

---

## 📦 Instalação

### Opção 1: Docker (Recomendado)

```bash
# 1. Clone o repositório (ou copie a pasta backend)
cd backend

# 2. Copie o arquivo .env.example para .env
cp .env.example .env

# 3. Configure as variáveis de ambiente no .env
# Edite o arquivo .env com suas credenciais

# 4. Inicie os containers
docker-compose up -d

# 5. Execute as migrations do Prisma
docker-compose exec app npx prisma migrate deploy

# 6. (Opcional) Visualize os logs
docker-compose logs -f app
```

### Opção 2: Local

```bash
# 1. Instale as dependências
npm install

# 2. Configure o PostgreSQL local
# Crie um banco de dados chamado 'ads_saas'

# 3. Copie e configure o .env
cp .env.example .env

# 4. Execute as migrations
npx prisma migrate dev

# 5. Gere o Prisma Client
npx prisma generate

# 6. Inicie em modo desenvolvimento
npm run dev

# 7. Ou faça build e rode em produção
npm run build
npm start
```

---

## ⚙️ Configuração

### 1️⃣ Variáveis de Ambiente

Edite o arquivo `.env`:

```env
# Banco de Dados
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ads_saas

# JWT
JWT_SECRET=seu_secret_super_seguro_aqui

# CORS (URL do frontend)
CORS_ORIGIN=http://localhost:5173

# Scheduler
ENABLE_SCHEDULER=true
SCHEDULER_INTERVAL_MINUTES=60
```

### 2️⃣ Credenciais das Plataformas

#### Meta Ads (Facebook/Instagram)

1. Acesse [Meta for Developers](https://developers.facebook.com/)
2. Crie um app
3. Configure OAuth redirect para: `http://localhost:4000/api/auth/meta/callback`
4. Adicione ao `.env`:

```env
META_APP_ID=seu_app_id
META_APP_SECRET=seu_app_secret
META_REDIRECT_URI=http://localhost:4000/api/auth/meta/callback
```

#### Google Ads

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto e habilite a Google Ads API
3. Crie credenciais OAuth 2.0
4. Configure redirect para: `http://localhost:4000/api/auth/google/callback`
5. Obtenha um Developer Token em [Google Ads](https://ads.google.com/)
6. Adicione ao `.env`:

```env
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
GOOGLE_REDIRECT_URI=http://localhost:4000/api/auth/google/callback
GOOGLE_DEVELOPER_TOKEN=seu_developer_token
```

#### TikTok Ads

1. Acesse [TikTok for Business](https://ads.tiktok.com/marketing_api/)
2. Registre seu app
3. Configure redirect para: `http://localhost:4000/api/auth/tiktok/callback`
4. Adicione ao `.env`:

```env
TIKTOK_CLIENT_KEY=seu_client_key
TIKTOK_CLIENT_SECRET=seu_client_secret
TIKTOK_REDIRECT_URI=http://localhost:4000/api/auth/tiktok/callback
```

---

## 🎮 Uso

### Health Check

```bash
curl http://localhost:4000/health
```

### Registro de Usuário

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha123",
    "name": "João Silva"
  }'
```

### Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }'
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx...",
    "email": "usuario@exemplo.com",
    "name": "João Silva"
  }
}
```

### Conectar Plataforma

No navegador, acesse:

- Meta: `http://localhost:4000/api/auth/meta/start?userId=SEU_USER_ID`
- Google: `http://localhost:4000/api/auth/google/start?userId=SEU_USER_ID`
- TikTok: `http://localhost:4000/api/auth/tiktok/start?userId=SEU_USER_ID`

### Listar Contas Conectadas

```bash
curl http://localhost:4000/api/accounts \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Sincronizar Conta Manualmente

```bash
curl -X POST http://localhost:4000/api/accounts/ACCOUNT_ID/sync \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Buscar Insights

```bash
# Resumo geral
curl "http://localhost:4000/api/insights/summary?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer SEU_TOKEN"

# Insights de campanhas
curl "http://localhost:4000/api/insights/campaigns?provider=meta&startDate=2024-01-01" \
  -H "Authorization: Bearer SEU_TOKEN"

# Insights de anúncios
curl "http://localhost:4000/api/insights/ads?campaignId=123456" \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 🌐 Endpoints da API

### Autenticação

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/api/auth/register` | Registro de usuário | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/me` | Dados do usuário atual | ✅ |
| GET | `/api/auth/:provider/start` | Iniciar OAuth | ❌ |
| GET | `/api/auth/:provider/callback` | Callback OAuth | ❌ |

### Contas

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/accounts` | Listar contas conectadas | ✅ |
| GET | `/api/accounts/:id` | Detalhes de uma conta | ✅ |
| DELETE | `/api/accounts/:id` | Remover conta | ✅ |
| POST | `/api/accounts/:id/sync` | Sincronizar conta | ✅ |

### Insights

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/insights/summary` | Resumo geral | ✅ |
| GET | `/api/insights/campaigns` | Insights de campanhas | ✅ |
| GET | `/api/insights/ads` | Insights de anúncios | ✅ |

### Logs (Admin)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/logs/api-requests` | Logs de requisições | ✅ |

---

## 📊 Banco de Dados

### Visualizar com Prisma Studio

```bash
npx prisma studio
```

Acesse: `http://localhost:5555`

### Migrations

```bash
# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Resetar banco de dados (CUIDADO!)
npx prisma migrate reset
```

---

## 🚀 Deploy

### Deploy com Docker

```bash
# Build da imagem
docker build -t ads-saas-backend .

# Run container
docker run -p 4000:4000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  ads-saas-backend
```

### Deploy em Cloud (Railway, Render, Heroku)

1. Conecte seu repositório Git
2. Configure as variáveis de ambiente
3. Adicione PostgreSQL como addon
4. Deploy automático! 🎉

### Variáveis de Ambiente para Produção

```env
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=secret_super_seguro_production
CORS_ORIGIN=https://seu-frontend.com
ENABLE_SCHEDULER=true
```

---

## 📝 Scheduler (ETL)

O scheduler roda automaticamente a cada hora (configurável) e:

1. Busca todas as contas conectadas
2. Para cada conta, chama a API da plataforma
3. Processa e salva os insights no banco
4. Registra logs de sucesso/erro

### Configurar Intervalo

No `.env`:

```env
SCHEDULER_INTERVAL_MINUTES=60  # A cada 1 hora
# ou
SCHEDULER_INTERVAL_MINUTES=30  # A cada 30 minutos
```

---

## 🐛 Troubleshooting

### Erro de conexão com o banco

```bash
# Verifique se o PostgreSQL está rodando
docker-compose ps

# Veja os logs do banco
docker-compose logs db
```

### Token expirado

```bash
# Faça login novamente para obter novo token
curl -X POST http://localhost:4000/api/auth/login ...
```

### OAuth não funciona

1. Verifique as URLs de redirect nas configurações das plataformas
2. Certifique-se que as credenciais estão corretas no `.env`
3. Verifique os logs: `docker-compose logs -f app`

---

## 📚 Documentação das APIs

- [Meta Marketing API](https://developers.facebook.com/docs/marketing-apis)
- [Google Ads API](https://developers.google.com/google-ads/api/docs)
- [TikTok Marketing API](https://ads.tiktok.com/marketing_api/docs)

---

## 🤝 Integração com Frontend

No seu frontend React, configure a URL da API:

```typescript
// .env no frontend
VITE_API_URL=http://localhost:4000/api
```

```typescript
// Exemplo de uso
const response = await fetch(`${import.meta.env.VITE_API_URL}/insights/summary`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

## 📄 Licença

Este projeto é privado e proprietário.

---

## 💡 Próximos Passos

- [ ] Implementar refresh automático de tokens
- [ ] Adicionar cache com Redis
- [ ] Criar webhooks para notificações
- [ ] Adicionar testes automatizados
- [ ] Implementar rate limiting
- [ ] Adicionar métricas com Prometheus

---

**Desenvolvido com ❤️ para otimizar seu tráfego pago**
