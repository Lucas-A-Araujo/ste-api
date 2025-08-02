import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from '../person/entities/person.entity';
import { fakePersonsData } from './data/fake-persons-final.data';

@Injectable()
export class SeedCommand {
  constructor(
    @InjectRepository(Person)
    private personRepo: Repository<Person>,
  ) {}

  async run(): Promise<void> {
    console.log('🌱 Iniciando seed do banco de dados...');

    try {
      const existingCount = await this.personRepo.count();
      if (existingCount > 0) {
        console.log(`🗑️  Removendo ${existingCount} registros existentes...`);
        await this.personRepo.clear();
      }

      console.log(`📝 Inserindo ${fakePersonsData.length} registros...`);
      const createdPersons = await this.personRepo.save(fakePersonsData);

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