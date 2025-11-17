# 🚨 TELA EM BRANCO - SOLUÇÃO RÁPIDA

## ⚡ SOLUÇÃO IMEDIATA (3 comandos)

### Windows:
```bash
# 1. Execute o diagnóstico
diagnostico.bat

# 2. Se tudo OK, reinicie
stop-all.bat
start-all.bat

# 3. Acesse
http://localhost:5173
```

### Linux/Mac:
```bash
# 1. Execute o diagnóstico
chmod +x diagnostico.sh
./diagnostico.sh

# 2. Se tudo OK, reinicie
./stop-all.sh
./start-all.sh

# 3. Acesse
http://localhost:5173
```

---

## 🔥 RESETAR TUDO (se ainda não funcionar)

### Windows:
```bash
# Parar tudo
stop-all.bat

# Limpar completamente
rd /s /q node_modules
del package-lock.json

# Reinstalar
npm install

# Recriar .env
echo VITE_API_URL=http://localhost:4000/api > .env

# Reiniciar
start-all.bat
```

### Linux/Mac:
```bash
# Parar tudo
./stop-all.sh

# Limpar completamente
rm -rf node_modules package-lock.json

# Reinstalar
npm install

# Recriar .env
echo "VITE_API_URL=http://localhost:4000/api" > .env

# Reiniciar
./start-all.sh
```

---

## 🔍 VERIFICAÇÃO RÁPIDA

Execute estes comandos para ver o que está errado:

### 1. Backend está rodando?
```bash
curl http://localhost:4000/api/health
```

**Resposta esperada:**
```json
{"status":"ok","timestamp":"..."}
```

**Se der erro:**
```bash
cd backend
docker-compose up -d
```

### 2. Frontend está rodando?
```bash
curl http://localhost:5173
```

**Resposta esperada:** HTML da página

**Se der erro:**
```bash
npm run dev
```

### 3. Arquivo .env existe?
```bash
# Windows
type .env

# Linux/Mac
cat .env
```

**Deve conter:**
```
VITE_API_URL=http://localhost:4000/api
```

**Se não existir:**
```bash
# Windows
echo VITE_API_URL=http://localhost:4000/api > .env

# Linux/Mac
echo "VITE_API_URL=http://localhost:4000/api" > .env
```

---

## 🌐 VERIFICAR NO NAVEGADOR

1. **Abra:** http://localhost:5173
2. **Pressione:** F12 (abre DevTools)
3. **Vá na aba:** Console
4. **Veja os erros** (se houver)

### Erros comuns:

| Erro | Solução |
|------|---------|
| `Failed to fetch` | Backend não está rodando → `cd backend && docker-compose up -d` |
| `Cannot find module` | Reinstale dependências → `npm install` |
| `CORS error` | Limpe cache e recarregue (Ctrl+Shift+R) |
| Nada aparece | Limpe cache do navegador |

---

## 🧹 LIMPAR CACHE DO NAVEGADOR

### Chrome:
1. F12 → Application → Clear Storage
2. Marque tudo
3. Clique "Clear site data"
4. Ctrl+Shift+R (recarrega sem cache)

### Firefox:
1. F12 → Armazenamento → Limpar tudo
2. Ctrl+Shift+R (recarrega sem cache)

---

## ✅ CHECKLIST RÁPIDO

Marque o que está funcionando:

- [ ] Docker Desktop está aberto e rodando
- [ ] Backend respondendo: `curl http://localhost:4000/api/health`
- [ ] Arquivo .env existe: `cat .env` ou `type .env`
- [ ] node_modules existe: `ls node_modules` ou `dir node_modules`
- [ ] Frontend rodando: `npm run dev` sem erros
- [ ] Navegador sem erros no console (F12)
- [ ] Cache do navegador limpo

**Se todos estiverem ✅, deveria funcionar!**

---

## 🆘 ÚLTIMA TENTATIVA

Se NADA funcionar, execute isto:

```bash
# 1. PARAR TUDO
# Windows: stop-all.bat
# Linux/Mac: ./stop-all.sh

# 2. LIMPAR DOCKER
cd backend
docker-compose down -v
cd ..

# 3. LIMPAR NPM
rm -rf node_modules package-lock.json  # Linux/Mac
rd /s /q node_modules & del package-lock.json  # Windows

# 4. RECRIAR .ENV
echo "VITE_API_URL=http://localhost:4000/api" > .env  # Linux/Mac
echo VITE_API_URL=http://localhost:4000/api > .env    # Windows

# 5. REINSTALAR TUDO
npm install

# 6. INICIAR TUDO
# Windows: start-all.bat
# Linux/Mac: ./start-all.sh

# 7. AGUARDAR 30 SEGUNDOS

# 8. ABRIR NO NAVEGADOR (modo anônimo)
http://localhost:5173
```

**Isso resolve 99,9% dos casos!**

---

## 📞 AINDA COM PROBLEMA?

Execute o diagnóstico e envie o resultado:

```bash
# Windows
diagnostico.bat > diagnostico.txt

# Linux/Mac
./diagnostico.sh > diagnostico.txt
```

Depois abra `diagnostico.txt` e veja o que está errado.

---

## 🎯 TESTE FINAL

Se tudo estiver OK, este teste deve funcionar:

```bash
# 1. Backend
curl http://localhost:4000/api/health
# Deve retornar: {"status":"ok",...}

# 2. Frontend
curl http://localhost:5173
# Deve retornar: <!DOCTYPE html>...

# 3. Navegador
# Abra http://localhost:5173
# Deve mostrar tela de login
```

---

## 💡 DICA IMPORTANTE

**SEMPRE use os scripts:**
- `start-all.bat` ou `./start-all.sh` para iniciar
- `stop-all.bat` ou `./stop-all.sh` para parar

Eles garantem que tudo inicia na ordem certa!

---

**Resolveu? Ótimo! 🎉**

**Ainda com problema? Veja:** [SOLUCAO-TELA-BRANCA.md](./SOLUCAO-TELA-BRANCA.md)
