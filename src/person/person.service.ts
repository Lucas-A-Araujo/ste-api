import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { ERROR_CODES } from '../common/constants/error-codes';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private personRepo: Repository<Person>,
  ) {}

  async create(dto: CreatePersonDto): Promise<Person> {
    const existingCpf = await this.personRepo.findOneBy({ cpf: dto.cpf });
    if (existingCpf) {
      throw new ConflictException({
        statusCode: 409,
        error: ERROR_CODES.PERSON_ALREADY_EXISTS,
        message: 'Pessoa já existe.',
        timestamp: new Date().toISOString(),
        path: '/v1/people',
      });
    }

    if (dto.email) {
      const existingEmail = await this.personRepo.findOneBy({ email: dto.email });
      if (existingEmail) {
        throw new ConflictException({
          statusCode: 409,
          error: ERROR_CODES.EMAIL_ALREADY_EXISTS,
          message: 'Pessoa já existe com este email.',
          timestamp: new Date().toISOString(),
          path: '/v1/people',
        });
      }
    }

    const person = this.personRepo.create(dto);
    return this.personRepo.save(person);
  }

  async findAll(): Promise<Person[]> {
    return this.personRepo.find();
  }

  async findOne(id: number): Promise<Person> {
    const person = await this.personRepo.findOneBy({ id });
    if (!person) {
      throw new NotFoundException({
        statusCode: 404,
        error: ERROR_CODES.PERSON_NOT_FOUND,
        message: 'Pessoa não encontrada.',
        timestamp: new Date().toISOString(),
        path: `/v1/people/${id}`,
      });
    }
    return person;
  }

  async update(id: number, dto: UpdatePersonDto): Promise<Person> {
    const person = await this.findOne(id);

    if (dto.cpf && dto.cpf !== person.cpf) {
      const cpfExists = await this.personRepo.findOneBy({ cpf: dto.cpf });
      if (cpfExists) {
        throw new ConflictException({
          statusCode: 409,
          error: ERROR_CODES.PERSON_ALREADY_EXISTS,
          message: 'Pessoa já existe com este CPF.',
          timestamp: new Date().toISOString(),
          path: `/v1/people/${id}`,
        });
      }
    }

    if (dto.email && dto.email !== person.email) {
      const emailExists = await this.personRepo.findOneBy({ email: dto.email });
      if (emailExists) {
        throw new ConflictException({
          statusCode: 409,
          error: ERROR_CODES.EMAIL_ALREADY_EXISTS,
          message: 'Pessoa já existe com este email.',
          timestamp: new Date().toISOString(),
          path: `/v1/people/${id}`,
        });
      }
    }

    Object.assign(person, dto);
    return this.personRepo.save(person);
  }

  async remove(id: number): Promise<{ message: string }> {
    const person = await this.findOne(id);
    await this.personRepo.remove(person);
    return { message: 'Pessoa removida com sucesso' };
  }
}
