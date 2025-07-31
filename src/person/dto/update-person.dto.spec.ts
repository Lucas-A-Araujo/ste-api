import { validate } from 'class-validator';
import { UpdatePersonDto } from './update-person.dto';

describe('UpdatePersonDto', () => {
  describe('inheritance from CreatePersonDto', () => {
    it('should have all properties from CreatePersonDto', () => {
      const dto = new UpdatePersonDto();

      expect(typeof dto.name).toBe('undefined');
      expect(typeof dto.email).toBe('undefined');
      expect(typeof dto.birthDate).toBe('undefined');
      expect(typeof dto.cpf).toBe('undefined');
      expect(typeof dto.gender).toBe('undefined');
      expect(typeof dto.naturalness).toBe('undefined');
      expect(typeof dto.nationality).toBe('undefined');
    });

    it('should allow partial updates', async () => {
      const dto = new UpdatePersonDto();
      dto.name = 'João Silva Atualizado';

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate partial data correctly', async () => {
      const dto = new UpdatePersonDto();
      dto.email = 'joao.novo@email.com';
      dto.cpf = '123.456.789-00';

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });

  describe('validation rules', () => {
    it('should pass validation with valid partial data', async () => {
      const dto = new UpdatePersonDto();
      dto.name = 'João Silva';
      dto.email = 'joao@email.com';
      dto.birthDate = '1990-01-01';
      dto.cpf = '123.456.789-00';

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation when email is invalid', async () => {
      const dto = new UpdatePersonDto();
      dto.email = 'invalid-email';

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('should fail validation when birthDate is invalid', async () => {
      const dto = new UpdatePersonDto();
      dto.birthDate = 'invalid-date';

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('birthDate');
      expect(errors[0].constraints).toHaveProperty('isDateString');
    });

    it('should fail validation when CPF format is invalid', async () => {
      const dto = new UpdatePersonDto();
      dto.cpf = '12345678900'; 
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('cpf');
      expect(errors[0].constraints).toHaveProperty('matches');
    });

    it('should pass validation with valid CPF format', async () => {
      const dto = new UpdatePersonDto();
      dto.cpf = '123.456.789-00';

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });

  describe('optional fields', () => {
    it('should allow all fields to be optional', async () => {
      const dto = new UpdatePersonDto();

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate optional email when provided', async () => {
      const dto = new UpdatePersonDto();
      dto.email = 'valid@email.com';

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate optional birthDate when provided', async () => {
      const dto = new UpdatePersonDto();
      dto.birthDate = '1990-01-01';

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate optional CPF when provided', async () => {
      const dto = new UpdatePersonDto();
      dto.cpf = '123.456.789-00';

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });

  describe('multiple validation errors', () => {
    it('should return multiple errors for invalid partial data', async () => {
      const dto = new UpdatePersonDto();
      dto.email = 'invalid-email';
      dto.birthDate = 'invalid-date';
      dto.cpf = 'invalid-cpf';

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(1);
      const errorProperties = errors.map(error => error.property);
      expect(errorProperties).toContain('email');
      expect(errorProperties).toContain('birthDate');
      expect(errorProperties).toContain('cpf');
    });
  });

  describe('real-world scenarios', () => {
    it('should handle name update only', async () => {
      const dto = new UpdatePersonDto();
      dto.name = 'Novo Nome';

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should handle email update only', async () => {
      const dto = new UpdatePersonDto();
      dto.email = 'novo@email.com';

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should handle multiple field updates', async () => {
      const dto = new UpdatePersonDto();
      dto.name = 'Nome Atualizado';
      dto.email = 'atualizado@email.com';
      dto.nationality = 'Português';

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });
}); 