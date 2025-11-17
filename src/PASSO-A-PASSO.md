# 📋 PASSO A PASSO VISUAL

## 🎯 OBJETIVO
Rodar o Dashboard de Tráfego Pago completo (Frontend + Backend) com 1 comando.

---

## ✅ ANTES DE COMEÇAR

### Você TEM instalado?

- [ ] **Docker Desktop** instalado e RODANDO
- [ ] **Node.js** 18 ou superior
- [ ] **npm** (vem com Node.js)

Se NÃO tiver, veja: [Instalar Pré-requisitos](#instalar-pré-requisitos)

---

## 🚀 PASSO 1: EXECUTAR O SCRIPT

### No Windows:
1. Abra o **Explorador de Arquivos**
2. Navegue até a pasta do projeto
3. Clique duplo em: **`start-all.bat`**

**OU** abra o **CMD/PowerShell** e execute:
```bash
start-all.bat
```

### No Linux/Mac:
Abra o **Terminal** na pasta do projeto e execute:
```bash
chmod +x start-all.sh
./start-all.sh
```

---

## ⏳ PASSO 2: AGUARDE

Você verá mensagens como:

```
🚀 Iniciando Ads Dashboard COMPLETO...
🐳 Docker OK!
📦 Node.js OK!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  INICIANDO BACKEND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Backend iniciado!
⏳ Aguardando backend ficar pronto...
..........
✅ Backend online!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  INICIANDO FRONTEND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Frontend rodando!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ TUDO RODANDO COM SUCESSO!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Frontend:      http://localhost:5173
🔌 Backend API:   http://localhost:4000/api
💾 PostgreSQL:    localhost:5432
🗄️  pgAdmin:      http://localhost:5050

🎯 Acesse: http://localhost:5173
```

**Primeira vez demora ~1-2 minutos**
**Próximas vezes: ~15 segundos**

---

## 🌐 PASSO 3: ACESSAR O SISTEMA

### Abra o navegador e acesse:
```
http://localhost:5173
```

Você verá a tela de **Login/Registro**:

```
┌─────────────────────────────────┐
│                                 │
│         🎯 Ads Dashboard        │
│                                 │
│  ┌───────────┬───────────┐     │
│  │  Login    │  Registro │     │
│  └───────────┴───────────┘     │
│                                 │
│  Email: ___________________    │
│  Senha: ___________________    │
│                                 │
│      [  Entrar  ]              │
│                                 │
└─────────────────────────────────┘
```

---

## 📝 PASSO 4: CRIAR SUA CONTA

1. Clique na aba **"Criar Conta"** (ou **"Registro"**)

2. Preencha os campos:
   ```
   Nome:     João Silva
   Email:    joao@email.com
   Senha:    senha123
   Confirmar: senha123
   ```

3. Clique em **"Criar Conta"**

4. ✅ **PRONTO!** Você será redirecionado para o Dashboard

---

## 📊 PASSO 5: EXPLORAR O DASHBOARD

Você verá:

```
┌─────────────────────────────────────────────────────┐
│ 📊 Dashboard    🔌 Integrações    📈 Relatórios     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📈 KPIs                                            │
│  ┌─────────┬─────────┬─────────┬─────────┐         │
│  │ Gasto   │ Cliques │ CTR     │ ROAS    │         │
│  │ R$ 0    │    0    │  0%     │  0x     │         │
│  └─────────┴─────────┴─────────┴─────────┘         │
│                                                     │
│  📊 Gráfico de Performance                          │
│  [Gráfico de linhas vazio]                         │
│                                                     │
│  🔌 Conecte suas plataformas:                       │
│  - Meta Ads (Facebook + Instagram)                 │
│  - Google Ads                                      │
│  - TikTok Ads                                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Os dados estarão vazios até você conectar uma plataforma!**

---

## 🔌 PASSO 6: CONECTAR PLATAFORMAS (OPCIONAL)

### Para conectar o Meta Ads:

1. Vá em **"Integrações"** no menu
2. Clique em **"Conectar"** no card do Meta Ads
3. Uma janela popup abrirá
4. Faça login no Facebook
5. Autorize o app
6. ✅ Conexão estabelecida!

**Veja guia completo:** [COMO_USAR.md](./COMO_USAR.md)

---

## 🛑 PASSO 7: PARAR O SISTEMA

Quando terminar, execute:

### Windows:
```bash
stop-all.bat
```

### Linux/Mac:
```bash
./stop-all.sh
```

**OU** simplesmente:
- Feche as janelas do terminal
- Pressione `CTRL+C`

---

## ❌ PROBLEMAS COMUNS

### ❌ Erro: "Docker não instalado"
**Solução:** Instale o Docker Desktop
- Windows/Mac: https://www.docker.com/products/docker-desktop/
- Linux: https://docs.docker.com/engine/install/

### ❌ Erro: "Docker não está rodando"
**Solução:** 
1. Abra o **Docker Desktop**
2. Aguarde o ícone ficar verde
3. Execute o script novamente

### ❌ Erro: "Node.js não instalado"
**Solução:** Instale o Node.js
- https://nodejs.org/ (escolha a versão LTS)

### ❌ Erro: "Failed to fetch"
**Causa:** Backend não iniciou corretamente

**Solução:**
```bash
cd backend
docker-compose down
docker-compose up -d
```

Aguarde 15 segundos e recarregue a página.

### ❌ Erro: "Porta 5173 em uso"
**Causa:** Outro processo está usando a porta

**Solução Windows:**
```bash
netstat -ano | findstr :5173
taskkill /PID [NUMERO] /F
```

**Solução Linux/Mac:**
```bash
lsof -ti:5173 | xargs kill -9
```

### ❌ Erro: "Cannot connect to Docker daemon"
**Causa:** Docker Desktop não está iniciado

**Solução:**
1. Abra o Docker Desktop
2. Aguarde mensagem "Docker Desktop is running"
3. Execute o script novamente

---

## 📚 INSTALAR PRÉ-REQUISITOS

### Docker Desktop

**Windows & Mac:**
1. Acesse: https://www.docker.com/products/docker-desktop/
2. Clique em **"Download for Windows"** ou **"Download for Mac"**
3. Execute o instalador
4. Após instalar, **abra o Docker Desktop**
5. Aguarde inicializar completamente

**Linux:**
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl start docker
sudo systemctl enable docker
```

### Node.js

**Windows & Mac:**
1. Acesse: https://nodejs.org/
2. Baixe a versão **LTS** (Recomendada)
3. Execute o instalador
4. Aceite todas as opções padrão

**Linux:**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

---

## ✅ CHECKLIST FINAL

Antes de executar o script, verifique:

- [ ] Docker Desktop instalado
- [ ] Docker Desktop **RODANDO** (ícone verde)
- [ ] Node.js 18+ instalado
- [ ] npm instalado (vem com Node.js)
- [ ] Terminal/CMD aberto na pasta do projeto
- [ ] Portas 4000, 5173, 5432 e 5050 livres

Se tudo estiver ✅, execute:

```bash
start-all.bat  # Windows
./start-all.sh # Linux/Mac
```

---

## 🎉 SUCESSO!

Se você viu:
```
✅ TUDO RODANDO COM SUCESSO!
```

E consegue acessar:
```
http://localhost:5173
```

**PARABÉNS! Está tudo funcionando!** 🎊

Agora explore o dashboard e conecte suas plataformas de anúncios!

---

## 📞 PRECISA DE AJUDA?

Consulte:
- [LEIA-ME.md](./LEIA-ME.md) - Guia rápido
- [COMO_USAR.md](./COMO_USAR.md) - Guia completo
- [README.md](./README.md) - Documentação técnica

---

**Boa análise dos seus dados de tráfego pago!** 📊🚀
