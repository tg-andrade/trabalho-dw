# Como Testar a Conexão com MySQL

## Método 1: Script de Teste Automático (Recomendado)

Execute no terminal, na pasta `backend`:

```bash
node test-connection.js
```

Este script vai:
- ✅ Testar a conexão básica
- ✅ Verificar se o banco existe
- ✅ Verificar se as tabelas existem
- ✅ Contar os registros nas tabelas

## Método 2: Teste Simples

Execute:

```bash
node test-simple.js
```

Este script apenas testa se consegue conectar ao MySQL.

## Método 3: Via API (se o servidor estiver rodando)

1. Inicie o servidor:
   ```bash
   npm run dev
   ```

2. Teste no navegador ou Postman:
   - Abra: `http://localhost:4000/api/genres`
   - Se retornar dados (mesmo que vazio `[]`), está funcionando!
   - Se retornar erro, verifique o console do servidor

3. Ou use curl/PowerShell:
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:4000/api/genres"
   ```

## Método 4: Verificar no Console do Servidor

Quando você inicia o servidor com `npm run dev`, você deve ver:

**✅ Se estiver funcionando:**
```
✅ Conectado ao MySQL com sucesso!
Servidor executando em http://localhost:4000
```

**❌ Se houver erro:**
```
❌ Erro ao conectar ao MySQL: [mensagem do erro]
💡 Certifique-se de que o MySQL está rodando e o banco de dados foi criado.
```

## Método 5: Teste Direto no MySQL

Abra o MySQL Workbench ou linha de comando:

```sql
USE metflix_db;
SHOW TABLES;
SELECT * FROM genres;
SELECT * FROM movies;
```

Se conseguir executar essas queries, o banco está OK!

## Solução de Problemas

### Erro: "Access denied for user"
- Verifique a senha no arquivo `.env`
- Teste a senha no MySQL Workbench

### Erro: "Unknown database 'metflix_db'"
- Execute o script `database/schema.sql` no MySQL

### Erro: "Can't connect to MySQL server"
- Verifique se o MySQL está rodando
- No Windows: Abra "Serviços" e verifique se o MySQL está "Em execução"
- Tente iniciar: `net start MySQL` (como administrador)

### Erro: "Table doesn't exist"
- Execute o script `database/schema.sql` para criar as tabelas

