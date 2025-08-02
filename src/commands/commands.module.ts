import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from '../person/entities/person.entity';
import { PersonModule } from '../person/person.module';
import { SeedCommand } from './seed.command';

@Module({
  imports: [
    TypeOrmModule.forFeature([Person]),
    PersonModule,
  ],
  providers: [SeedCommand],
})
export class CommandsModule {} 