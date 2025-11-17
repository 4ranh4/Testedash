# 📡 Exemplos de Requisições da API

Exemplos práticos de como usar a API do backend.

## 🔐 Autenticação

### 1. Registrar Usuário

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@empresa.com",
    "password": "SenhaSegura123!",
    "name": "João Silva"
  }'
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbHgxMjM0NSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAyNTkyMDAwfQ.abc123...",
  "user": {
    "id": "clx12345",
    "email": "joao@empresa.com",
    "name": "João Silva"
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@empresa.com",
    "password": "SenhaSegura123!"
  }'
```

### 3. Buscar Dados do Usuário Atual

```bash
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🔗 OAuth - Conectar Plataformas

### Meta Ads (Facebook/Instagram)

**No navegador, acesse:**
```
http://localhost:4000/api/auth/meta/start?userId=clx12345
```

Você será redirecionado para o Facebook para autorizar o app.

### Google Ads

**No navegador, acesse:**
```
http://localhost:4000/api/auth/google/start?userId=clx12345
```

### TikTok Ads

**No navegador, acesse:**
```
http://localhost:4000/api/auth/tiktok/start?userId=clx12345
```

---

## 📊 Contas Conectadas

### Listar Todas as Contas

```bash
curl http://localhost:4000/api/accounts \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Resposta:**
```json
{
  "accounts": [
    {
      "id": "acc_123",
      "provider": "meta",
      "advertiserId": "act_123456789",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-20T15:30:00.000Z",
      "expiresAt": "2024-03-15T10:00:00.000Z"
    },
    {
      "id": "acc_456",
      "provider": "google",
      "advertiserId": "usuario@email.com",
      "createdAt": "2024-01-16T11:00:00.000Z",
      "updatedAt": "2024-01-20T16:00:00.000Z",
      "expiresAt": "2024-02-16T11:00:00.000Z"
    }
  ]
}
```

### Buscar Conta Específica

```bash
curl http://localhost:4000/api/accounts/acc_123 \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Deletar Conta

```bash
curl -X DELETE http://localhost:4000/api/accounts/acc_123 \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Sincronizar Conta Manualmente

```bash
curl -X POST http://localhost:4000/api/accounts/acc_123/sync \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Resposta:**
```json
{
  "message": "Sync completed successfully",
  "recordsProcessed": 45
}
```

---

## 📈 Insights - Campanhas

### Resumo Geral de Insights

```bash
curl "http://localhost:4000/api/insights/summary?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Resposta:**
```json
{
  "summary": {
    "totalImpressions": 1250000,
    "totalClicks": 35000,
    "totalSpend": 15000.50,
    "totalConversions": 850,
    "totalRevenue": 42500.00,
    "avgCTR": 2.8,
    "avgCPC": 0.43,
    "avgCPM": 12.00,
    "avgCPA": 17.65,
    "avgROAS": 2.83
  },
  "connectedAccounts": [
    { "id": "acc_123", "provider": "meta" },
    { "id": "acc_456", "provider": "google" }
  ]
}
```

### Insights de Campanhas (Filtrado)

```bash
# Filtrar por plataforma
curl "http://localhost:4000/api/insights/campaigns?provider=meta&startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer SEU_TOKEN"

# Filtrar por conta específica
curl "http://localhost:4000/api/insights/campaigns?accountId=acc_123&startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Resposta:**
```json
{
  "insights": [
    {
      "id": "ins_001",
      "accountId": "acc_123",
      "provider": "meta",
      "campaignId": "23850123456",
      "campaignName": "Campanha Verão 2024",
      "date": "2024-01-20T00:00:00.000Z",
      "impressions": 45000,
      "clicks": 1250,
      "spend": 580.50,
      "conversions": 35,
      "revenue": 1750.00,
      "ctr": 2.78,
      "cpc": 0.46,
      "cpm": 12.90,
      "cpa": 16.59,
      "roas": 3.02,
      "rawData": { ... },
      "createdAt": "2024-01-21T08:00:00.000Z",
      "updatedAt": "2024-01-21T08:00:00.000Z"
    }
  ]
}
```

### Insights de Anúncios

```bash
# Todos os anúncios
curl "http://localhost:4000/api/insights/ads?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer SEU_TOKEN"

# Anúncios de uma campanha específica
curl "http://localhost:4000/api/insights/ads?campaignId=23850123456" \
  -H "Authorization: Bearer SEU_TOKEN"

# Filtrar por plataforma e data
curl "http://localhost:4000/api/insights/ads?provider=google&startDate=2024-01-15&endDate=2024-01-20" \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 📝 Logs de API

### Buscar Logs de Requisições

```bash
# Todos os logs (últimos 100)
curl "http://localhost:4000/api/logs/api-requests" \
  -H "Authorization: Bearer SEU_TOKEN"

# Filtrar por plataforma
curl "http://localhost:4000/api/logs/api-requests?provider=meta" \
  -H "Authorization: Bearer SEU_TOKEN"

# Limitar quantidade
curl "http://localhost:4000/api/logs/api-requests?limit=50" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Resposta:**
```json
{
  "logs": [
    {
      "id": "log_001",
      "provider": "meta",
      "accountId": "acc_123",
      "endpoint": "/insights",
      "method": "GET",
      "statusCode": 200,
      "duration": 1250,
      "response": {
        "campaignsCount": 15,
        "adsCount": 78
      },
      "createdAt": "2024-01-20T15:30:00.000Z"
    }
  ]
}
```

---

## 🔧 Exemplos com JavaScript/TypeScript

### Setup do Cliente

```typescript
// api.ts
const API_URL = 'http://localhost:4000/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }
}

export const api = new ApiClient();
```

### Login

```typescript
// auth.ts
import { api } from './api';

async function login(email: string, password: string) {
  const response = await api.request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  api.setToken(response.token);
  return response.user;
}

async function register(email: string, password: string, name: string) {
  const response = await api.request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });

  api.setToken(response.token);
  return response.user;
}

async function getCurrentUser() {
  return api.request('/auth/me');
}
```

### Buscar Insights

```typescript
// insights.ts
import { api } from './api';

async function getSummary(startDate: string, endDate: string) {
  return api.request(`/insights/summary?startDate=${startDate}&endDate=${endDate}`);
}

async function getCampaignInsights(filters: {
  provider?: string;
  accountId?: string;
  startDate: string;
  endDate: string;
}) {
  const params = new URLSearchParams(filters as any);
  return api.request(`/insights/campaigns?${params}`);
}

async function getAdInsights(campaignId: string) {
  return api.request(`/insights/ads?campaignId=${campaignId}`);
}
```

### Conectar Plataforma

```typescript
// oauth.ts
function connectPlatform(provider: 'meta' | 'google' | 'tiktok', userId: string) {
  const url = `http://localhost:4000/api/auth/${provider}/start?userId=${userId}`;
  
  // Abrir popup ou redirecionar
  const popup = window.open(url, 'OAuth', 'width=600,height=700');
  
  // Escutar mensagem de sucesso
  window.addEventListener('message', (event) => {
    if (event.data.type === 'oauth-success') {
      console.log('Plataforma conectada com sucesso!');
      popup?.close();
    }
  });
}
```

---

## 🎯 React Hook Completo

```typescript
// useApi.ts
import { useState, useEffect } from 'react';
import { api } from './api';

export function useInsightsSummary(startDate: string, endDate: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await api.request(
          `/insights/summary?startDate=${startDate}&endDate=${endDate}`
        );
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [startDate, endDate]);

  return { data, loading, error };
}

// Uso no componente
function Dashboard() {
  const { data, loading, error } = useInsightsSummary('2024-01-01', '2024-01-31');

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      <h1>Total de Gastos: R$ {data.summary.totalSpend.toFixed(2)}</h1>
      <h2>ROAS: {data.summary.avgROAS.toFixed(2)}</h2>
    </div>
  );
}
```

---

## 🚨 Tratamento de Erros

### Erros Comuns

```json
// 401 - Não autenticado
{
  "error": "Authorization header missing"
}

// 403 - Sem permissão
{
  "error": "Access denied"
}

// 404 - Não encontrado
{
  "error": "Account not found"
}

// 500 - Erro interno
{
  "error": "Internal server error",
  "message": "Database connection failed" // apenas em dev
}
```

### Tratamento no Frontend

```typescript
async function safeFetch<T>(endpoint: string): Promise<T> {
  try {
    const data = await api.request(endpoint);
    return data;
  } catch (error: any) {
    if (error.status === 401) {
      // Token expirado - redirecionar para login
      window.location.href = '/login';
    } else if (error.status === 403) {
      // Sem permissão
      alert('Você não tem permissão para acessar este recurso');
    } else {
      // Outro erro
      console.error('API Error:', error);
      alert('Erro ao buscar dados. Tente novamente.');
    }
    throw error;
  }
}
```

---

## 📚 Recursos Adicionais

- **Postman Collection**: Importe as requisições acima no Postman
- **Swagger/OpenAPI**: (TODO) Documentação interativa
- **GraphQL**: (Futuro) Alternativa RESTful

---

**Desenvolvido para facilitar a integração com o frontend! 🚀**
