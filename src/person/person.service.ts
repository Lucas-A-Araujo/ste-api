import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { ERROR_CODES } from '../common/constants/error-codes';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private personRepo: Repository<Person>,
  ) {}

  private maskCpf(cpf: string): string {
    if (!cpf) return cpf;
    
    const cleanCpf = cpf.replace(/[^\d]/g, '');
    
    if (cleanCpf.length !== 11) return cpf;
    
    return `***.${cleanCpf.slice(3, 6)}.${cleanCpf.slice(6, 9)}-**`;
  }

  async create(dto: CreatePersonDto): Promise<Person> {
    const existingCpf = await this.personRepo.findOneBy({ cpf: dto.cpf });
    if (existingCpf) {
      throw new ConflictException({
        statusCode: 409,
        error: ERROR_CODES.PERSON_ALREADY_EXISTS,
        message: ['Pessoa já existe.'],
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
          message: ['Pessoa já existe com este email.'],
          timestamp: new Date().toISOString(),
          path: '/v1/people',
        });
      }
    }

    const person = this.personRepo.create(dto);
    const savedPerson = await this.personRepo.save(person);

    return {
      ...savedPerson,
      cpf: this.maskCpf(savedPerson.cpf),
    };
  }

  async findAll(searchTerm?: string, pagination?: PaginationQueryDto): Promise<PaginatedResponseDto<Person>> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    if (!searchTerm || searchTerm === '') {
      const [persons, total] = await this.personRepo.findAndCount({
        skip,
        take: limit,
        order: { name: 'ASC' }
      });
      
      const maskedPersons = persons.map(person => ({
        ...person,
        cpf: this.maskCpf(person.cpf),
      }));

      return {
        data: maskedPersons,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasPrevious: page > 1,
        hasNext: page < Math.ceil(total / limit),
      };
    }

    const searchPattern = `%${searchTerm}%`;
    
    const queryBuilder = this.personRepo
      .createQueryBuilder('person')
      .where('person.name ILIKE :searchTerm', { searchTerm: searchPattern })
      .orWhere('person.email ILIKE :searchTerm', { searchTerm: searchPattern })
      .orWhere('person.naturalness ILIKE :searchTerm', { searchTerm: searchPattern })
      .orWhere('person.nationality ILIKE :searchTerm', { searchTerm: searchPattern })
      .orWhere('person.address ILIKE :searchTerm', { searchTerm: searchPattern })
      .orderBy('person.name', 'ASC');

    const [persons, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const maskedPersons = persons.map(person => ({
      ...person,
      cpf: this.maskCpf(person.cpf),
    }));

    const totalPages = Math.ceil(total / limit);
    
    return {
      data: maskedPersons,
      page,
      limit,
      total,
      totalPages,
      hasPrevious: page > 1,
      hasNext: page < totalPages,
    };
  }

  async findOne(id: string): Promise<Person> {
    try {
      const person = await this.personRepo.findOneBy({ id });
      if (!person) {
        throw new NotFoundException({
          statusCode: 404,
          error: ERROR_CODES.PERSON_NOT_FOUND,
          message: ['Pessoa não encontrada.'],
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
          message: ['Pessoa não encontrada.'],
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
            message: ['Pessoa já existe com este CPF.'],
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
            message: ['Pessoa já existe com este email.'],
            timestamp: new Date().toISOString(),
            path: `/v1/people/${id}`,
          });
        }
      }

      const originalPerson = await this.personRepo.findOneBy({ id });
      if (!originalPerson) {
        throw new NotFoundException({
          statusCode: 404,
          error: ERROR_CODES.PERSON_NOT_FOUND,
          message: ['Pessoa não encontrada.'],
          timestamp: new Date().toISOString(),
          path: `/v1/people/${id}`,
        });
      }

      if (dto.cpf) originalPerson.cpf = dto.cpf;
      if (dto.email) originalPerson.email = dto.email;
      if (dto.address) originalPerson.address = dto.address;
      if (dto.name) originalPerson.name = dto.name;
      if (dto.gender) originalPerson.gender = dto.gender;
      if (dto.birthDate) originalPerson.birthDate = new Date(dto.birthDate);
      if (dto.naturalness) originalPerson.naturalness = dto.naturalness;
      if (dto.nationality) originalPerson.nationality = dto.nationality;

      const updatedPerson = await this.personRepo.save(originalPerson);
      return {
        ...updatedPerson,
        cpf: this.maskCpf(updatedPerson.cpf),
      };
    } catch (error) {
      if (error.code === '22P02' || error.message?.includes('invalid input syntax')) {
        throw new NotFoundException({
          statusCode: 404,
          error: 'PERSON_NOT_FOUND',
          message: ['Pessoa não encontrada.'],
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
          message: ['Pessoa não encontrada.'],
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
}
