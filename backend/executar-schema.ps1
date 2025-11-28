Write-Host "Executando schema.sql..." -ForegroundColor Cyan

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$sqlFile = Join-Path $PSScriptRoot "database\schema.sql"

if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ Arquivo schema.sql não encontrado!" -ForegroundColor Red
    exit 1
}

# Ler e executar o SQL
$sql = Get-Content $sqlFile -Raw

# Executar
$result = $sql | & $mysqlPath -u root -p1234 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Schema executado com sucesso!" -ForegroundColor Green
    
    # Verificar tabelas
    Write-Host "`nVerificando tabelas..." -ForegroundColor Cyan
    $tables = "SHOW TABLES;" | & $mysqlPath -u root -p1234 metflix_db 2>&1 | Where-Object { $_ -notmatch "Warning" -and $_ -notmatch "Tables_in" -and $_.Trim() -ne "" }
    
    if ($tables) {
        Write-Host "✅ Tabelas encontradas:" -ForegroundColor Green
        $tables | ForEach-Object { Write-Host "   - $_" }
    } else {
        Write-Host "⚠️  Nenhuma tabela encontrada" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Erro ao executar schema" -ForegroundColor Red
    Write-Host $result
}

