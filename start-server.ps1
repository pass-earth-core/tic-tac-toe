Write-Host "Starting Tic Tac Toe Game Server..." -ForegroundColor Green
Write-Host ""
Write-Host "Your game will be available at: http://localhost:8000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

try {
    python -m http.server 8000
} catch {
    Write-Host "Python not found. Trying alternative method..." -ForegroundColor Yellow
    try {
        python3 -m http.server 8000
    } catch {
        Write-Host "Python not available. Please install Python or use the alternative method below." -ForegroundColor Red
        Write-Host ""
        Write-Host "Alternative: Open index.html in your browser directly" -ForegroundColor Yellow
        Read-Host "Press Enter to continue"
    }
}
