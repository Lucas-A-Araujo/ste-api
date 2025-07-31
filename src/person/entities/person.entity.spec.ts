import { Person } from './person.entity';

describe('Person Entity', () => {
  describe('entity structure', () => {
    it('should have all required properties', () => {
      const person = new Person();

      expect(person).toHaveProperty('id');
      expect(person).toHaveProperty('name');
      expect(person).toHaveProperty('email');
      expect(person).toHaveProperty('birthDate');
      expect(person).toHaveProperty('cpf');
      expect(person).toHaveProperty('gender');
      expect(person).toHaveProperty('naturalness');
      expect(person).toHaveProperty('nationality');
      expect(person).toHaveProperty('createdAt');
      expect(person).toHaveProperty('updatedAt');
    });

    it('should allow setting and getting properties', () => {
      const person = new Person();
      const testName = 'João Silva';
      const testEmail = 'joao@email.com';
      const testBirthDate = new Date('1990-01-01');
      const testCpf = '123.456.789-00';

      person.name = testName;
      person.email = testEmail;
      person.birthDate = testBirthDate;
      person.cpf = testCpf;

      expect(person.name).toBe(testName);
      expect(person.email).toBe(testEmail);
      expect(person.birthDate).toBe(testBirthDate);
      expect(person.cpf).toBe(testCpf);
    });
  });

  describe('entity instantiation', () => {
    it('should create person with all properties', () => {
      const personData = {
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

      const person = Object.assign(new Person(), personData);

      expect(person.id).toBe(personData.id);
      expect(person.name).toBe(personData.name);
      expect(person.email).toBe(personData.email);
      expect(person.birthDate).toBe(personData.birthDate);
      expect(person.cpf).toBe(personData.cpf);
      expect(person.gender).toBe(personData.gender);
      expect(person.naturalness).toBe(personData.naturalness);
      expect(person.nationality).toBe(personData.nationality);
      expect(person.createdAt).toBe(personData.createdAt);
      expect(person.updatedAt).toBe(personData.updatedAt);
    });

    it('should create person with partial data', () => {
      const personData = {
        name: 'João Silva',
        cpf: '123.456.789-00',
      };

      const person = Object.assign(new Person(), personData);

      expect(person.name).toBe(personData.name);
      expect(person.cpf).toBe(personData.cpf);
      expect(person.id).toBeUndefined();
      expect(person.email).toBeUndefined();
    });
  });

  describe('data types', () => {
    it('should handle string properties correctly', () => {
      const person = new Person();
      const testName = 'João Silva';
      const testEmail = 'joao@email.com';
      const testCpf = '123.456.789-00';

      person.name = testName;
      person.email = testEmail;
      person.cpf = testCpf;

      expect(typeof person.name).toBe('string');
      expect(typeof person.email).toBe('string');
      expect(typeof person.cpf).toBe('string');
    });

    it('should handle date properties correctly', () => {
      const person = new Person();
      const testBirthDate = new Date('1990-01-01');
      const testCreatedAt = new Date();
      const testUpdatedAt = new Date();

      person.birthDate = testBirthDate;
      person.createdAt = testCreatedAt;
      person.updatedAt = testUpdatedAt;

      expect(person.birthDate).toBeInstanceOf(Date);
      expect(person.createdAt).toBeInstanceOf(Date);
      expect(person.updatedAt).toBeInstanceOf(Date);
    });

    it('should handle number properties correctly', () => {
      const person = new Person();
      const testId = 1;

      person.id = testId;

      expect(typeof person.id).toBe('number');
      expect(person.id).toBe(testId);
    });
  });

  describe('optional properties', () => {
    it('should allow optional properties to be undefined', () => {
      const person = new Person();

      expect(person.gender).toBeUndefined();
      expect(person.naturalness).toBeUndefined();
      expect(person.nationality).toBeUndefined();
    });

    it('should allow setting optional properties', () => {
      const person = new Person();
      const testGender = 'M';
      const testNaturalness = 'São Paulo';
      const testNationality = 'Brasileiro';

      person.gender = testGender;
      person.naturalness = testNaturalness;
      person.nationality = testNationality;

      expect(person.gender).toBe(testGender);
      expect(person.naturalness).toBe(testNaturalness);
      expect(person.nationality).toBe(testNationality);
    });
  });

  describe('entity comparison', () => {
    it('should compare entities correctly', () => {
      const person1 = new Person();
      person1.id = 1;
      person1.name = 'João Silva';
      person1.cpf = '123.456.789-00';

      const person2 = new Person();
      person2.id = 1;
      person2.name = 'João Silva';
      person2.cpf = '123.456.789-00';

      const person3 = new Person();
      person3.id = 2;
      person3.name = 'Maria Silva';
      person3.cpf = '987.654.321-00';

      expect(person1.id).toBe(person2.id);
      expect(person1.name).toBe(person2.name);
      expect(person1.cpf).toBe(person2.cpf);
      expect(person1.id).not.toBe(person3.id);
    });
  });

  describe('entity cloning', () => {
    it('should allow creating a copy of the entity', () => {
      const originalPerson = new Person();
      originalPerson.id = 1;
      originalPerson.name = 'João Silva';
      originalPerson.email = 'joao@email.com';
      originalPerson.birthDate = new Date('1990-01-01');
      originalPerson.cpf = '123.456.789-00';

      const clonedPerson = Object.assign(new Person(), originalPerson);

      expect(clonedPerson.id).toBe(originalPerson.id);
      expect(clonedPerson.name).toBe(originalPerson.name);
      expect(clonedPerson.email).toBe(originalPerson.email);
      expect(clonedPerson.birthDate).toBe(originalPerson.birthDate);
      expect(clonedPerson.cpf).toBe(originalPerson.cpf);
    });
  });
}); 