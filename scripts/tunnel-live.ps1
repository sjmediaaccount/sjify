# SJify Live Public Tunnel Launcher
# Exposes http://localhost:3000 to the world via Cloudflare Tunnel (100% Free HTTPS)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ScriptDir
$Cloudflared = Join-Path $RootDir "tools\cloudflared.exe"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "         SJify Web Platform — Live Tunnel Launcher        " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $Cloudflared)) {
    Write-Host "[!] cloudflared.exe not found at $Cloudflared. Downloading..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path (Join-Path $RootDir "tools") | Out-Null
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    (New-Object System.Net.WebClient).DownloadFile("https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe", $Cloudflared)
}

Write-Host "[+] Local Server: http://localhost:3000" -ForegroundColor Green
Write-Host "[+] Starting Cloudflare Tunnel..." -ForegroundColor Yellow
Write-Host "[i] Look for the *.trycloudflare.com HTTPS link below:" -ForegroundColor Cyan
Write-Host "----------------------------------------------------------" -ForegroundColor DarkGray

& $Cloudflared tunnel --url http://localhost:3000
