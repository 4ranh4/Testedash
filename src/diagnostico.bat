@echo off
REM Script de diagnóstico automático - Windows

title Diagnostico - Ads Dashboard

echo.
echo ========================================
echo   DIAGNOSTICO DO SISTEMA
echo ========================================
echo.

REM 1. Node.js
echo 1. Verificando Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    node --version
    echo [OK] Node.js instalado
) else (
    echo [ERRO] Node.js NAO instalado!
)
echo.

REM 2. npm
echo 2. Verificando npm...
npm --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    npm --version
    echo [OK] npm instalado
) else (
    echo [ERRO] npm NAO instalado!
)
echo.

REM 3. Docker
echo 3. Verificando Docker...
docker --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    docker --version
    echo [OK] Docker instalado
    
    docker info >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Docker esta rodando
    ) else (
        echo [ERRO] Docker NAO esta rodando!
    )
) else (
    echo [ERRO] Docker NAO instalado!
)
echo.

REM 4. node_modules
echo 4. Verificando dependencias...
if exist "node_modules\" (
    echo [OK] node_modules existe
) else (
    echo [ERRO] node_modules NAO existe!
    echo Execute: npm install
)
echo.

REM 5. .env
echo 5. Verificando arquivo .env...
if exist ".env" (
    echo [OK] .env existe
    echo Conteudo:
    type .env
) else (
    echo [ERRO] .env NAO existe!
    echo Criando .env...
    echo VITE_API_URL=http://localhost:4000/api > .env
    echo [OK] .env criado!
)
echo.

REM 6. Backend
echo 6. Verificando backend...
if exist "backend\" (
    echo [OK] Pasta backend existe
    
    cd backend
    docker-compose ps 2>nul | findstr "Up" >nul
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Backend esta rodando
        
        curl -s http://localhost:4000/api/health >nul 2>&1
        if %ERRORLEVEL% EQU 0 (
            echo [OK] Backend respondendo em http://localhost:4000
        ) else (
            echo [ERRO] Backend NAO esta respondendo!
        )
    ) else (
        echo [ERRO] Backend NAO esta rodando!
        echo Execute: cd backend ^&^& docker-compose up -d
    )
    cd ..
) else (
    echo [ERRO] Pasta backend NAO existe!
)
echo.

REM 7. Portas
echo 7. Verificando portas...

netstat -ano | findstr :5173 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Porta 5173 em uso ^(Frontend rodando^)
) else (
    echo [AVISO] Porta 5173 livre ^(Frontend NAO esta rodando^)
)

netstat -ano | findstr :4000 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Porta 4000 em uso ^(Backend rodando^)
) else (
    echo [AVISO] Porta 4000 livre ^(Backend NAO esta rodando^)
)

netstat -ano | findstr :5432 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Porta 5432 em uso ^(PostgreSQL rodando^)
) else (
    echo [AVISO] Porta 5432 livre ^(PostgreSQL NAO esta rodando^)
)
echo.

REM Resumo
echo.
echo ========================================
echo   RESUMO DO DIAGNOSTICO
echo ========================================
echo.
echo Verifique os erros acima e corrija:
echo.
echo - Node.js NAO instalado? Baixe: https://nodejs.org/
echo - Docker NAO instalado? Baixe: https://www.docker.com/products/docker-desktop/
echo - Docker NAO rodando? Abra o Docker Desktop
echo - node_modules faltando? Execute: npm install
echo - Backend NAO rodando? Execute: cd backend ^&^& docker-compose up -d
echo.
echo Para iniciar tudo: start-all.bat
echo Para ver solucoes: SOLUCAO-TELA-BRANCA.md
echo.
pause
