# Script para executar o schema SQL no MySQL
Write-Host "Configurando banco de dados MySQL..." -ForegroundColor Cyan
Write-Host ""

# Tentar encontrar o MySQL em locais comuns
$mysqlPaths = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe",
    "C:\xampp\mysql\bin\mysql.exe",
    "C:\wamp64\bin\mysql\mysql8.0.27\bin\mysql.exe",
    "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe"
)

$mysqlExe = $null
foreach ($path in $mysqlPaths) {
    if (Test-Path $path) {
        $mysqlExe = $path
        Write-Host "MySQL encontrado em: $path" -ForegroundColor Green
        break
    }
}

# Se não encontrou, tentar usar o comando mysql diretamente (se estiver no PATH)
if (-not $mysqlExe) {
    try {
        $mysqlExe = (Get-Command mysql -ErrorAction Stop).Source
        Write-Host "MySQL encontrado no PATH: $mysqlExe" -ForegroundColor Green
    } catch {
        Write-Host "❌ MySQL não encontrado!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Por favor, execute uma das opções abaixo:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "1. Adicione o MySQL ao PATH do sistema" -ForegroundColor Yellow
        Write-Host "2. Use o MySQL Workbench para executar o arquivo database/schema.sql" -ForegroundColor Yellow
        Write-Host "3. Execute manualmente no prompt do MySQL:" -ForegroundColor Yellow
        Write-Host "   mysql -u root -p1234" -ForegroundColor Cyan
        Write-Host "   source $(Resolve-Path database/schema.sql)" -ForegroundColor Cyan
        exit 1
    }
}

# Ler o arquivo SQL
$sqlFile = Join-Path $PSScriptRoot "database\schema.sql"
if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ Arquivo schema.sql não encontrado em: $sqlFile" -ForegroundColor Red
    exit 1
}

Write-Host "Executando script SQL..." -ForegroundColor Cyan
Write-Host ""

# Executar o script
$sqlContent = Get-Content $sqlFile -Raw -Encoding UTF8
$result = $sqlContent | & $mysqlExe -u root -p1234 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Banco de dados criado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Verificando conexão..." -ForegroundColor Cyan
    # Testar se o banco foi criado
    $testResult = "SHOW DATABASES LIKE 'metflix_db';" | & $mysqlExe -u root -p1234 -s -N 2>&1
    if ($testResult -match "metflix_db") {
        Write-Host "✅ Banco 'metflix_db' confirmado!" -ForegroundColor Green
    }
} else {
    Write-Host ""
    Write-Host "❌ Erro ao executar o script SQL." -ForegroundColor Red
    if ($result) {
        Write-Host "Detalhes do erro:" -ForegroundColor Yellow
        Write-Host $result -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Verifique se:" -ForegroundColor Yellow
    Write-Host "  - O MySQL está rodando" -ForegroundColor Yellow
    Write-Host "  - A senha está correta (atualmente: 1234)" -ForegroundColor Yellow
    Write-Host "  - O usuário root tem permissões" -ForegroundColor Yellow
}

