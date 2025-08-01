import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ 
    description: 'Código de status HTTP',
    example: 400 
  })
  statusCode: number;

  @ApiProperty({ 
    description: 'Mensagem de erro',
    example: 'Dados inválidos' 
  })
  message: string;

  @ApiProperty({ 
    description: 'Tipo do erro',
    example: 'Bad Request' 
  })
  error: string;
}

export class ValidationErrorResponseDto {
  @ApiProperty({ 
    description: 'Código de status HTTP',
    example: 400 
  })
  statusCode: number;

  @ApiProperty({ 
    description: 'Mensagem de erro',
    example: 'Validation failed' 
  })
  message: string;

  @ApiProperty({ 
    description: 'Tipo do erro',
    example: 'Bad Request' 
  })
  error: string;

  @ApiProperty({ 
    description: 'Detalhes dos erros de validação',
    example: [
      {
        field: 'cpf',
        message: 'CPF deve estar no formato 000.000.000-00'
      }
    ]
  })
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export class NotFoundErrorResponseDto {
  @ApiProperty({ 
    description: 'Código de status HTTP',
    example: 404 
  })
  statusCode: number;

  @ApiProperty({ 
    description: 'Mensagem de erro',
    example: 'Pessoa não encontrada' 
  })
  message: string;

  @ApiProperty({ 
    description: 'Tipo do erro',
    example: 'Not Found' 
  })
  error: string;
}

export class ConflictErrorResponseDto {
  @ApiProperty({ 
    description: 'Código de status HTTP',
    example: 409 
  })
  statusCode: number;

  @ApiProperty({ 
    description: 'Mensagem de erro',
    example: 'CPF já existe no sistema' 
  })
  message: string;

  @ApiProperty({ 
    description: 'Tipo do erro',
    example: 'Conflict' 
  })
  error: string;
} 