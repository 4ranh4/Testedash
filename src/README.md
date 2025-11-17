# 📊 Ads Dashboard - SaaS de Tráfego Pago

Dashboard profissional para análise e gerenciamento de campanhas de **Meta Ads**, **Google Ads** e **TikTok Ads**.

![Status](https://img.shields.io/badge/status-beta-blue)
![Backend](https://img.shields.io/badge/backend-node.js-green)
![Frontend](https://img.shields.io/badge/frontend-react-blue)
![Database](https://img.shields.io/badge/database-postgresql-blue)

---

## ✨ Funcionalidades

### ✅ Implementado

- 🔐 **Autenticação JWT** completa (login/registro)
- 🔌 **OAuth 2.0** para Meta Ads, Google Ads e TikTok Ads
- 📊 **Dashboard** com KPIs essenciais
- 📈 **Gráficos** de performance (Recharts)
- 🔄 **Sincronização** automática de dados via APIs
- 💾 **Banco PostgreSQL** com Prisma ORM
- 🎨 **Interface moderna** com React + TypeScript + Tailwind
- 📱 **Responsivo** para desktop e mobile
- 🔍 **Filtros** por período, plataforma e campanha
- 📉 **Comparação** entre períodos
- 🎯 **Insights automáticos** com IA
- ⚡ **ETL** automatizado para processamento de dados

### 🚧 Em Desenvolvimento

- 🤖 Google Ads API integration
- 🎵 TikTok Ads API integration
- 📊 Relatórios avançados
- 📧 Alertas por email
- 🌍 Múltiplos idiomas

---

## 🚀 Início Rápido

### 1. Iniciar Backend

```bash
cd backend
docker-compose up -d
```

### 2. Acessar Frontend

```
http://localhost:5173
```

### 3. Criar Conta

- Clique em "Criar Conta"
- Preencha email, senha e nome
- ✅ Pronto!

**📖 Guia completo:** [INICIO_RAPIDO.md](./INICIO_RAPIDO.md)

---

## 📋 Pré-requisitos

- **Docker** (para backend)
- **Node.js** 18+ (para frontend)
- **Credenciais** do Facebook Ads (opcional)

---

## 🏗️ Arquitetura

```
┌─────────────┐
│   Frontend  │  React + TypeScript + Tailwind
│ (Port 5173) │
└──────┬──────┘
       │
       │ REST API
       ▼
┌─────────────┐
│   Backend   │  Node.js + Express + Prisma
│ (Port 4000) │
└──────┬──────┘
       │
       │ SQL
       ▼
┌─────────────┐
│ PostgreSQL  │  Banco de dados
│ (Port 5432) │
└─────────────┘
```

---

## 🔌 Integrações

### Meta Ads (Facebook + Instagram)

- ✅ OAuth 2.0 funcionando
- ✅ Marketing API integrada
- ✅ Sincronização de campanhas
- ✅ Métricas: Impressões, Cliques, Conversões, ROI

### Google Ads

- 🚧 Em desenvolvimento
- OAuth 2.0 preparado
- API Client estruturado

### TikTok Ads

- 🚧 Em desenvolvimento
- OAuth 2.0 preparado
- API Client estruturado

---

## 📊 Métricas Rastreadas

| Métrica | Descrição |
|---------|-----------|
| **Impressões** | Quantas vezes o anúncio foi exibido |
| **Cliques** | Quantos cliques o anúncio recebeu |
| **CTR** | Taxa de cliques (Click-Through Rate) |
| **CPC** | Custo por clique |
| **CPM** | Custo por mil impressões |
| **Conversões** | Quantas ações foram completadas |
| **CPA** | Custo por aquisição |
| **Gastos** | Total investido |
| **Receita** | Receita gerada |
| **ROAS** | Retorno sobre investimento em ads |

---

## 🛠️ Stack Tecnológica

### Frontend
- **React** 18 com TypeScript
- **Tailwind CSS** v4
- **Shadcn/ui** para componentes
- **Recharts** para gráficos
- **Lucide React** para ícones
- **Sonner** para notificações

### Backend
- **Node.js** com Express
- **TypeScript**
- **Prisma** ORM
- **PostgreSQL** 15
- **JWT** para autenticação
- **Axios** para chamadas de API

### DevOps
- **Docker** & Docker Compose
- **pgAdmin** para gerenciamento do banco

---

## 📂 Estrutura do Projeto

```
/
├── components/          # Componentes React
│   ├── AuthPage.tsx    # Login/Registro
│   ├── KPICards.tsx    # Cards de métricas
│   ├── MainCharts.tsx  # Gráficos principais
│   ├── Sidebar.tsx     # Menu lateral
│   └── ui/             # Componentes Shadcn
│
├── contexts/           # Context API
│   └── AuthContext.tsx # Autenticação
│
├── services/           # Serviços
│   └── api.ts          # Cliente API
│
├── backend/            # Backend completo
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes.ts
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── docker-compose.yml
│
├── App.tsx             # Componente principal
├── .env                # Variáveis de ambiente
└── README.md           # Este arquivo
```

---

## 🔐 Segurança

- ✅ JWT com expiração
- ✅ Senhas hasheadas (bcrypt)
- ✅ CORS configurado
- ✅ Tokens OAuth seguros
- ✅ Validação de entrada
- ⚠️ **NÃO use em produção sem SSL/HTTPS**

---

## 📖 Documentação

| Documento | Descrição |
|-----------|-----------|
| [INICIO_RAPIDO.md](./INICIO_RAPIDO.md) | Guia de 3 passos |
| [COMO_USAR.md](./COMO_USAR.md) | Guia completo |
| [backend/README.md](./backend/README.md) | Documentação do backend |
| [backend/API_EXAMPLES.md](./backend/API_EXAMPLES.md) | Exemplos de API |
| [FACEBOOK_SETUP.md](./FACEBOOK_SETUP.md) | Como configurar Facebook |

---

## 🐛 Troubleshooting

### Erro "Failed to fetch"

**Backend não está rodando.**

```bash
cd backend
docker-compose up -d
```

### Banco de dados corrompido

```bash
cd backend
docker-compose down -v
docker-compose up -d
```

⚠️ **Isso apaga todos os dados!**

### Popup OAuth bloqueado

Permita popups para `localhost:5173` no navegador.

---

## 🤝 Contribuindo

Este é um projeto privado, mas sugestões são bem-vindas!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Projeto privado. Todos os direitos reservados.

---

## 🎯 Roadmap

### Q1 2025
- ✅ Autenticação completa
- ✅ OAuth Meta Ads
- ✅ Dashboard básico
- 🚧 OAuth Google Ads
- 🚧 OAuth TikTok Ads

### Q2 2025
- 📊 Relatórios avançados
- 📧 Alertas automáticos
- 🤖 Insights com IA
- 🌍 Internacionalização

### Q3 2025
- 📱 App mobile
- 🔔 Notificações push
- 📊 Dashboards customizáveis
- 🔄 Webhooks

---

## 💡 Inspiração

Este projeto foi inspirado na necessidade de ter um dashboard unificado para gerenciar campanhas de múltiplas plataformas de anúncios, eliminando a necessidade de acessar cada plataforma separadamente.

---

## 📞 Suporte

- 📧 Email: suporte@exemplo.com
- 📖 Docs: [COMO_USAR.md](./COMO_USAR.md)
- 🐛 Issues: GitHub Issues

---

## ⭐ Agradecimentos

- **Shadcn/ui** pelos componentes incríveis
- **Recharts** pelos gráficos
- **Prisma** pelo ORM fantástico
- **Meta**, **Google** e **TikTok** pelas APIs

---

**Desenvolvido com ❤️ para simplificar o gerenciamento de tráfego pago**

---

## 📸 Screenshots

### Login
![Login](https://via.placeholder.com/800x450/6366f1/ffffff?text=Login+Page)

### Dashboard
![Dashboard](https://via.placeholder.com/800x450/6366f1/ffffff?text=Dashboard)

### Integrações
![Integrações](https://via.placeholder.com/800x450/6366f1/ffffff?text=Integrations)

---

## 🚀 Status dos Serviços

| Serviço | Status | URL |
|---------|--------|-----|
| Frontend | ✅ Ativo | http://localhost:5173 |
| Backend API | ✅ Ativo | http://localhost:4000 |
| PostgreSQL | ✅ Ativo | localhost:5432 |
| pgAdmin | ✅ Ativo | http://localhost:5050 |

---

**Última atualização:** 2025-01-17
