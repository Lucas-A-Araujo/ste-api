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

  async findAll(searchTerm?: string): Promise<Person[]> {
    if (!searchTerm || searchTerm === '') {
      return this.personRepo.find();
    }

    const searchPattern = `%${searchTerm}%`;
    
    return this.personRepo
      .createQueryBuilder('person')
      .where('person.name ILIKE :searchTerm', { searchTerm: searchPattern })
      .orWhere('person.email ILIKE :searchTerm', { searchTerm: searchPattern })
      .orWhere('person.naturalness ILIKE :searchTerm', { searchTerm: searchPattern })
      .orWhere('person.nationality ILIKE :searchTerm', { searchTerm: searchPattern })
      .orWhere('person.cpf ILIKE :searchTerm', { searchTerm: searchPattern })
      .getMany();
  }

  async findOne(id: string): Promise<Person> {
    try {
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
    } catch (error) {
      if (error.code === '22P02' || error.message?.includes('invalid input syntax')) {
        throw new NotFoundException({
          statusCode: 404,
          error: 'PERSON_NOT_FOUND',
          message: 'Pessoa não encontrada.',
          timestamp: new Date().toISOString(),
          path: `/v1/people/${id}`,
        });
      }
      
      if (error.code) {
        console.error('Database error:', error);
        throw error;
      }
      
      throw error;
    }
  }

  async update(id: string, dto: UpdatePersonDto): Promise<Person> {
    try {
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
    } catch (error) {
      if (error.code === '22P02' || error.message?.includes('invalid input syntax')) {
        throw new NotFoundException({
          statusCode: 404,
          error: 'PERSON_NOT_FOUND',
          message: 'Pessoa não encontrada.',
          timestamp: new Date().toISOString(),
          path: `/v1/people/${id}`,
        });
      }
      
      if (error.code) {
        console.error('Database error:', error);
        throw error;
      }
      
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const person = await this.findOne(id);
      await this.personRepo.remove(person);
      return { message: 'Pessoa removida com sucesso' };
    } catch (error) {
      if (error.code === '22P02' || error.message?.includes('invalid input syntax')) {
        throw new NotFoundException({
          statusCode: 404,
          error: 'PERSON_NOT_FOUND',
          message: 'Pessoa não encontrada.',
          timestamp: new Date().toISOString(),
          path: `/v1/people/${id}`,
        });
      }
      
      if (error.code) {
        console.error('Database error:', error);
        throw error; // Re-throw para manter 500
      }
      
      throw error;
    }
  }
}
