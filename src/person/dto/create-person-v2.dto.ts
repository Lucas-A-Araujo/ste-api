import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, Matches, IsString } from 'class-validator';
import { IsCPF } from '../../common/decorators/is-cpf.decorator';

export class CreatePersonV2Dto {
  @ApiProperty({ 
    description: 'Nome completo da pessoa', 
    example: 'João Silva',
    minLength: 2,
    maxLength: 100
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Gênero da pessoa', 
    example: 'Masculino',
    required: false,
    enum: ['Masculino', 'Feminino', 'Outro']
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ 
    description: 'Email da pessoa', 
    example: 'joao.silva@email.com',
    required: false
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ 
    description: 'Data de nascimento (formato: YYYY-MM-DD)', 
    example: '1990-01-15'
  })
  @IsNotEmpty()
  @IsDateString()
  birthDate: string;

  @ApiProperty({ 
    description: 'Naturalidade da pessoa', 
    example: 'São Paulo',
    required: false
  })
  @IsOptional()
  @IsString()
  naturalness?: string;

  @ApiProperty({ 
    description: 'Nacionalidade da pessoa', 
    example: 'Brasileira',
    required: false
  })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({ 
    description: 'CPF da pessoa (formato: XXX.XXX.XXX-XX)', 
    example: '123.456.789-00'
  })
  @IsNotEmpty()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'CPF deve estar no formato 000.000.000-00' })
  @IsCPF({ message: 'CPF deve ser válido' })
  cpf: string;

  @ApiProperty({ 
    description: 'Endereço da pessoa', 
    example: 'Rua das Flores, 123 - Centro'
  })
  @IsNotEmpty()
  @IsString()
  address: string;
} 