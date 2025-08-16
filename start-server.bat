@echo off
echo Starting Tic Tac Toe Game Server...
echo.
echo Your game will be available at: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000
pause
