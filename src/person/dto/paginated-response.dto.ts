import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Lista de itens da página atual'
  })
  data: T[];

  @ApiProperty({
    description: 'Número da página atual',
    example: 1
  })
  page: number;

  @ApiProperty({
    description: 'Número de itens por página',
    example: 10
  })
  limit: number;

  @ApiProperty({
    description: 'Número total de itens',
    example: 150
  })
  total: number;

  @ApiProperty({
    description: 'Número total de páginas',
    example: 15
  })
  totalPages: number;

  @ApiProperty({
    description: 'Indica se existe uma página anterior',
    example: false
  })
  hasPrevious: boolean;

  @ApiProperty({
    description: 'Indica se existe uma próxima página',
    example: true
  })
  hasNext: boolean;
} 