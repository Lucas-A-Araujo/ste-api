import { validate } from 'class-validator';
import { CreatePersonDto } from './create-person.dto';

describe('CreatePersonDto', () => {
  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      const dto = new CreatePersonDto();
      dto.name = 'João Silva';
      dto.email = 'joao@email.com';
      dto.birthDate = '1990-01-01';
      dto.cpf = '123.456.789-00';
      dto.gender = 'M';
      dto.naturalness = 'São Paulo';
      dto.nationality = 'Brasileiro';

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation when name is empty', async () => {
      const dto = new CreatePersonDto();
      dto.name = '';
      dto.birthDate = '1990-01-01';
      dto.cpf = '123.456.789-00';

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation when name is missing', async () => {
      const dto = new CreatePersonDto();
      dto.birthDate = '1990-01-01';
      dto.cpf = '123.456.789-00';

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
    });

    it('should fail validation when email is invalid', async () => {
      const dto = new CreatePersonDto();
      dto.name = 'João Silva';
      dto.email = 'invalid-email';
      dto.birthDate = '1990-01-01';
      dto.cpf = '123.456.789-00';

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('should pass validation when email is valid', async () => {
      const dto = new CreatePersonDto();
      dto.name = 'João Silva';
      dto.email = 'joao@email.com';
      dto.birthDate = '1990-01-01';
      dto.cpf = '123.456.789-00';

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should pass validation when email is optional and not provided', async () => {
      const dto = new CreatePersonDto();
      dto.name = 'João Silva';
      dto.birthDate = '1990-01-01';
      dto.cpf = '123.456.789-00';

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation when birthDate is missing', async () => {
      const dto = new CreatePersonDto();
      dto.name = 'João Silva';
      dto.cpf = '123.456.789-00';

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('birthDate');
    });

    it('should fail validation when birthDate is invalid format', async () => {
      const dto = new CreatePersonDto();
      dto.name = 'João Silva';
      dto.birthDate = 'invalid-date';
      dto.cpf = '123.456.789-00';

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('birthDate');
      expect(errors[0].constraints).toHaveProperty('isDateString');
    });

    it('should pass validation with valid birthDate', async () => {
      const dto = new CreatePersonDto();
      dto.name = 'João Silva';
      dto.birthDate = '1990-01-01';
      dto.cpf = '123.456.789-00';

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation when CPF is missing', async () => {
      const dto = new CreatePersonDto();
      dto.name = 'João Silva';
      dto.birthDate = '1990-01-01';

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('cpf');
    });

    it('should fail validation when CPF format is invalid', async () => {
      const dto = new CreatePersonDto();
      dto.name = 'João Silva';
      dto.birthDate = '1990-01-01';
      dto.cpf = '12345678900'; 

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('cpf');
      expect(errors[0].constraints).toHaveProperty('matches');
    });

    it('should pass validation with valid CPF format', async () => {
      const dto = new CreatePersonDto();
      dto.name = 'João Silva';
      dto.birthDate = '1990-01-01';
      dto.cpf = '123.456.789-00';

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should pass validation with optional fields', async () => {
      const dto = new CreatePersonDto();
      dto.name = 'João Silva';
      dto.birthDate = '1990-01-01';
      dto.cpf = '123.456.789-00';
      dto.gender = 'M';
      dto.naturalness = 'São Paulo';
      dto.nationality = 'Brasileiro';

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should pass validation without optional fields', async () => {
      const dto = new CreatePersonDto();
      dto.name = 'João Silva';
      dto.birthDate = '1990-01-01';
      dto.cpf = '123.456.789-00';

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });

  describe('multiple validation errors', () => {
    it('should return multiple errors for invalid data', async () => {
      const dto = new CreatePersonDto();
      dto.name = '';
      dto.email = 'invalid-email';
      dto.birthDate = 'invalid-date';
      dto.cpf = 'invalid-cpf';

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(1);
      const errorProperties = errors.map(error => error.property);
      expect(errorProperties).toContain('name');
      expect(errorProperties).toContain('email');
      expect(errorProperties).toContain('birthDate');
      expect(errorProperties).toContain('cpf');
    });
  });
}); 