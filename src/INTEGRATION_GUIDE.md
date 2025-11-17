# 🔌 Guia de Integração Frontend ↔ Backend

Este documento explica como integrar completamente o frontend React com o backend Node.js.

---

## 📋 Visão Geral da Integração

O sistema está dividido em duas partes:

1. **Frontend** (`/` - raiz do projeto)
   - React + TypeScript + Tailwind
   - Interface do dashboard
   - Gerenciamento de estado local

2. **Backend** (`/backend/`)
   - Node.js + Express + Prisma
   - API RESTful
   - Autenticação JWT
   - OAuth com plataformas

---

## 🚀 Configuração Inicial

### 1️⃣ Backend

```bash
cd backend

# Copiar variáveis de ambiente
cp .env.example .env

# Editar .env com suas credenciais
nano .env

# Instalar dependências
npm install

# Configurar banco de dados
npx prisma generate
npx prisma migrate dev

# Iniciar servidor
npm run dev
```

O backend estará rodando em: `http://localhost:4000`

### 2️⃣ Frontend

```bash
# Na raiz do projeto

# Copiar variáveis de ambiente
cp .env.example .env

# Editar .env
nano .env

# Configurar URL da API
# VITE_API_URL=http://localhost:4000/api
```

---

## 🔐 Fluxo de Autenticação

### 1. Registro/Login

O frontend usa o contexto `AuthContext` para gerenciar autenticação:

```typescript
import { useAuth } from './contexts/AuthContext';

function LoginComponent() {
  const { login, register } = useAuth();

  const handleLogin = async () => {
    await login('email@exemplo.com', 'senha123');
    // Usuário logado! Token salvo automaticamente
  };
}
```

### 2. Requisições Autenticadas

O serviço de API adiciona automaticamente o token JWT:

```typescript
import { api } from './services/api';

// O token é adicionado automaticamente
const accounts = await api.listAccounts();
```

---

## 🔗 Conectando Plataformas (OAuth)

### Fluxo OAuth Completo:

1. **Frontend**: Usuário clica em "Conectar Meta/Google/TikTok"
2. **Frontend**: Abre popup com URL do backend
3. **Backend**: Redireciona para plataforma (Facebook/Google/TikTok)
4. **Plataforma**: Usuário autoriza
5. **Backend**: Recebe callback, salva tokens
6. **Backend**: Redireciona de volta para frontend
7. **Frontend**: Detecta sucesso e atualiza lista de contas

```typescript
// No componente IntegrationPlaceholders.tsx
const handleConnect = (provider: 'meta' | 'google' | 'tiktok') => {
  const oauthUrl = api.getOAuthUrl(provider, user.id);
  window.open(oauthUrl, 'OAuth', 'width=600,height=700');
};
```

---

## 📊 Buscando Dados das APIs

### Hook Personalizado

```typescript
import { useInsightsSummary } from './hooks/useApiData';

function Dashboard() {
  const { data, loading, error } = useInsightsSummary({
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    provider: 'meta' // opcional
  });

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      <h1>Total Gasto: R$ {data.summary.totalSpend}</h1>
      <h2>ROAS: {data.summary.avgROAS}</h2>
    </div>
  );
}
```

### Endpoints Disponíveis

| Funcionalidade | Endpoint | Hook |
|---------------|----------|------|
| Resumo de Insights | `/api/insights/summary` | `useInsightsSummary()` |
| Insights de Campanhas | `/api/insights/campaigns` | `useCampaignInsights()` |
| Lista de Contas | `/api/accounts` | `useAccounts()` |
| Sincronizar Conta | `/api/accounts/:id/sync` | `syncAccount(id)` |

---

## 🎯 Componentes Integrados

### ✅ Já Integrados com Backend:

1. **IntegrationPlaceholders** (`/components/IntegrationPlaceholders.tsx`)
   - ✅ Conectar/desconectar plataformas via OAuth
   - ✅ Sincronizar dados manualmente
   - ✅ Listar contas conectadas

2. **SettingsPage** (`/components/SettingsPage.tsx`)
   - ✅ Upload de foto de perfil
   - ✅ Salvar configurações (com toast)
   - ✅ Atualizar dados de usuário

3. **AuthContext** (`/contexts/AuthContext.tsx`)
   - ✅ Login/Registro
   - ✅ Gerenciamento de sessão
   - ✅ Auto-refresh de token

### 🔄 Precisam Integração:

4. **KPICards** (`/components/KPICards.tsx`)
   - 🔄 Buscar métricas reais do backend
   - 🔄 Atualizar em tempo real

5. **MainCharts** (`/components/MainCharts.tsx`)
   - 🔄 Dados de gráficos do backend
   - 🔄 Filtros por período

6. **PlatformSections** (`/components/PlatformSections.tsx`)
   - 🔄 Dados específicos por plataforma

7. **ReportsPage** (`/components/ReportsPage.tsx`)
   - 🔄 Gerar relatórios com dados reais

---

## 🛠️ Como Integrar um Componente

### Exemplo: KPICards

**Antes (dados mockados):**

```typescript
export function KPICards({ apiConnections }: KPICardsProps) {
  const kpis = [
    { label: "Gasto Total", value: "R$ 0,00" }
  ];
  
  return <div>{/* ... */}</div>;
}
```

**Depois (dados reais):**

```typescript
import { useInsightsSummary } from '../hooks/useApiData';

export function KPICards({ apiConnections }: KPICardsProps) {
  const { data, loading } = useInsightsSummary({
    startDate: getStartDate(), // função helper
    endDate: getTodayDate()
  });

  if (loading) return <Skeleton />;

  const kpis = [
    { 
      label: "Gasto Total", 
      value: formatCurrency(data?.summary.totalSpend || 0)
    },
    {
      label: "Conversões",
      value: data?.summary.totalConversions || 0
    },
    {
      label: "ROAS",
      value: data?.summary.avgROAS?.toFixed(2) || "0.00"
    }
  ];
  
  return <div>{/* renderizar KPIs */}</div>;
}
```

---

## 🔄 Sincronização de Dados

### ETL Automático (Backend)

O backend sincroniza automaticamente a cada hora:

```typescript
// backend/src/jobs/scheduler.ts
// Configurável via SCHEDULER_INTERVAL_MINUTES no .env
```

### Sincronização Manual (Frontend)

```typescript
import { api } from './services/api';

const handleSync = async (accountId: string) => {
  await api.syncAccount(accountId);
  toast.success('Dados sincronizados!');
};
```

---

## 🎨 Estados de Carregamento

### Skeleton Loading

```typescript
import { Skeleton } from './components/ui/skeleton';

function MyComponent() {
  const { data, loading } = useInsightsSummary();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return <div>{/* dados reais */}</div>;
}
```

---

## 🚨 Tratamento de Erros

### Erro 401 - Não Autenticado

```typescript
// Automático no api.ts
if (response.status === 401) {
  api.clearToken();
  window.location.href = '/#login';
}
```

### Erros Genéricos

```typescript
const { data, error } = useInsightsSummary();

if (error) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Erro ao carregar dados</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}
```

---

## 📝 Checklist de Integração

### Backend

- [x] Servidor rodando em `localhost:4000`
- [x] Banco de dados configurado
- [x] Variáveis de ambiente configuradas
- [x] OAuth credenciais das plataformas
- [x] CORS configurado para frontend

### Frontend

- [x] `.env` configurado com `VITE_API_URL`
- [x] `AuthProvider` envolvendo `App`
- [x] Serviço de API criado (`/services/api.ts`)
- [x] Hooks personalizados (`/hooks/useApiData.ts`)
- [ ] Componentes atualizados para usar API real
- [ ] Página de login/registro criada
- [ ] Testes de integração

---

## 🧪 Testando a Integração

### 1. Teste de Conexão

```bash
# Verificar se backend está rodando
curl http://localhost:4000/health

# Deve retornar:
# {"status":"ok","timestamp":"...","uptime":123}
```

### 2. Teste de Autenticação

```typescript
// No console do browser
import { api } from './services/api';

// Registrar usuário
const response = await api.register(
  'test@test.com', 
  'senha123', 
  'Teste'
);
console.log(response);
```

### 3. Teste de OAuth

1. Ir para `/#integrations`
2. Clicar em "Conectar Meta Ads"
3. Deve abrir popup de autenticação
4. Verificar se aparece na lista de contas

---

## 🔐 Segurança

### Variáveis Sensíveis

❌ **NÃO FAZER:**

```typescript
// Nunca expor credenciais no frontend
const API_KEY = "abc123...";
```

✅ **FAZER:**

```typescript
// Backend gerencia todas as credenciais
// Frontend só usa tokens JWT
const token = api.getToken();
```

### CORS

Configurar no backend:

```env
# backend/.env
CORS_ORIGIN=http://localhost:5173
```

---

## 📚 Recursos Adicionais

### Documentação

- [API Examples](/backend/API_EXAMPLES.md) - Exemplos de requisições
- [Backend README](/backend/README.md) - Documentação do backend
- [Roadmap](/backend/ROADMAP.md) - Funcionalidades futuras

### Ferramentas

- **Prisma Studio**: Visualizar banco de dados
  ```bash
  cd backend && npx prisma studio
  ```

- **API Testing**: Postman/Insomnia
  - Importar exemplos do `API_EXAMPLES.md`

---

## 🐛 Troubleshooting

### Frontend não conecta ao backend

1. Verificar se backend está rodando: `curl http://localhost:4000/health`
2. Verificar `VITE_API_URL` no `.env`
3. Verificar CORS no backend
4. Abrir DevTools > Network para ver erros

### OAuth não funciona

1. Verificar URLs de redirect nas plataformas
2. Verificar credenciais no `backend/.env`
3. Verificar se popup não foi bloqueado
4. Ver logs do backend: `docker-compose logs -f app`

### Dados não aparecem

1. Verificar se há contas conectadas
2. Rodar sincronização manual
3. Verificar se token JWT é válido
4. Ver erros no console do browser

---

## 🎯 Próximos Passos

1. **Criar página de Login/Registro**
2. **Integrar KPICards com dados reais**
3. **Integrar MainCharts com dados reais**
4. **Adicionar loading states em todos componentes**
5. **Implementar cache local (optional)**
6. **Adicionar testes E2E**

---

**Desenvolvido para facilitar a integração completa! 🚀**

Dúvidas? Consulte a documentação do backend ou abra uma issue.
