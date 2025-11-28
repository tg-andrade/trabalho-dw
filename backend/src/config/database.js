const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'metflix_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Testar conexão (não bloqueia a inicialização)
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado ao MySQL com sucesso!');
    connection.release();
  } catch (error) {
    console.error('❌ Erro ao conectar ao MySQL:', error.message);
    console.error('💡 Certifique-se de que o MySQL está rodando e o banco de dados foi criado.');
  }
})();

module.exports = pool;

