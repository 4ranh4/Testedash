@echo off
REM Script para parar todos os serviços
REM Para Windows

echo.
echo ========================================
echo   Parando Ads Dashboard
echo ========================================
echo.

cd backend
docker-compose down

echo.
echo [OK] Backend parado!
echo.
echo O Frontend (npm run dev) precisa ser parado manualmente com CTRL+C
echo.
echo ========================================
echo   Servicos parados com sucesso!
echo ========================================
echo.
pause
