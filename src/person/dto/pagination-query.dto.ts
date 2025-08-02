import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Termo de pesquisa que será buscado em todos os campos (nome, email, naturalidade, nacionalidade, CPF)',
    example: 'João',
    required: false
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'Número da página (começando em 1)',
    example: 1,
    minimum: 1,
    default: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Página deve ser um número inteiro' })
  @Min(1, { message: 'Página deve ser maior ou igual a 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Número de itens por página',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limite deve ser um número inteiro' })
  @Min(1, { message: 'Limite deve ser maior ou igual a 1' })
  @Max(100, { message: 'Limite deve ser menor ou igual a 100' })
  limit?: number = 10;
} 