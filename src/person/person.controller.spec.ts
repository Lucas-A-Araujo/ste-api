import { Test, TestingModule } from '@nestjs/testing';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';

describe('PersonController', () => {
  let controller: PersonController;
  let service: PersonService;

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

  const mockPersonService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
      providers: [
        {
          provide: PersonService,
          useValue: mockPersonService,
        },
      ],
    }).compile();

    controller = module.get<PersonController>(PersonController);
    service = module.get<PersonService>(PersonService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new person', async () => {
      mockPersonService.create.mockResolvedValue(mockPerson);

      const result = await controller.create(createPersonDto);

      expect(service.create).toHaveBeenCalledWith(createPersonDto);
      expect(result).toEqual(mockPerson);
    });

    it('should pass the DTO correctly to service', async () => {
      const dto = {
        name: 'Maria Silva',
        email: 'maria@email.com',
        birthDate: '1985-05-15',
        cpf: '987.654.321-00',
      };
      mockPersonService.create.mockResolvedValue(mockPerson);

      await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of people', async () => {
      const people = [mockPerson];
      mockPersonService.findAll.mockResolvedValue(people);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(people);
    });

    it('should return empty array when no people exist', async () => {
      mockPersonService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a person by id', async () => {
      mockPersonService.findOne.mockResolvedValue(mockPerson);

      const result = await controller.findOne('550e8400-e29b-41d4-a716-446655440000');

      expect(service.findOne).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440000');
      expect(result).toEqual(mockPerson);
    });

    it('should pass string id to service', async () => {
      mockPersonService.findOne.mockResolvedValue(mockPerson);

      await controller.findOne('660e8400-e29b-41d4-a716-446655440000');

      expect(service.findOne).toHaveBeenCalledWith('660e8400-e29b-41d4-a716-446655440000');
    });

    it('should handle invalid id parameter', async () => {
      mockPersonService.findOne.mockResolvedValue(mockPerson);

      await controller.findOne('invalid-uuid');

      expect(service.findOne).toHaveBeenCalledWith('invalid-uuid');
    });
  });

  describe('update', () => {
    const updatePersonDto: UpdatePersonDto = {
      name: 'João Silva Atualizado',
      email: 'joao.novo@email.com',
    };

    it('should update a person', async () => {
      const updatedPerson = { ...mockPerson, ...updatePersonDto };
      mockPersonService.update.mockResolvedValue(updatedPerson);

      const result = await controller.update('550e8400-e29b-41d4-a716-446655440000', updatePersonDto);

      expect(service.update).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440000', updatePersonDto);
      expect(result).toEqual(updatedPerson);
    });

    it('should pass string id to service', async () => {
      mockPersonService.update.mockResolvedValue(mockPerson);

      await controller.update('660e8400-e29b-41d4-a716-446655440000', updatePersonDto);

      expect(service.update).toHaveBeenCalledWith('660e8400-e29b-41d4-a716-446655440000', updatePersonDto);
    });

    it('should pass partial DTO correctly', async () => {
      const partialDto = { name: 'Novo Nome' };
      mockPersonService.update.mockResolvedValue(mockPerson);

      await controller.update('550e8400-e29b-41d4-a716-446655440000', partialDto);

      expect(service.update).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440000', partialDto);
    });
  });

  describe('remove', () => {
    it('should remove a person', async () => {
      mockPersonService.remove.mockResolvedValue(undefined);

      await controller.remove('550e8400-e29b-41d4-a716-446655440000');

      expect(service.remove).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should pass string id to service', async () => {
      mockPersonService.remove.mockResolvedValue(undefined);

      await controller.remove('660e8400-e29b-41d4-a716-446655440000');

      expect(service.remove).toHaveBeenCalledWith('660e8400-e29b-41d4-a716-446655440000');
    });
  });

  describe('error handling', () => {
    it('should propagate service errors', async () => {
      const error = new Error('Service error');
      mockPersonService.create.mockRejectedValue(error);

      await expect(controller.create(createPersonDto)).rejects.toThrow(error);
    });

    it('should handle service exceptions', async () => {
      const notFoundError = new Error('Person not found');
      mockPersonService.findOne.mockRejectedValue(notFoundError);

      await expect(controller.findOne('999')).rejects.toThrow(notFoundError);
    });
  });
}); 