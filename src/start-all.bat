@echo off
REM Script de inicialização COMPLETA - Frontend + Backend juntos
REM Para Windows

title Ads Dashboard - Inicializacao Completa

echo.
echo ========================================
echo   ADS DASHBOARD - INICIO COMPLETO
echo ========================================
echo.

REM Verificar Docker
docker --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Docker nao instalado!
    pause
    exit /b 1
)

docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Docker nao esta rodando!
    pause
    exit /b 1
)

echo [OK] Docker funcionando!

REM Verificar Node
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao instalado!
    pause
    exit /b 1
)

npm --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] npm nao instalado!
    pause
    exit /b 1
)

echo [OK] Node.js funcionando!
echo.

REM ===== BACKEND =====
echo ========================================
echo   INICIANDO BACKEND
echo ========================================
echo.

cd backend
docker-compose down >nul 2>&1
docker-compose up -d

if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao iniciar backend!
    pause
    exit /b 1
)

echo [OK] Backend iniciado!
cd ..

REM Aguardar backend
echo.
echo Aguardando backend ficar pronto...
timeout /t 10 /nobreak >nul

set MAX_ATTEMPTS=30
set ATTEMPT=0

:CHECK_BACKEND
set /a ATTEMPT=%ATTEMPT%+1
if %ATTEMPT% GTR %MAX_ATTEMPTS% (
    echo [ERRO] Backend nao respondeu!
    pause
    exit /b 1
)

curl -s http://localhost:4000/api/health >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo|set /p="."
    timeout /t 1 /nobreak >nul
    goto CHECK_BACKEND
)

echo.
echo [OK] Backend online!

REM Verificar node_modules
if not exist "node_modules\" (
    echo.
    echo Instalando dependencias do frontend...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERRO] Falha ao instalar dependencias!
        pause
        exit /b 1
    )
)

REM ===== FRONTEND =====
echo.
echo ========================================
echo   INICIANDO FRONTEND
echo ========================================
echo.

REM Criar arquivo temporário para comandos
echo cd /d "%CD%" > start-frontend.bat
echo npm run dev >> start-frontend.bat

REM Iniciar frontend em nova janela
start "Ads Dashboard - Frontend" cmd /k start-frontend.bat

echo [OK] Frontend iniciando...
timeout /t 3 /nobreak >nul

REM ===== RESUMO =====
echo.
echo ========================================
echo   TUDO RODANDO COM SUCESSO!
echo ========================================
echo.
echo Frontend:     http://localhost:5173
echo Backend API:  http://localhost:4000/api
echo PostgreSQL:   localhost:5432
echo pgAdmin:      http://localhost:5050
echo.
echo ========================================
echo   ACESSE: http://localhost:5173
echo ========================================
echo.
echo Para parar tudo: stop-all.bat
echo.
echo Pressione qualquer tecla para abrir o navegador...
pause >nul

REM Abrir navegador
start http://localhost:5173

echo.
echo Sistema rodando! Feche esta janela quando terminar.
echo.
pause
