# Configuração do Banco de Dados MySQL

## Instruções de Instalação

1. **Certifique-se de que o MySQL está instalado e rodando**

2. **Execute o script SQL para criar o banco de dados:**
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   
   Ou abra o MySQL Workbench / cliente MySQL e execute o conteúdo do arquivo `schema.sql`

3. **Configure as variáveis de ambiente:**
   
   Crie um arquivo `.env` na pasta `backend` com o seguinte conteúdo:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=sua_senha_aqui
   DB_NAME=metflix_db
   PORT=4000
   ```

4. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

## Estrutura do Banco de Dados

### Tabela `genres`
- `id`: INT (Primary Key, Auto Increment)
- `name`: VARCHAR(100) (Unique, Not Null)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### Tabela `movies`
- `id`: INT (Primary Key, Auto Increment)
- `title`: VARCHAR(255) (Not Null)
- `genre_id`: INT (Foreign Key -> genres.id)
- `year`: INT (Not Null)
- `type`: ENUM('Filme', 'Série') (Not Null)
- `description`: TEXT
- `cover_image`: VARCHAR(500)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

