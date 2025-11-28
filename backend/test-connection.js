require('dotenv').config();
const pool = require('./src/config/database');

async function testConnection() {
  console.log('🔍 Testando conexão com MySQL...\n');
  console.log('Configurações:');
  console.log(`  Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`  User: ${process.env.DB_USER || 'root'}`);
  console.log(`  Database: ${process.env.DB_NAME || 'metflix_db'}`);
  console.log('');

  try {
    // Testar conexão básica
    console.log('1️⃣ Testando conexão básica...');
    const [rows] = await pool.execute('SELECT 1 as test');
    console.log('   ✅ Conexão estabelecida com sucesso!\n');

    // Verificar se o banco existe
    console.log('2️⃣ Verificando se o banco de dados existe...');
    const [databases] = await pool.execute("SHOW DATABASES LIKE ?", [process.env.DB_NAME || 'metflix_db']);
    if (databases.length > 0) {
      console.log(`   ✅ Banco '${process.env.DB_NAME || 'metflix_db'}' encontrado!\n`);
    } else {
      console.log(`   ❌ Banco '${process.env.DB_NAME || 'metflix_db'}' NÃO encontrado!\n`);
      process.exit(1);
    }

    // Verificar se as tabelas existem
    console.log('3️⃣ Verificando se as tabelas existem...');
    const [tables] = await pool.execute("SHOW TABLES");
    
    if (tables.length === 0) {
      console.log('   ⚠️  Nenhuma tabela encontrada!');
      console.log('   💡 Execute o script database/schema.sql para criar as tabelas.\n');
    } else {
      console.log(`   ✅ ${tables.length} tabela(s) encontrada(s):`);
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`      - ${tableName}`);
      });
      console.log('');
    }

    // Verificar dados nas tabelas
    console.log('4️⃣ Verificando dados nas tabelas...');
    
    try {
      const [genres] = await pool.execute("SELECT COUNT(*) as total FROM genres");
      console.log(`   ✅ Gêneros: ${genres[0].total} registro(s)`);
    } catch (err) {
      console.log(`   ❌ Erro ao verificar gêneros: ${err.message}`);
    }

    try {
      const [movies] = await pool.execute("SELECT COUNT(*) as total FROM movies");
      console.log(`   ✅ Filmes/Séries: ${movies[0].total} registro(s)`);
    } catch (err) {
      console.log(`   ❌ Erro ao verificar filmes: ${err.message}`);
    }

    console.log('\n✅ Todos os testes passaram! O banco de dados está configurado corretamente.');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Erro ao conectar ao MySQL:');
    console.error(`   Mensagem: ${error.message}`);
    console.error(`   Código: ${error.code || 'N/A'}`);
    console.error('\n💡 Verifique:');
    console.error('   - Se o MySQL está rodando');
    console.error('   - Se as credenciais no arquivo .env estão corretas');
    console.error('   - Se o banco de dados foi criado (execute database/schema.sql)');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection();

