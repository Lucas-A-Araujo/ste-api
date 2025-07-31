import { IsDateString, IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CreatePersonDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  gender?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: string;

  @IsOptional()
  naturalness?: string;

  @IsOptional()
  nationality?: string;

  @IsNotEmpty()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'CPF deve estar no formato 000.000.000-00' })
  cpf: string;
}
