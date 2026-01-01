# InternVault Quick Setup Script
# Run this script to check your setup status

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "InternVault Setup Checker" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "OK Node.js installed: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "ERROR Node.js not found. Please install from https://nodejs.org" -ForegroundColor Red
}

Write-Host ""

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "OK npm installed: $npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "ERROR npm not found" -ForegroundColor Red
}

Write-Host ""

# Check MongoDB
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
    if ($mongoService) {
        if ($mongoService.Status -eq 'Running') {
            Write-Host "OK MongoDB service is running" -ForegroundColor Green
        }
        else {
            Write-Host "WARNING MongoDB installed but not running" -ForegroundColor Yellow
            Write-Host "  Run: net start MongoDB" -ForegroundColor Cyan
        }
    }
    else {
        Write-Host "ERROR MongoDB not installed" -ForegroundColor Red
        Write-Host "  Download from: https://www.mongodb.com/try/download/community" -ForegroundColor Cyan
        Write-Host "  OR use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas" -ForegroundColor Cyan
    }
}
catch {
    Write-Host "ERROR MongoDB not found" -ForegroundColor Red
}

Write-Host ""

# Check Frontend .env
Write-Host "Checking Frontend .env..." -ForegroundColor Yellow
$frontendEnv = "InternVault\.env"
if (Test-Path $frontendEnv) {
    Write-Host "OK Frontend .env exists" -ForegroundColor Green
    $content = Get-Content $frontendEnv -Raw
    if ($content -match "your_") {
        Write-Host "  WARNING Some API keys still have placeholder values" -ForegroundColor Yellow
    }
}
else {
    Write-Host "ERROR Frontend .env not found" -ForegroundColor Red
    Write-Host "  Copy InternVault\.env.template to InternVault\.env and fill in values" -ForegroundColor Cyan
}

Write-Host ""

# Check Backend .env
Write-Host "Checking Backend .env..." -ForegroundColor Yellow
$backendEnv = "backend\.env"
if (Test-Path $backendEnv) {
    Write-Host "OK Backend .env exists" -ForegroundColor Green
    $content = Get-Content $backendEnv -Raw
    if ($content -match "your_") {
        Write-Host "  WARNING Some values still have placeholder text" -ForegroundColor Yellow
    }
}
else {
    Write-Host "ERROR Backend .env not found" -ForegroundColor Red
    Write-Host "  Copy backend\.env.template to backend\.env and fill in values" -ForegroundColor Cyan
}

Write-Host ""

# Check if servers are running
Write-Host "Checking running servers..." -ForegroundColor Yellow
$frontendPort = netstat -ano | Select-String ":5173"
$backendPort = netstat -ano | Select-String ":5000"

if ($frontendPort) {
    Write-Host "OK Frontend server running on port 5173" -ForegroundColor Green
}
else {
    Write-Host "INFO Frontend not running" -ForegroundColor Yellow
}

if ($backendPort) {
    Write-Host "OK Backend server running on port 5000" -ForegroundColor Green
}
else {
    Write-Host "INFO Backend not running" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "1. Install MongoDB if not installed" -ForegroundColor White
Write-Host "2. Copy .env.template files to .env and fill in API keys" -ForegroundColor White
Write-Host "3. Start MongoDB: net start MongoDB" -ForegroundColor White
Write-Host "4. Start backend: cd backend && npm run dev" -ForegroundColor White
Write-Host "5. Start frontend: cd InternVault && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "See SETUP_GUIDE.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""
