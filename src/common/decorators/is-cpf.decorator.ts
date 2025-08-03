import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCPF',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          
          const cpf = value.replace(/[^\d]/g, '');
          
          if (cpf.length !== 11) return false;
          
          if (/^(\d)\1{10}$/.test(cpf)) return false;
          
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ser um CPF válido no formato 000.000.000-00`;
        },
      },
    });
  };
} 