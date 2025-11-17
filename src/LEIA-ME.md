# 🚀 COMO RODAR O SISTEMA

## ⚡ MODO SIMPLES - 1 COMANDO

### Windows
```bash
start-all.bat
```

### Linux / macOS
```bash
chmod +x start-all.sh
./start-all.sh
```

**Pronto!** O sistema vai:
1. ✅ Iniciar o backend (Docker)
2. ✅ Aguardar o backend ficar pronto
3. ✅ Instalar dependências (se necessário)
4. ✅ Iniciar o frontend
5. ✅ Abrir automaticamente no navegador

---

## 🎯 Acesso

Após executar o script, acesse:

```
http://localhost:5173
```

### Criar sua conta:
1. Clique em **"Criar Conta"**
2. Preencha: nome, email, senha
3. Clique em **"Criar Conta"**
4. ✅ **Pronto! Você está logado!**

---

## 🛑 Como Parar

### Windows
```bash
stop-all.bat
```

### Linux / macOS
```bash
./stop-all.sh
```

Ou simplesmente:
- Feche as janelas do terminal
- Pressione `CTRL+C`

---

## 📊 URLs Importantes

| Serviço | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:4000/api |
| **pgAdmin** | http://localhost:5050 |

### pgAdmin (Gerenciar Banco)
- Email: `admin@admin.com`
- Senha: `admin`

---

## ❌ Problemas?

### Erro "Failed to fetch"
**Backend não está rodando.**

Execute novamente:
```bash
start-all.bat  # Windows
./start-all.sh # Linux/Mac
```

### Porta 5173 já está em uso
Outro processo está usando a porta. Para liberar:

**Windows:**
```bash
netstat -ano | findstr :5173
taskkill /PID [NUMERO_DO_PID] /F
```

**Linux/Mac:**
```bash
lsof -ti:5173 | xargs kill -9
```

### Porta 4000 já está em uso
```bash
cd backend
docker-compose down
docker-compose up -d
```

### Docker não está rodando
1. Abra o Docker Desktop
2. Aguarde inicializar
3. Execute o script novamente

---

## 📋 Pré-requisitos

Certifique-se de ter instalado:

- ✅ **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)
- ✅ **Node.js 18+** - [Download](https://nodejs.org/)
- ✅ **npm** (vem com Node.js)

---

## 🎯 Primeira Vez?

### 1. Instale os pré-requisitos
- Docker Desktop
- Node.js

### 2. Execute o script de início
```bash
start-all.bat  # Windows
./start-all.sh # Linux/Mac
```

### 3. Aguarde (primeira vez demora ~1-2 minutos)
- Docker vai baixar as imagens
- npm vai instalar as dependências
- Backend vai criar o banco de dados

### 4. Acesse e crie sua conta
```
http://localhost:5173
```

---

## 🔄 Próximas Vezes

Simplesmente execute:
```bash
start-all.bat  # Windows
./start-all.sh # Linux/Mac
```

Será muito mais rápido (~15 segundos)!

---

## 📚 Documentação Completa

Para mais detalhes:
- [README.md](./README.md) - Documentação completa
- [COMO_USAR.md](./COMO_USAR.md) - Guia detalhado
- [backend/README.md](./backend/README.md) - Backend

---

## 🎉 Tudo Funcionando?

Se você viu:
```
✅ TUDO RODANDO COM SUCESSO!
```

E consegue acessar http://localhost:5173

**PARABÉNS! O sistema está 100% operacional!** 🎊

Agora explore:
- 📊 Dashboard com métricas
- 🔌 Página de Integrações
- 📈 Gráficos de performance
- ⚙️ Configurações

---

## 💡 Dicas

1. **Primeira vez é mais lenta** - Docker precisa baixar imagens
2. **Sempre use os scripts** - eles garantem que tudo está sincronizado
3. **Feche com stop-all** - para não deixar processos rodando
4. **Backend sempre primeiro** - o frontend depende do backend

---

## 🚀 Deploy / Produção

Este setup é para **desenvolvimento local**.

Para produção, você precisará:
- Servidor VPS ou Cloud
- Domínio próprio
- SSL/HTTPS
- Variáveis de ambiente de produção
- Backup automático

(Em desenvolvimento)

---

**Divirta-se analisando seus dados de tráfego pago!** 📊
