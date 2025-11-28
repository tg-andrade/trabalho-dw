const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
};

async function initDatabase() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao MySQL...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado ao MySQL!');

    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('🔄 Executando script SQL...');
    await connection.query(sql);
    console.log('✅ Banco de dados criado com sucesso!');
    console.log('✅ Tabelas criadas!');
    console.log('✅ Dados iniciais inseridos!');

    await connection.end();
    console.log('\n🎉 Inicialização concluída! Agora você pode iniciar o servidor com: npm run dev');
    
  } catch (error) {
    console.error('❌ Erro ao inicializar o banco de dados:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Certifique-se de que o MySQL está rodando.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Verifique as credenciais no arquivo .env');
    } else if (error.code === 'ENOENT') {
      console.error('\n💡 Arquivo schema.sql não encontrado.');
    }
    
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

initDatabase();

