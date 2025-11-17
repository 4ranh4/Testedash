# 🔧 SOLUÇÃO - TELA BRANCA

## ❌ PROBLEMA
O navegador mostra uma tela em branco ao acessar http://localhost:5173

---

## ✅ SOLUÇÕES (Execute na ordem)

### 1️⃣ **Verificar se o backend está rodando**

```bash
# Verificar se está rodando
curl http://localhost:4000/api/health

# Se não estiver, iniciar
cd backend
docker-compose up -d
```

### 2️⃣ **Parar e reiniciar TUDO**

```bash
# Windows
stop-all.bat
start-all.bat

# Linux/Mac
./stop-all.sh
./start-all.sh
```

### 3️⃣ **Limpar cache do navegador**

1. Abra o DevTools (F12)
2. Vá em "Application" (Chrome) ou "Armazenamento" (Firefox)
3. Clique em "Clear storage" / "Limpar dados"
4. Marque tudo e clique em "Clear"
5. Recarregue a página (Ctrl+Shift+R)

### 4️⃣ **Ver erros no console**

1. Abra o navegador em http://localhost:5173
2. Pressione F12 para abrir DevTools
3. Vá na aba "Console"
4. Veja se há erros em vermelho
5. Copie e leia os erros

**Erros comuns:**

| Erro | Solução |
|------|---------|
| `Failed to fetch` | Backend não está rodando |
| `CORS error` | Backend não configurado corretamente |
| `Cannot find module` | Dependências não instaladas |
| `Unexpected token` | Erro de sintaxe no código |

### 5️⃣ **Reinstalar dependências**

```bash
# Parar tudo
./stop-all.sh  # ou stop-all.bat

# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install

# Reiniciar
./start-all.sh  # ou start-all.bat
```

### 6️⃣ **Verificar arquivo .env**

```bash
# Ver conteúdo
cat .env  # Linux/Mac
type .env # Windows

# Deve conter:
VITE_API_URL=http://localhost:4000/api
```

Se não tiver, crie:

```bash
# Linux/Mac
echo "VITE_API_URL=http://localhost:4000/api" > .env

# Windows
echo VITE_API_URL=http://localhost:4000/api > .env
```

### 7️⃣ **Verificar portas**

```bash
# Verificar se porta 5173 está livre
# Windows
netstat -ano | findstr :5173

# Linux/Mac
lsof -i :5173

# Se estiver ocupada, mate o processo
# Windows
taskkill /PID [NUMERO] /F

# Linux/Mac
kill -9 [PID]
```

### 8️⃣ **Reiniciar apenas frontend**

```bash
# Parar (Ctrl+C no terminal do frontend)

# Iniciar novamente
npm run dev
```

### 9️⃣ **Modo de depuração**

```bash
# Iniciar com logs detalhados
npm run dev -- --debug
```

### 🔟 **Última opção: Resetar tudo**

```bash
# 1. Parar tudo
./stop-all.sh  # ou stop-all.bat

# 2. Limpar Docker
cd backend
docker-compose down -v
cd ..

# 3. Limpar npm
rm -rf node_modules package-lock.json

# 4. Reinstalar
npm install

# 5. Recriar .env
echo "VITE_API_URL=http://localhost:4000/api" > .env

# 6. Iniciar tudo
./start-all.sh  # ou start-all.bat
```

---

## 🔍 DIAGNÓSTICO

### Verificar o que está rodando:

```bash
# Ver processos Node
# Windows
tasklist | findstr node

# Linux/Mac
ps aux | grep node

# Ver containers Docker
cd backend
docker-compose ps
```

### Teste manual:

```bash
# 1. Testar backend
curl http://localhost:4000/api/health

# Resposta esperada:
# {"status":"ok","timestamp":"..."}

# 2. Testar frontend
# Abra http://localhost:5173 no navegador
# Deve mostrar a tela de login
```

---

## 📊 ERROS ESPECÍFICOS

### Erro: "Cannot GET /"

**Causa:** Frontend não iniciou corretamente

**Solução:**
```bash
npm run dev
```

### Erro: "Failed to fetch"

**Causa:** Backend não está acessível

**Solução:**
```bash
cd backend
docker-compose up -d
# Aguardar 15 segundos
curl http://localhost:4000/api/health
```

### Erro: "CORS policy"

**Causa:** Backend não permite requisições do frontend

**Solução:** Verificar backend/.env:
```env
FRONTEND_URL=http://localhost:5173
```

### Erro: "Module not found"

**Causa:** Dependências não instaladas

**Solução:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Tela completamente branca (sem erros)

**Causa:** Problemas com cache ou JavaScript desabilitado

**Solução:**
1. Limpar cache do navegador
2. Desabilitar extensões (modo anônimo)
3. Tentar outro navegador
4. Verificar se JavaScript está habilitado

---

## 🚀 INICIALIZAÇÃO CORRETA

### Ordem de inicialização:

1. **Backend primeiro** (demora ~15 segundos)
   ```bash
   cd backend
   docker-compose up -d
   ```

2. **Aguardar** backend ficar pronto
   ```bash
   curl http://localhost:4000/api/health
   ```

3. **Frontend depois**
   ```bash
   npm run dev
   ```

4. **Acessar** http://localhost:5173

### Usando os scripts (recomendado):

```bash
# Windows
start-all.bat

# Linux/Mac
./start-all.sh
```

Os scripts fazem tudo automaticamente na ordem certa!

---

## 🆘 AINDA COM PROBLEMA?

### Coletar informações:

```bash
# 1. Ver logs do backend
cd backend
docker-compose logs -f

# 2. Ver logs do frontend
# (No terminal onde rodou npm run dev)

# 3. Ver console do navegador
# F12 → Console → Copiar erros
```

### Informações úteis para debug:

- Sistema operacional: Windows/Linux/Mac
- Versão do Node: `node --version`
- Versão do npm: `npm --version`
- Versão do Docker: `docker --version`
- Navegador: Chrome/Firefox/Safari
- Erros no console: (copiar e colar)
- Logs do backend: (copiar e colar)

---

## ✅ CHECKLIST DE FUNCIONAMENTO

Verifique se tudo está OK:

- [ ] Docker Desktop está rodando
- [ ] Backend está rodando (`docker-compose ps`)
- [ ] Backend responde (`curl http://localhost:4000/api/health`)
- [ ] Frontend está rodando (`npm run dev`)
- [ ] Porta 5173 está acessível
- [ ] Arquivo .env existe e está correto
- [ ] node_modules existe
- [ ] Navegador não tem erros no console
- [ ] JavaScript está habilitado
- [ ] Cache do navegador foi limpo

Se todos estiverem ✅, deveria funcionar!

---

## 🎯 TESTE RÁPIDO

Execute isso para testar tudo:

```bash
# Backend
curl http://localhost:4000/api/health
# Deve retornar: {"status":"ok",...}

# Frontend
curl http://localhost:5173
# Deve retornar: HTML da página
```

Se ambos funcionarem, o problema é no navegador (cache).

---

**Se nada funcionar, execute:**

```bash
# Windows
stop-all.bat
rd /s /q node_modules
del package-lock.json
npm install
start-all.bat

# Linux/Mac
./stop-all.sh
rm -rf node_modules package-lock.json
npm install
./start-all.sh
```

Isso resolve 99% dos problemas! 🎉
