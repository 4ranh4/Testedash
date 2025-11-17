@echo off
REM Script de inicialização completa - Frontend + Backend
REM Para Windows

echo.
echo ========================================
echo   Ads Dashboard - Inicialização
echo ========================================
echo.

REM Verificar se Docker está instalado
docker --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Docker nao esta instalado!
    echo Instale o Docker Desktop: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo [OK] Docker detectado!
echo.

REM Verificar se Docker está rodando
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Docker nao esta rodando!
    echo Inicie o Docker Desktop e execute este script novamente.
    pause
    exit /b 1
)

echo [OK] Docker esta rodando!
echo.

REM Iniciar Backend
echo ========================================
echo   Iniciando Backend (Docker)...
echo ========================================
echo.

cd backend

REM Parar containers anteriores se existirem
docker-compose down >nul 2>&1

REM Iniciar containers
docker-compose up -d

if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao iniciar o backend!
    pause
    exit /b 1
)

echo [OK] Backend iniciado!
echo.

REM Aguardar backend estar pronto
echo Aguardando backend inicializar...
timeout /t 10 /nobreak >nul

REM Tentar conectar ao backend
set MAX_ATTEMPTS=30
set ATTEMPT=0

:CHECK_BACKEND
set /a ATTEMPT=%ATTEMPT%+1
if %ATTEMPT% GTR %MAX_ATTEMPTS% (
    echo [ERRO] Backend nao respondeu em 30 segundos!
    echo Execute: cd backend ^&^& docker-compose logs -f
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
echo [OK] Backend esta online!
echo.

cd ..

REM Resumo
echo.
echo ========================================
echo   SISTEMA INICIADO COM SUCESSO!
echo ========================================
echo.
echo Frontend:     http://localhost:5173
echo Backend API:  http://localhost:4000/api
echo PostgreSQL:   localhost:5432
echo pgAdmin:      http://localhost:5050
echo.
echo O frontend deve estar rodando automaticamente.
echo Se nao estiver, execute: npm run dev
echo.
echo Para parar tudo: stop.bat
echo.
echo Acesse http://localhost:5173 e crie sua conta!
echo.
pause
