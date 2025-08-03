import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PersonService } from './person.service';
import { Person } from './entities/person.entity';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

describe('PersonService', () => {
  let service: PersonService;
  let repository: Repository<Person>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    findAndCount: jest.fn(),
    remove: jest.fn(),
  };

  const mockPerson: Person = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'João Silva',
    email: 'joao@email.com',
    birthDate: new Date('1990-01-01'),
    cpf: '123.456.789-00',
    gender: 'M',
    naturalness: 'São Paulo',
    nationality: 'Brasileiro',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createPersonDto: CreatePersonDto = {
    name: 'João Silva',
    email: 'joao@email.com',
    birthDate: '1990-01-01',
    cpf: '123.456.789-00',
    gender: 'M',
    naturalness: 'São Paulo',
    nationality: 'Brasileiro',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: getRepositoryToken(Person),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PersonService>(PersonService);
    repository = module.get<Repository<Person>>(getRepositoryToken(Person));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new person successfully', async () => {
      mockRepository.findOneBy
        .mockResolvedValueOnce(null) // CPF check
        .mockResolvedValueOnce(null); // Email check
      mockRepository.create.mockReturnValue(mockPerson);
      mockRepository.save.mockResolvedValue(mockPerson);

      const result = await service.create(createPersonDto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ cpf: createPersonDto.cpf });
      expect(repository.findOneBy).toHaveBeenCalledWith({ email: createPersonDto.email });
      expect(repository.create).toHaveBeenCalledWith(createPersonDto);
      expect(repository.save).toHaveBeenCalledWith(mockPerson);
      expect(result.cpf).toBe('***.456.789-**');
    });

    it('should throw ConflictException when CPF already exists', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockPerson);

      await expect(service.create(createPersonDto)).rejects.toThrow(
        ConflictException,
      );
      expect(repository.findOneBy).toHaveBeenCalledWith({ cpf: createPersonDto.cpf });
    });

    it('should throw ConflictException when email already exists', async () => {
      const existingPerson = { ...mockPerson, cpf: '999.999.999-99' };
      mockRepository.findOneBy
        .mockResolvedValueOnce(null) // CPF check
        .mockResolvedValueOnce(existingPerson); // Email check

      await expect(service.create(createPersonDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all people', async () => {
      const people = [mockPerson];
      mockRepository.findAndCount.mockResolvedValue([people, 1]);

      const result = await service.findAll();

      expect(repository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { name: 'ASC' }
      });
      expect(result.data[0].cpf).toBe('***.456.789-**');
    });

    it('should return empty array when no people exist', async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);

      const result = await service.findAll();

      expect(result.data).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a person by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockPerson);

      const result = await service.findOne('550e8400-e29b-41d4-a716-446655440000');

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '550e8400-e29b-41d4-a716-446655440000' });
      expect(result).toEqual(mockPerson);
    });

    it('should throw NotFoundException when person not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '999' });
    });
  });

  describe('update', () => {
    it('should update a person successfully', async () => {
      const updatePersonDto: UpdatePersonDto = {
        name: 'João Silva Atualizado',
      };
      const updatedPerson = { ...mockPerson, ...updatePersonDto };
      
      mockRepository.findOneBy.mockResolvedValue(mockPerson);
      mockRepository.save.mockResolvedValue(updatedPerson);

      const result = await service.update('550e8400-e29b-41d4-a716-446655440000', updatePersonDto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '550e8400-e29b-41d4-a716-446655440000' });
      expect(repository.save).toHaveBeenCalledWith(updatedPerson);
      expect(result.cpf).toBe('***.456.789-**');
    });

    it('should throw NotFoundException when person not found', async () => {
      const updatePersonDto: UpdatePersonDto = { name: 'Novo Nome' };
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update('999', updatePersonDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException when CPF already exists', async () => {
      const updatePersonDto: UpdatePersonDto = { cpf: '999.999.999-99' };
      const existingPerson = { ...mockPerson, id: '660e8400-e29b-41d4-a716-446655440000' };
      
      mockRepository.findOneBy
        .mockResolvedValueOnce(mockPerson) // findOne call
        .mockResolvedValueOnce(existingPerson); // CPF check

      await expect(service.update('550e8400-e29b-41d4-a716-446655440000', updatePersonDto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when email already exists', async () => {
      const updatePersonDto: UpdatePersonDto = { email: 'existente@email.com' };
      const existingPerson = { ...mockPerson, id: '660e8400-e29b-41d4-a716-446655440000' };
      
      mockRepository.findOneBy
        .mockResolvedValueOnce(mockPerson) // findOne call
        .mockResolvedValueOnce(existingPerson); // email check

      await expect(service.update('550e8400-e29b-41d4-a716-446655440000', updatePersonDto)).rejects.toThrow(ConflictException);
    });

    it('should not check for conflicts when updating with same email', async () => {
      const updatePersonDto: UpdatePersonDto = { name: 'Novo Nome' };
      const updatedPerson = { ...mockPerson, name: 'Novo Nome' };
      
      mockRepository.findOneBy.mockResolvedValue(mockPerson);
      mockRepository.save.mockResolvedValue(updatedPerson);

      await service.update('550e8400-e29b-41d4-a716-446655440000', updatePersonDto);

      expect(repository.findOneBy).toHaveBeenCalledTimes(2); // findOne call + direct findOneBy call
      expect(repository.save).toHaveBeenCalledWith(updatedPerson);
    });

    it('should not check for conflicts when updating with same CPF', async () => {
      const updatePersonDto: UpdatePersonDto = { name: 'Novo Nome' };
      const updatedPerson = { ...mockPerson, name: 'Novo Nome' };
      
      mockRepository.findOneBy.mockResolvedValue(mockPerson);
      mockRepository.save.mockResolvedValue(updatedPerson);

      await service.update('550e8400-e29b-41d4-a716-446655440000', updatePersonDto);

      expect(repository.findOneBy).toHaveBeenCalledTimes(2); // findOne call + direct findOneBy call
      expect(repository.save).toHaveBeenCalledWith(updatedPerson);
    });

    it('should handle update with only name change', async () => {
      const updateDto = { name: 'Novo Nome' };
      const updatedPerson = { ...mockPerson, name: 'Novo Nome' };
      
      mockRepository.findOneBy.mockResolvedValue(mockPerson);
      mockRepository.save.mockResolvedValue(updatedPerson);

      const result = await service.update('550e8400-e29b-41d4-a716-446655440000', updateDto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '550e8400-e29b-41d4-a716-446655440000' });
      expect(repository.save).toHaveBeenCalledWith(updatedPerson);
      expect(result.cpf).toBe('***.456.789-**');
    });

    it('should handle update with new email that does not exist', async () => {
      const updatePersonDto: UpdatePersonDto = {
        name: 'João Silva Atualizado',
        email: 'joao.novo@email.com',
      };
      const updatedPerson = { ...mockPerson, ...updatePersonDto };
      
      mockRepository.findOneBy
        .mockResolvedValueOnce(mockPerson) 
        .mockResolvedValueOnce(null); 
      mockRepository.save.mockResolvedValue(updatedPerson);

      const result = await service.update('550e8400-e29b-41d4-a716-446655440000', updatePersonDto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '550e8400-e29b-41d4-a716-446655440000' });
      expect(repository.save).toHaveBeenCalledWith(updatedPerson);
      expect(result.cpf).toBe('***.456.789-**');
    });
  });

  describe('remove', () => {
    it('should remove a person successfully', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockPerson);
      mockRepository.remove.mockResolvedValue(mockPerson);

      const result = await service.remove('550e8400-e29b-41d4-a716-446655440000');

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '550e8400-e29b-41d4-a716-446655440000' });
      expect(repository.remove).toHaveBeenCalledWith(mockPerson);
      expect(result).toEqual({ message: 'Pessoa removida com sucesso' });
    });

    it('should throw NotFoundException when person not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
}); 