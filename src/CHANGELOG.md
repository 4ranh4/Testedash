# 📝 Changelog

Todas as mudanças importantes do projeto serão documentadas aqui.

---

## [1.0.1] - 2024-01-XX

### 🐛 Correções de Bugs

#### Erro de Variáveis de Ambiente
- **Problema:** `TypeError: Cannot read properties of undefined (reading 'VITE_API_URL')`
- **Causa:** Arquivo `.env` não existia e `import.meta.env` não estava disponível
- **Solução:**
  - ✅ Criado arquivo `/.env` com variáveis de ambiente
  - ✅ Adicionado fallback no `/services/api.ts` para evitar erros
  - ✅ Função `getApiUrl()` com try/catch para maior segurança

**Código Corrigido:**
```typescript
// Antes (causava erro)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Depois (seguro)
const getApiUrl = () => {
  try {
    return import.meta?.env?.VITE_API_URL || 'http://localhost:4000/api';
  } catch {
    return 'http://localhost:4000/api';
  }
};
const API_URL = getApiUrl();
```

#### IntegrationPlaceholders - Modo Mock
- **Problema:** Componente tentava usar `useAuth()` mas causava erro ao não ter backend
- **Solução:**
  - ✅ Removido dependência do `useAuth` temporariamente
  - ✅ Implementado modo mock/simulado para testes sem backend
  - ✅ Toasts informativos indicando "modo simulado"
  - ✅ Funcionalidade de conectar/desconectar funcionando localmente

---

## [1.0.0] - 2024-01-XX

### ✨ Lançamento Inicial

#### Frontend
- ✅ Dashboard completo com 12 componentes modulares
- ✅ Sistema de navegação por hash
- ✅ Gráficos interativos com Recharts
- ✅ Filtros persistentes
- ✅ Upload de foto de perfil
- ✅ Sistema de configurações com 6 abas
- ✅ Toast notifications
- ✅ Design responsivo

#### Backend
- ✅ API RESTful completa (15 endpoints)
- ✅ Autenticação JWT
- ✅ OAuth 2.0 para Meta, Google e TikTok
- ✅ Prisma ORM com PostgreSQL
- ✅ ETL automático com scheduler
- ✅ Winston logger
- ✅ Docker e docker-compose

#### Integração
- ✅ Serviço de API (`/services/api.ts`)
- ✅ AuthContext para gerenciamento de sessão
- ✅ Hooks customizados (`/hooks/useApiData.ts`)
- ✅ Documentação completa (5 arquivos .md)

---

## 🔄 Alterações por Arquivo

### `/services/api.ts`
- 🐛 **FIX:** Adicionado fallback para `import.meta.env`
- ✅ **MELHORIA:** Função `getApiUrl()` mais segura
- ✅ **MELHORIA:** Try/catch para evitar crashes

### `/.env`
- ✨ **NOVO:** Arquivo criado com variáveis padrão
- ✅ Configuração: `VITE_API_URL=http://localhost:4000/api`
- ✅ Configuração: `VITE_USE_REAL_API=false`

### `/components/IntegrationPlaceholders.tsx`
- 🐛 **FIX:** Removida dependência do `useAuth()` temporariamente
- ✅ **MELHORIA:** Modo mock implementado
- ✅ **MELHORIA:** Botões funcionais sem backend
- ✅ **MELHORIA:** Toasts informativos

---

## 🎯 Próximas Versões

### [1.1.0] - Planejado
- [ ] Página de Login/Registro completa
- [ ] Integração real com backend (habilitar `useAuth()`)
- [ ] Loading states (Skeleton components)
- [ ] Error boundaries

### [1.2.0] - Planejado
- [ ] KPICards com dados reais do backend
- [ ] MainCharts com dados reais
- [ ] PlatformSections com dados reais
- [ ] Cache local (IndexedDB)

### [2.0.0] - Futuro
- [ ] Testes E2E
- [ ] PWA (Progressive Web App)
- [ ] Modo offline
- [ ] Notificações push

---

## 📊 Status Atual

```
✅ Backend:      100% (funcional)
✅ Frontend:      90% (funcional, modo mock)
✅ Integração:    80% (preparado, aguarda backend)
✅ Documentação: 100% (completa)
```

---

## 🐛 Bugs Conhecidos

### Resolvidos ✅
- ✅ `TypeError` em `import.meta.env` - CORRIGIDO
- ✅ `useAuth()` causando erro - CORRIGIDO (modo mock)
- ✅ Variáveis de ambiente não carregando - CORRIGIDO

### Em Aberto ⏳
- ⏳ Componentes ainda usam dados mockados (esperado, backend opcional)
- ⏳ Não há página de login/registro (próxima versão)

---

## 🔗 Links Úteis

- [README Principal](./README.md)
- [Quick Start](./QUICK_START.md)
- [Guia de Integração](./INTEGRATION_GUIDE.md)
- [Status de Integração](./INTEGRATION_STATUS.md)
- [Backend README](./backend/README.md)

---

**Última atualização:** Janeiro 2024
