import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { ERROR_CODES } from '../common/constants/error-codes';
import { EncryptionService } from '../common/services/encryption.service';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private personRepo: Repository<Person>,
    private encryptionService: EncryptionService,
  ) {}

  private isEncrypted(data: string): boolean {
    if (!data) return false;
    return data.startsWith('U2FsdGVkX1');
  }

  private safeDecrypt(data: string): string {
    if (!data) return data;
    
    if (!this.isEncrypted(data)) {
      return data;
    }
    
    try {
      const decrypted = this.encryptionService.decrypt(data);
      return decrypted;
    } catch (error) {
      return data;
    }
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

    const encryptedCPF = this.encryptionService.encrypt(dto.cpf);

    const person = this.personRepo.create({
      ...dto,
      cpf: encryptedCPF,
    });
    const savedPerson = await this.personRepo.save(person);

    return {
      ...savedPerson,
      cpf: this.safeDecrypt(savedPerson.cpf),
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
      
      const decryptedPersons = persons.map(person => ({
        ...person,
        cpf: this.safeDecrypt(person.cpf),
      }));

      const totalPages = Math.ceil(total / limit);
      
      return {
        data: decryptedPersons,
        page,
        limit,
        total,
        totalPages,
        hasPrevious: page > 1,
        hasNext: page < totalPages,
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

    const decryptedPersons = persons.map(person => ({
      ...person,
      cpf: this.safeDecrypt(person.cpf),
    }));

    const totalPages = Math.ceil(total / limit);
    
    return {
      data: decryptedPersons,
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
      return {
        ...person,
        cpf: this.safeDecrypt(person.cpf),
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

      if (dto.cpf) originalPerson.cpf = this.encryptionService.encrypt(dto.cpf);
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
        cpf: this.safeDecrypt(updatedPerson.cpf),
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
