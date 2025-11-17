# 🚀 COMECE AQUI - Ads Dashboard

## ⚡ INÍCIO RÁPIDO (3 PASSOS)

### 1️⃣ Execute o Script

**Windows:**
```bash
start-all.bat
```

**Linux/Mac:**
```bash
chmod +x start-all.sh
./start-all.sh
```

### 2️⃣ Acesse o Sistema

Abra no navegador:
```
http://localhost:5173
```

### 3️⃣ Crie sua Conta

- Clique em "Criar Conta"
- Preencha: nome, email, senha
- Clique em "Criar Conta"

✅ **PRONTO! Você está dentro!**

---

## 🎯 O QUE É ESTE SISTEMA?

Dashboard profissional para analisar campanhas de **Meta Ads**, **Google Ads** e **TikTok Ads** em um só lugar.

**Principais funcionalidades:**
- 📊 Visualizar métricas de todas as plataformas
- 📈 Gráficos de performance
- 🔌 Conectar via OAuth
- 🔄 Sincronização automática
- 📉 Comparação entre períodos
- 🎯 Insights automáticos

---

## 📋 VOCÊ PRECISA TER:

- ✅ **Docker Desktop** (instalado e rodando)
- ✅ **Node.js** 18+
- ✅ **npm** (vem com Node.js)

**Não tem?** Veja: [PASSO-A-PASSO.md](./PASSO-A-PASSO.md)

---

## 🏗️ ARQUITETURA

```
Frontend (React)  ←→  Backend (Node.js)  ←→  PostgreSQL
     ↓                      ↓                     ↓
http://localhost:5173  http://localhost:4000  localhost:5432
```

**Tudo roda localmente no seu computador!**

---

## 🔌 PLATAFORMAS SUPORTADAS

| Plataforma | Status | Como Conectar |
|------------|--------|---------------|
| **Meta Ads** | ✅ Funcionando | [COMO_USAR.md](./COMO_USAR.md) |
| **Google Ads** | 🚧 Em desenvolvimento | Aguardando credenciais |
| **TikTok Ads** | 🚧 Em desenvolvimento | Aguardando credenciais |

---

## 📊 PRÓXIMOS PASSOS

### Após criar sua conta:

1. **Explorar o Dashboard**
   - Veja a interface
   - Conheça os componentes
   - Explore os menus

2. **Conectar Meta Ads** (opcional)
   - Vá em "Integrações"
   - Clique em "Conectar" no Meta Ads
   - Siga o fluxo OAuth
   - [Guia completo](./COMO_USAR.md)

3. **Sincronizar Dados**
   - Após conectar, clique em "Sincronizar"
   - Aguarde os dados serem importados
   - Veja suas métricas no dashboard!

4. **Explorar Funcionalidades**
   - Filtrar por período
   - Comparar métricas
   - Ver gráficos
   - Exportar relatórios

---

## 📚 DOCUMENTAÇÃO

| Arquivo | Quando usar |
|---------|-------------|
| **LEIA-ME.md** | Guia rápido de uso |
| **PASSO-A-PASSO.md** | Guia visual detalhado |
| **COMO_USAR.md** | Guia completo com tudo |
| **GUIA-VISUAL.md** | Ver capturas de tela |
| **RESUMO-SISTEMA.md** | Entender a arquitetura |
| **README.md** | Documentação técnica |

---

## ❌ PROBLEMAS COMUNS

### "Failed to fetch"
**Causa:** Backend não está rodando

**Solução:**
```bash
cd backend
docker-compose up -d
```

### "Docker não está rodando"
**Causa:** Docker Desktop não iniciou

**Solução:**
1. Abra o Docker Desktop
2. Aguarde ícone ficar verde
3. Execute start-all novamente

### "Porta em uso"
**Causa:** Outro processo usando a porta

**Solução:**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID [NUMERO] /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

---

## 🛑 PARAR O SISTEMA

**Windows:**
```bash
stop-all.bat
```

**Linux/Mac:**
```bash
./stop-all.sh
```

---

## 🎯 ESTRUTURA DO PROJETO

```
/
├── start-all.bat       # ⭐ EXECUTE ESTE
├── start-all.sh        # ⭐ OU ESTE (Linux/Mac)
├── stop-all.bat        # Parar tudo
├── stop-all.sh         # Parar tudo (Linux/Mac)
│
├── components/         # 12 componentes React
├── backend/           # Backend completo
│
├── COMECE-AQUI.md     # ⭐ VOCÊ ESTÁ AQUI
├── LEIA-ME.md         # Guia rápido
├── PASSO-A-PASSO.md   # Guia visual
├── COMO_USAR.md       # Guia completo
└── README.md          # Documentação técnica
```

---

## 🎨 PREVIEW DO SISTEMA

### Tela de Login:
```
┌─────────────────────────┐
│   🎯 Ads Dashboard      │
│                         │
│  Email: __________      │
│  Senha: __________      │
│                         │
│     [  Entrar  ]        │
└─────────────────────────┘
```

### Dashboard:
```
┌─────────────────────────────────────┐
│ 📊 Dashboard                    👤  │
├─────┬───────────────────────────────┤
│ 📊  │  Gastos  Cliques  CTR  ROAS  │
│ 🔌  │  R$ 0      0      0%    0x   │
│ 📈  │                               │
│ ⚙️  │  [Gráfico de Performance]    │
│     │                               │
│     │  Conecte suas plataformas!   │
└─────┴───────────────────────────────┘
```

---

## ✅ CHECKLIST

Antes de executar, verifique:

- [ ] Docker Desktop instalado e **RODANDO**
- [ ] Node.js instalado (versão 18+)
- [ ] npm instalado
- [ ] Porta 5173 disponível
- [ ] Porta 4000 disponível
- [ ] Porta 5432 disponível

**Tudo OK?** Execute `start-all.bat` ou `./start-all.sh`

---

## 🎉 PRIMEIRO USO

**O que esperar:**

1️⃣ **Primeira execução:**
   - Demora ~1-2 minutos
   - Docker baixa imagens
   - npm instala dependências
   - Banco de dados é criado

2️⃣ **Próximas execuções:**
   - Demora ~15 segundos
   - Tudo já está pronto
   - Apenas inicializa os serviços

3️⃣ **Sistema rodando:**
   - Frontend em http://localhost:5173
   - Backend em http://localhost:4000
   - PostgreSQL em localhost:5432
   - pgAdmin em http://localhost:5050

---

## 💡 DICAS

1. **Mantenha o Docker Desktop aberto** enquanto usa o sistema
2. **Use os scripts** para iniciar/parar (não tente manualmente)
3. **Backend sempre antes** do frontend (os scripts fazem isso)
4. **Crie uma conta teste** para explorar antes de conectar plataformas reais
5. **Veja os logs** se algo der errado: `cd backend && docker-compose logs -f`

---

## 🚀 COMEÇAR AGORA

### 3 comandos para começar:

```bash
# 1. Iniciar tudo
start-all.bat  # Windows
./start-all.sh # Linux/Mac

# 2. Abrir navegador
# http://localhost:5173

# 3. Criar conta e explorar!
```

---

## 📞 PRECISA DE AJUDA?

**Documentação:**
- 🆘 Problemas? → [PASSO-A-PASSO.md](./PASSO-A-PASSO.md)
- 📖 Como usar? → [COMO_USAR.md](./COMO_USAR.md)
- 🔧 Detalhes técnicos? → [README.md](./README.md)
- 🎨 Ver telas? → [GUIA-VISUAL.md](./GUIA-VISUAL.md)

**Backend:**
- API → [backend/README.md](./backend/README.md)
- Exemplos → [backend/API_EXAMPLES.md](./backend/API_EXAMPLES.md)

---

## 🎯 OBJETIVO FINAL

Ter um dashboard profissional onde você pode:

✅ Ver todas as métricas em um só lugar
✅ Comparar performance entre plataformas
✅ Tomar decisões baseadas em dados
✅ Economizar tempo não acessando múltiplos painéis

---

## ⭐ RECURSOS PRINCIPAIS

- 📊 **Dashboard unificado** - Todas as plataformas juntas
- 🔌 **OAuth seguro** - Conecte com 1 clique
- 📈 **Gráficos interativos** - Visualize tendências
- 🔄 **Sincronização automática** - Dados sempre atualizados
- 📱 **Responsivo** - Funciona em qualquer dispositivo
- 🎨 **Interface moderna** - Design profissional
- 🔐 **Seguro** - Autenticação JWT + OAuth 2.0

---

## 🎊 ESTÁ PRONTO!

Você tem tudo que precisa para começar:

✅ Sistema completo
✅ Scripts prontos
✅ Documentação completa
✅ Backend funcional
✅ Frontend profissional

**Agora é só executar e explorar!** 🚀

```bash
start-all.bat  # Windows
./start-all.sh # Linux/Mac
```

**Boa análise dos seus dados de tráfego pago!** 📊

---

**Desenvolvido com ❤️ para simplificar sua vida de trafego**
