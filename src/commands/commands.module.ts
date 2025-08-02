import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from '../person/entities/person.entity';
import { SeedCommand } from './seed.command';

@Module({
  imports: [TypeOrmModule.forFeature([Person])],
  providers: [SeedCommand],
})
export class CommandsModule {} 