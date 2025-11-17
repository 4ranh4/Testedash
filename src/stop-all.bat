@echo off
REM Script para parar TUDO (Frontend + Backend)
REM Para Windows

title Parando Ads Dashboard

echo.
echo ========================================
echo   PARANDO ADS DASHBOARD COMPLETO
echo ========================================
echo.

REM Parar processos do Node/npm
echo Parando Frontend...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.cmd >nul 2>&1

if exist "start-frontend.bat" (
    del start-frontend.bat
)

echo [OK] Frontend parado!
echo.

REM Parar Backend
echo Parando Backend...
cd backend
docker-compose down

if %ERRORLEVEL% EQU 0 (
    echo [OK] Backend parado!
) else (
    echo [ERRO] Falha ao parar backend
)

cd ..

echo.
echo ========================================
echo   TODOS OS SERVICOS FORAM PARADOS!
echo ========================================
echo.
pause
