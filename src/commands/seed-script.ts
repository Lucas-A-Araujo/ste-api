import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedCommand } from './seed.command';

async function bootstrap() {
  try {
    console.log('🚀 Iniciando seed do banco de dados...');
    console.log('📡 Conectando ao banco:', process.env.DATABASE_HOST);
    
    const app = await NestFactory.createApplicationContext(AppModule);
    
    const seedCommand = app.get(SeedCommand);
    
    await seedCommand.run();
    
    console.log('✅ Seed concluído com sucesso!');
    
    await app.close();
    
  } catch (error) {
    console.error('❌ Erro durante o seed:', error.message);
    console.log('\n💡 Dicas para resolver:');
    console.log('   1. Verifique se o banco Supabase está acessível');
    console.log('   2. Verifique se as variáveis de ambiente estão corretas');
    console.log('   3. Tente: npm run start:dev (para verificar se o banco funciona)');
    process.exit(1);
  }
}

bootstrap(); 