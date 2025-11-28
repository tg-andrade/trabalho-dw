# Instruções de Setup - MySQL

## Passo 1: Criar o Banco de Dados

Você precisa executar o script SQL para criar o banco de dados. Escolha uma das opções:

### Opção A: Via linha de comando (se MySQL estiver no PATH)
```bash
cd backend
mysql -u root -p1234 < database/schema.sql
```

### Opção B: Via MySQL Workbench
1. Abra o MySQL Workbench
2. Conecte-se ao servidor MySQL (usuário: root, senha: 1234)
3. Abra o arquivo `backend/database/schema.sql`
4. Execute o script (Ctrl+Shift+Enter ou botão Execute)

### Opção C: Via linha de comando do MySQL
1. Abra o prompt de comando ou PowerShell
2. Navegue até a pasta do projeto
3. Execute:
```bash
mysql -u root -p1234
```
4. Dentro do MySQL, execute:
```sql
source backend/database/schema.sql
```

## Passo 2: Verificar arquivo .env

O arquivo `.env` já foi criado na pasta `backend` com as seguintes configurações:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=metflix_db
PORT=4000
```

Se precisar alterar a senha ou outras configurações, edite este arquivo.

## Passo 3: Iniciar o servidor

```bash
cd backend
npm run dev
```

O servidor deve iniciar em `http://localhost:4000` e você verá a mensagem:
- ✅ Conectado ao MySQL com sucesso! (se tudo estiver OK)
- ❌ Erro ao conectar ao MySQL (se houver problema)

## Solução de Problemas

### Erro: "Access denied for user"
- Verifique se a senha no arquivo `.env` está correta
- Verifique se o usuário `root` tem permissões

### Erro: "Unknown database 'metflix_db'"
- Execute o script SQL (`database/schema.sql`) primeiro

### Erro: "Can't connect to MySQL server"
- Verifique se o MySQL está rodando
- No Windows: Verifique no "Serviços" se o MySQL está iniciado
- Tente iniciar manualmente: `net start MySQL` (como administrador)

