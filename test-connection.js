const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    connectionString: 'postgresql://postgres:X6zAVKxy4IJVP6I1@db.hofjmpihidcrwabeeceb.supabase.co:5432/postgres',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Tentando conectar ao Supabase...');
    await client.connect();
    console.log('✅ Conexão bem-sucedida!');
    
    const result = await client.query('SELECT version()');
    console.log('📊 Versão do PostgreSQL:', result.rows[0].version);
    
    await client.end();
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
  }
}

testConnection(); 