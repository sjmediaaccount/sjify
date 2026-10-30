# ==============================================================================
# SJify Windows Development Startup Script
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Starting SJify Infrastructure Services (Docker Compose) " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$dockerComposeFile = Join-Path $PSScriptRoot "..\docker\docker-compose.yml"

if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "[1/3] Docker found. Starting PostgreSQL, Redis, MinIO, MailHog..." -ForegroundColor Green
    docker compose -f $dockerComposeFile up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[2/3] Containers started successfully!" -ForegroundColor Green
    } else {
        Write-Host "[WARN] Docker compose reported an issue. Check Docker Desktop status." -ForegroundColor Yellow
    }
} else {
    Write-Host "[INFO] Docker command not in PATH. If using Docker Desktop, start it first." -ForegroundColor Yellow
    Write-Host "[INFO] Local development can use SQLite fallback for database." -ForegroundColor Yellow
}

Write-Host "[3/3] Ready! Run 'pnpm dev' from root to start Web + API." -ForegroundColor Green
