# 🚀 Como Usar - Dashboard de Tráfego Pago

## 📋 Pré-requisitos

- **Docker** instalado e rodando
- **Node.js** 18+ instalado
- **Credenciais do Facebook Ads** (opcional, mas recomendado)

---

## ⚡ Início Rápido

### Passo 1: Iniciar o Backend

```bash
cd backend
docker-compose up -d
```

Aguarde ~10-15 segundos para o backend inicializar completamente.

**Verificar se está rodando:**
```bash
docker-compose ps
```

Você deve ver 3 containers:
- ✅ `backend-app-1` (API)
- ✅ `backend-db-1` (PostgreSQL)
- ✅ `backend-pgadmin-1` (pgAdmin)

---

### Passo 2: Acessar o Frontend

O frontend já deve estar rodando em:
```
http://localhost:5173
```

Se não estiver, execute:
```bash
npm run dev
```

---

### Passo 3: Criar sua conta

1. Acesse `http://localhost:5173`
2. Clique em **"Criar Conta"**
3. Preencha:
   - Nome: `Seu Nome`
   - Email: `seu@email.com`
   - Senha: mínimo 6 caracteres

4. ✅ **Pronto!** Você está logado!

---

## 🔌 Conectar com Facebook Ads (Opcional)

### Passo 1: Criar App no Facebook

1. Acesse: https://developers.facebook.com/
2. Vá em **"Meus Apps"** → **"Criar App"**
3. Escolha tipo: **"Empresa"**
4. Preencha:
   - Nome do App: `Ads Dashboard`
   - Email de contato: seu email

### Passo 2: Adicionar Marketing API

1. No painel do app, clique em **"Adicionar Produto"**
2. Escolha **"Marketing API"**
3. Aceite os termos

### Passo 3: Configurar OAuth

1. Vá em **Configurações → Básico**
2. Copie:
   - **ID do App**
   - **Chave Secreta do App**

3. Role até **"URIs de Redirecionamento do OAuth"**
4. Adicione:
   ```
   http://localhost:4000/api/auth/meta/callback
   ```

5. Salve as alterações

### Passo 4: Adicionar Credenciais ao Backend

Edite o arquivo `/backend/.env`:

```env
META_APP_ID=SEU_APP_ID_AQUI
META_APP_SECRET=SEU_APP_SECRET_AQUI
```

**Exemplo:**
```env
META_APP_ID=1234567890123456
META_APP_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### Passo 5: Reiniciar o Backend

```bash
cd backend
docker-compose restart
```

### Passo 6: Conectar no Dashboard

1. No dashboard, vá para **"Integrações"**
2. No card **Meta Ads**, clique em **"Conectar via OAuth"**
3. Uma janela popup abrirá
4. Faça login no Facebook
5. Autorize o app
6. ✅ Conexão estabelecida!

### Passo 7: Sincronizar Dados

1. Após conectar, clique em **"Sincronizar Agora"**
2. Aguarde ~5-10 segundos
3. ✅ Dados aparecem no dashboard!

---

## 🔍 Verificar se está Funcionando

### Backend está rodando?

```bash
curl http://localhost:4000/api/health
```

Deve retornar: `{"status":"ok"}`

### Frontend conecta ao backend?

Abra o console do navegador (F12) e verifique se há erros de rede.

Se aparecer **"Failed to fetch"**:
- ✅ Verifique se o backend está rodando
- ✅ Verifique se está na porta 4000
- ✅ Reinicie o backend

---

## 🐛 Problemas Comuns

### ❌ "Failed to fetch" ao fazer login

**Causa:** Backend não está rodando ou não está acessível.

**Solução:**
```bash
cd backend
docker-compose up -d
docker-compose logs -f
```

Aguarde até ver:
```
✅ Connected to PostgreSQL
✅ Server running on port 4000
```

---

### ❌ "Error: connect ECONNREFUSED"

**Causa:** PostgreSQL não iniciou.

**Solução:**
```bash
cd backend
docker-compose down
docker-compose up -d
```

Aguarde 15 segundos e tente novamente.

---

### ❌ Popup do OAuth é bloqueado

**Causa:** Navegador está bloqueando popups.

**Solução:**
1. Clique no ícone de popup bloqueado na barra de endereço
2. Selecione "Sempre permitir popups de localhost:5173"
3. Tente conectar novamente

---

### ❌ "Invalid OAuth callback"

**Causa:** URI de redirecionamento não configurada no Facebook.

**Solução:**
1. Vá em https://developers.facebook.com/
2. Abra seu app → Configurações → Básico
3. Adicione em "URIs de Redirecionamento do OAuth":
   ```
   http://localhost:4000/api/auth/meta/callback
   ```
4. Salve e tente novamente

---

## 📊 Estrutura do Projeto

```
/
├── backend/              # API Node.js + PostgreSQL
│   ├── src/             # Código fonte
│   ├── prisma/          # Schema do banco
│   ├── docker-compose.yml
│   └── .env             # ⚠️ Configure suas credenciais aqui!
│
├── components/          # Componentes React
├── contexts/           # Context API (Auth, etc)
├── services/           # API Client
├── App.tsx             # Componente principal
└── .env                # Config do frontend
```

---

## 🎯 Próximos Passos

Após configurar o Facebook Ads:

1. ✅ Conecte **Google Ads** (em desenvolvimento)
2. ✅ Conecte **TikTok Ads** (em desenvolvimento)
3. ✅ Configure ETL automático para sincronizar dados diariamente
4. ✅ Explore os gráficos e insights

---

## 🔐 Segurança

### ⚠️ IMPORTANTE

- ❌ **NÃO** comite o arquivo `.env` no git
- ❌ **NÃO** compartilhe suas credenciais do Facebook
- ❌ **NÃO** use em produção sem configurar SSL/HTTPS
- ✅ **SIM** use variáveis de ambiente seguras em produção
- ✅ **SIM** configure CORS adequadamente para produção

---

## 📞 Suporte

### Backend não inicia?

```bash
cd backend
docker-compose logs -f
```

### Frontend com erro?

Abra o console do navegador (F12) e veja os erros.

### Banco de dados corrompido?

```bash
cd backend
docker-compose down -v
docker-compose up -d
```

⚠️ **Isso apaga todos os dados!**

---

## ✅ Checklist de Verificação

- [ ] Docker está instalado e rodando
- [ ] Backend iniciado com `docker-compose up -d`
- [ ] Backend respondendo em `http://localhost:4000/api/health`
- [ ] Frontend rodando em `http://localhost:5173`
- [ ] Conta criada com sucesso
- [ ] Login funcionando
- [ ] Dashboard carregando
- [ ] (Opcional) Credenciais do Facebook configuradas
- [ ] (Opcional) OAuth do Facebook funcionando
- [ ] (Opcional) Dados sincronizados

---

## 🎉 Está Funcionando!

Se você conseguiu:
- ✅ Criar uma conta
- ✅ Fazer login
- ✅ Ver o dashboard
- ✅ (Opcional) Conectar com Facebook Ads

**PARABÉNS! O sistema está 100% operacional!** 🎊

Agora você pode explorar todas as funcionalidades do dashboard!

---

## 📚 Documentação Adicional

- **Backend completo:** Ver `/backend/README.md`
- **APIs disponíveis:** Ver `/backend/API_EXAMPLES.md`
- **Roadmap:** Ver `/backend/ROADMAP.md`
- **Setup Facebook:** Ver `/FACEBOOK_SETUP.md` (se existir)

---

## 🚀 Deploy para Produção

**Em desenvolvimento.** Por enquanto, use apenas localmente.

Para produção, você precisará:
- Servidor VPS ou cloud (AWS, DigitalOcean, etc)
- Domínio próprio
- SSL/HTTPS configurado
- Variáveis de ambiente seguras
- Backup do banco de dados
- Monitoramento e logs

---

## 💡 Dicas

1. Use **pgAdmin** para visualizar o banco: http://localhost:5050
   - Email: `admin@admin.com`
   - Senha: `admin`

2. Veja logs do backend em tempo real:
   ```bash
   cd backend
   docker-compose logs -f app
   ```

3. Reinicie o backend após mudar `.env`:
   ```bash
   docker-compose restart
   ```

4. Use o painel de **Integrações** para gerenciar todas as conexões

---

**Divirta-se analisando seus dados de tráfego pago!** 📊🚀
