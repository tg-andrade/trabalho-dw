require('dotenv').config();
const mysql = require('mysql2/promise');

async function test() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'metflix_db'
    });

    console.log('✅ CONECTADO COM SUCESSO!');
    
    const [rows] = await connection.execute('SELECT 1');
    console.log('✅ Query de teste executada!');
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ ERRO:', error.message);
    console.error('Código:', error.code);
    process.exit(1);
  }
}

test();

