import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepo: Repository<Person>,
  ) {}

  async create(dto: CreatePersonDto): Promise<Person> {
    const existing = await this.personRepo.findOne({ where: [{ cpf: dto.cpf }, { email: dto.email }] });
    if (existing) throw new ConflictException('CPF ou email já cadastrado.');

    const person = this.personRepo.create(dto);
    return this.personRepo.save(person);
  }

  findAll(): Promise<Person[]> {
    return this.personRepo.find();
  }

  async findOne(id: number): Promise<Person> {
    const person = await this.personRepo.findOneBy({ id });
    if (!person) throw new NotFoundException('Pessoa não encontrada.');
    return person;
  }

  async update(id: number, dto: UpdatePersonDto): Promise<Person> {
    const person = await this.findOne(id);

    if (dto.cpf && dto.cpf !== person.cpf) {
      const cpfExists = await this.personRepo.findOneBy({ cpf: dto.cpf });
      if (cpfExists) throw new ConflictException('CPF já cadastrado.');
    }

    if (dto.email && dto.email !== person.email) {
      const emailExists = await this.personRepo.findOneBy({ email: dto.email });
      if (emailExists) throw new ConflictException('Email já cadastrado.');
    }

    Object.assign(person, dto);
    return this.personRepo.save(person);
  }

  async remove(id: number): Promise<void> {
    const person = await this.findOne(id);
    await this.personRepo.remove(person);
  }
}
