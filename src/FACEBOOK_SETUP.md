# 🔐 Guia de Configuração - Meta Ads (Facebook + Instagram)

Este guia te ajudará a configurar a integração com a API do Meta Ads (Facebook/Instagram) em poucos passos.

---

## 📋 Pré-requisitos

- ✅ Conta no Facebook
- ✅ Facebook Business Manager criado
- ✅ Backend rodando em `http://localhost:4000`

---

## 🚀 Passo a Passo

### 1️⃣ Criar App no Meta for Developers

1. Acesse: https://developers.facebook.com/
2. Clique em **"Meus Apps"** → **"Criar App"**
3. Selecione tipo: **"Empresa"**
4. Preencha:
   - **Nome do App:** "Ads Dashboard" (ou qualquer nome)
   - **Email de contato:** seu-email@exemplo.com
   - **Business Manager:** Selecione sua conta
5. Clique em **"Criar App"**

### 2️⃣ Configurar App ID e Secret

1. No dashboard do seu app, vá para **Configurações → Básico**
2. Copie:
   - **ID do App** (ex: `123456789012345`)
   - **Chave Secreta do App** (clique em "Mostrar")

### 3️⃣ Adicionar Produto "Marketing API"

1. No menu lateral, clique em **"Adicionar Produto"**
2. Encontre **"Marketing API"** → Clique em **"Configurar"**
3. Aceite os termos

### 4️⃣ Configurar OAuth Redirect

1. Vá para **Configurações → Básico**
2. Role até **"URIs de Redirecionamento Válidos do OAuth"**
3. Adicione:
   ```
   http://localhost:4000/api/auth/meta/callback
   ```
4. Clique em **"Salvar Alterações"**

### 5️⃣ Adicionar Domínios do App

1. Na mesma página, em **"Domínios do App"**, adicione:
   ```
   localhost
   ```

### 6️⃣ Configurar Permissões

1. Vá para **Análise do App → Permissões e Recursos**
2. Solicite acesso para:
   - ✅ `ads_management` - Gerenciar anúncios
   - ✅ `ads_read` - Ler dados de anúncios
   - ✅ `business_management` - Gerenciar Business Manager

**Nota:** Para apps em desenvolvimento, você já tem essas permissões. Para produção, precisará enviar para revisão.

### 7️⃣ Tornar App Público (Desenvolvimento)

1. Vá para **Configurações → Básico**
2. Em **"Modo do App"**, certifique-se que está em **"Desenvolvimento"**
3. Para testes, adicione usuários de teste em **"Funções → Testadores"**

### 8️⃣ Configurar Backend

Edite o arquivo `backend/.env`:

```env
# Meta Ads OAuth
META_APP_ID=123456789012345
META_APP_SECRET=sua_chave_secreta_aqui
META_REDIRECT_URI=http://localhost:4000/api/auth/meta/callback
```

**Substitua** `123456789012345` e `sua_chave_secreta_aqui` pelos valores do passo 2.

### 9️⃣ Reiniciar Backend

```bash
cd backend
docker-compose restart app

# Ou se estiver rodando localmente
npm run dev
```

### 🔟 Testar Conexão

1. Abra o frontend: `http://localhost:5173/#integrations`
2. Clique em **"Conectar via OAuth"** no card do Meta Ads
3. Um popup abrirá
4. Faça login no Facebook
5. Autorize o app
6. Popup fechará automaticamente
7. ✅ Meta Ads aparecerá como **"Conectado"**!

---

## 🎯 Testando a API

### Via Frontend

1. Após conectar, clique em **"Sincronizar Agora"**
2. Aguarde alguns segundos
3. Toast de sucesso aparecerá
4. Dados começarão a aparecer no dashboard

### Via cURL

```bash
# 1. Registrar usuário
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@teste.com",
    "password": "senha123",
    "name": "Teste"
  }'

# Copie o TOKEN retornado

# 2. Listar contas conectadas
curl http://localhost:4000/api/accounts \
  -H "Authorization: Bearer SEU_TOKEN"

# 3. Sincronizar dados (substitua ACCOUNT_ID)
curl -X POST http://localhost:4000/api/accounts/ACCOUNT_ID/sync \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 🔍 Verificar Dados no Banco

```bash
cd backend
npx prisma studio
```

Acesse: `http://localhost:5555`

Vá para a tabela **CampaignInsights** para ver os dados importados!

---

## 🐛 Troubleshooting

### Erro: "App não aprovado"

**Problema:** Você não é admin do Business Manager

**Solução:**
1. Vá para https://business.facebook.com/
2. Certifique-se que você é admin
3. Ou adicione seu usuário de teste

### Erro: "Redirect URI não corresponde"

**Problema:** URL de callback está diferente

**Solução:**
1. Verifique `backend/.env` → `META_REDIRECT_URI`
2. Deve ser exatamente: `http://localhost:4000/api/auth/meta/callback`
3. Verifique no Meta for Developers → Configurações → Básico

### Erro: "Access token inválido"

**Problema:** Token expirou

**Solução:**
1. Desconecte a plataforma
2. Conecte novamente
3. O backend salvará o novo token

### Popup é bloqueado

**Solução:**
1. Habilite popups no navegador
2. Ou clique no ícone de popup bloqueado na barra de endereço

### Nenhum dado aparece

**Verificar:**
1. Você tem campanhas ativas no Facebook Ads?
2. Você autorizou as permissões corretas?
3. Verificar logs do backend: `docker-compose logs -f app`

---

## 📊 Dados Disponíveis

Após sincronizar, você terá acesso a:

- ✅ **Campanhas:** Nome, status, objetivo
- ✅ **Métricas:** Impressões, cliques, gastos
- ✅ **Conversões:** Conversões, receita
- ✅ **Performance:** CTR, CPC, CPM, CPA, ROAS
- ✅ **Histórico:** Dados diários das últimas campanhas

---

## 🔐 Segurança

### Tokens são armazenados com segurança:

- ✅ Criptografados no banco de dados
- ✅ Nunca expostos no frontend
- ✅ Refresh automático quando expiram
- ✅ Podem ser revogados a qualquer momento

### Revogar Acesso:

**No Dashboard:**
1. Vá para `/#integrations`
2. Clique em **"Desconectar"** no Meta Ads

**No Facebook:**
1. Acesse: https://www.facebook.com/settings?tab=business_tools
2. Encontre seu app
3. Clique em **"Remover"**

---

## 🚀 Próximos Passos

Agora que o Meta Ads está conectado:

1. ✅ Configurar Google Ads (ver `GOOGLE_SETUP.md`)
2. ✅ Configurar TikTok Ads (ver `TIKTOK_SETUP.md`)
3. ✅ Agendar sincronização automática
4. ✅ Criar relatórios personalizados

---

## 📚 Recursos Oficiais

- 📖 [Meta Marketing API Docs](https://developers.facebook.com/docs/marketing-apis)
- 🔑 [Tokens de Acesso](https://developers.facebook.com/docs/facebook-login/guides/access-tokens)
- 🛠️ [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- 💬 [Comunidade](https://www.facebook.com/groups/fbdevelopers)

---

## ✅ Checklist de Configuração

- [ ] App criado no Meta for Developers
- [ ] App ID e Secret copiados
- [ ] Marketing API adicionada
- [ ] OAuth Redirect configurado (`localhost:4000/api/auth/meta/callback`)
- [ ] Permissões solicitadas (ads_management, ads_read)
- [ ] `backend/.env` configurado
- [ ] Backend reiniciado
- [ ] Teste de conexão realizado
- [ ] Dados sincronizados com sucesso

---

**Dúvidas?** Abra uma issue ou consulte a documentação oficial do Meta!

🎉 **Integração completa com Meta Ads configurada!**
