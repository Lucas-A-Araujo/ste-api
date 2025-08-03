import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from '../person/entities/person.entity';
import { PersonService } from '../person/person.service';
import { CreatePersonDto } from '../person/dto/create-person.dto';
import { fakePersonsData } from './data/fake-persons-final.data';
import { User } from '../auth/entities/user.entity';
import { createUsers } from './create-users.seed';

@Injectable()
export class SeedCommand {
  constructor(
    @InjectRepository(Person)
    private personRepo: Repository<Person>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private personService: PersonService,
  ) {}

  async run(): Promise<void> {
    console.log('🌱 Iniciando seed do banco de dados...');

    try {
      // Criar usuários primeiro
      console.log('👤 Criando usuários...');
      await createUsers(this.personRepo.manager.connection);

      const existingCount = await this.personRepo.count();
      if (existingCount > 0) {
        console.log(`🗑️  Removendo ${existingCount} registros existentes...`);
        await this.personRepo.clear();
      }

      console.log(`📝 Inserindo ${fakePersonsData.length} registros...`);
      
      const createdPersons: Person[] = [];
      for (const personData of fakePersonsData) {
        const createDto: CreatePersonDto = {
          ...personData,
          birthDate: personData.birthDate.toISOString().split('T')[0], // Converte Date para string
        };
        const createdPerson = await this.personService.create(createDto);
        createdPersons.push(createdPerson);
      }

      console.log(`✅ Seed concluído com sucesso!`);
      console.log(`📊 Total de pessoas criadas: ${createdPersons.length}`);
      
      console.log('\n📋 Exemplos de pessoas criadas:');
      createdPersons.slice(0, 5).forEach((person, index) => {
        console.log(`${index + 1}. ${person.name} - ${person.email} - ${person.cpf}`);
      });

      const cities = [...new Set(createdPersons.map(p => p.naturalness))];
      console.log(`\n🗺️  Pessoas distribuídas em ${cities.length} cidades:`);
      cities.forEach(city => {
        const count = createdPersons.filter(p => p.naturalness === city).length;
        console.log(`   • ${city}: ${count} pessoa(s)`);
      });

    } catch (error) {
      console.error('❌ Erro durante o seed:', error.message);
      throw error;
    }
  }
} 