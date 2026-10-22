$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

Write-Host "== Backend tests =="
Push-Location (Join-Path $root "backend")
go test ./... -coverprofile=coverage.out
go tool cover -func=coverage.out
Pop-Location

Write-Host "`n== Frontend tests =="
Push-Location (Join-Path $root "frontend")
if (-not (Test-Path "node_modules")) { npm ci }
npm run test:coverage
Pop-Location
