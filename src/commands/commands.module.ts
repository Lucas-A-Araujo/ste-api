import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from '../person/entities/person.entity';
import { PersonModule } from '../person/person.module';
import { SeedCommand } from './seed.command';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Person, User]),
    PersonModule,
  ],
  providers: [SeedCommand],
})
export class CommandsModule {} 