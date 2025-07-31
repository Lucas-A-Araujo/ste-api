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
    remove: jest.fn(),
  };

  const mockPerson: Person = {
    id: 1,
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
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockPerson);
      mockRepository.save.mockResolvedValue(mockPerson);

      const result = await service.create(createPersonDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: [{ cpf: createPersonDto.cpf }, { email: createPersonDto.email }],
      });
      expect(repository.create).toHaveBeenCalledWith(createPersonDto);
      expect(repository.save).toHaveBeenCalledWith(mockPerson);
      expect(result).toEqual(mockPerson);
    });

    it('should throw ConflictException when CPF already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockPerson);

      await expect(service.create(createPersonDto)).rejects.toThrow(
        ConflictException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: [{ cpf: createPersonDto.cpf }, { email: createPersonDto.email }],
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      const existingPerson = { ...mockPerson, cpf: '999.999.999-99' };
      mockRepository.findOne.mockResolvedValue(existingPerson);

      await expect(service.create(createPersonDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all people', async () => {
      const people = [mockPerson];
      mockRepository.find.mockResolvedValue(people);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(people);
    });

    it('should return empty array when no people exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a person by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockPerson);

      const result = await service.findOne(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockPerson);
    });

    it('should throw NotFoundException when person not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999 });
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

      const result = await service.update(1, updatePersonDto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.save).toHaveBeenCalledWith(updatedPerson);
      expect(result).toEqual(updatedPerson);
    });

    it('should throw NotFoundException when person not found', async () => {
      const updatePersonDto: UpdatePersonDto = { name: 'Novo Nome' };
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(999, updatePersonDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException when CPF already exists', async () => {
      const updatePersonDto: UpdatePersonDto = { cpf: '999.999.999-99' };
      const existingPerson = { ...mockPerson, id: 2 };
      
      mockRepository.findOneBy
        .mockResolvedValueOnce(mockPerson) 
        .mockResolvedValueOnce(existingPerson); 

      await expect(service.update(1, updatePersonDto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when email already exists', async () => {
      const updatePersonDto: UpdatePersonDto = { email: 'existente@email.com' };
      const existingPerson = { ...mockPerson, id: 2 };
      
      mockRepository.findOneBy
        .mockResolvedValueOnce(mockPerson) // findOne call
        .mockResolvedValueOnce(existingPerson); // email check

      await expect(service.update(1, updatePersonDto)).rejects.toThrow(ConflictException);
    });

    it('should not check for conflicts when updating with same email', async () => {
      const updatePersonDto: UpdatePersonDto = { name: 'Novo Nome' };
      const updatedPerson = { ...mockPerson, name: 'Novo Nome' };
      
      mockRepository.findOneBy.mockResolvedValue(mockPerson);
      mockRepository.save.mockResolvedValue(updatedPerson);

      await service.update(1, updatePersonDto);

      expect(repository.findOneBy).toHaveBeenCalledTimes(1); // Only findOne call
      expect(repository.save).toHaveBeenCalledWith(updatedPerson);
    });

    it('should not check for conflicts when updating with same CPF', async () => {
      const updatePersonDto: UpdatePersonDto = { name: 'Novo Nome' };
      const updatedPerson = { ...mockPerson, name: 'Novo Nome' };
      
      mockRepository.findOneBy.mockResolvedValue(mockPerson);
      mockRepository.save.mockResolvedValue(updatedPerson);

      await service.update(1, updatePersonDto);

      expect(repository.findOneBy).toHaveBeenCalledTimes(1); // Only findOne call
      expect(repository.save).toHaveBeenCalledWith(updatedPerson);
    });

    it('should handle update with only name change', async () => {
      const updateDto = { name: 'Novo Nome' };
      const updatedPerson = { ...mockPerson, name: 'Novo Nome' };
      
      mockRepository.findOneBy.mockResolvedValue(mockPerson);
      mockRepository.save.mockResolvedValue(updatedPerson);

      const result = await service.update(1, updateDto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.save).toHaveBeenCalledWith(updatedPerson);
      expect(result).toEqual(updatedPerson);
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

      const result = await service.update(1, updatePersonDto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.save).toHaveBeenCalledWith(updatedPerson);
      expect(result).toEqual(updatedPerson);
    });
  });

  describe('remove', () => {
    it('should remove a person successfully', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockPerson);
      mockRepository.remove.mockResolvedValue(mockPerson);

      await service.remove(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.remove).toHaveBeenCalledWith(mockPerson);
    });

    it('should throw NotFoundException when person not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
}); 