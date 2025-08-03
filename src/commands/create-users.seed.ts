import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../auth/entities/user.entity';

export async function createUsers(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  // Verificar se já existem usuários
  const existingUsers = await userRepository.find();
  if (existingUsers.length > 0) {
    console.log('Usuários já existem, pulando criação...');
    return;
  }

  const users = [
    {
      name: 'Administrador',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      isActive: true,
    },
    {
      name: 'Usuário Teste',
      email: 'user@example.com',
      password: await bcrypt.hash('user123', 10),
      isActive: true,
    },
  ];

  for (const userData of users) {
    const user = userRepository.create(userData);
    await userRepository.save(user);
    console.log(`Usuário criado: ${user.email}`);
  }

  console.log('Seed de usuários concluído!');
} 