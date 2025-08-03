import { ApiProperty } from '@nestjs/swagger';

export class PersonValidationErrorResponseDto {
  @ApiProperty({ 
    description: 'Código de status HTTP',
    example: 400 
  })
  statusCode: number;

  @ApiProperty({ 
    description: 'Mensagens de erro de validação',
    example: [
      'CPF deve ser válido',
      'CPF deve estar no formato 000.000.000-00'
    ]
  })
  message: string[];

  @ApiProperty({ 
    description: 'Tipo do erro',
    example: 'Bad Request' 
  })
  error: string;
}

export class PersonNotFoundErrorResponseDto {
  @ApiProperty({ 
    description: 'Código de status HTTP',
    example: 404 
  })
  statusCode: number;

  @ApiProperty({ 
    description: 'Mensagem de erro',
    example: 'Pessoa não encontrada.' 
  })
  message: string;

  @ApiProperty({ 
    description: 'Tipo do erro',
    example: 'Not Found' 
  })
  error: string;
}

export class PersonConflictErrorResponseDto {
  @ApiProperty({ 
    description: 'Código de status HTTP',
    example: 409 
  })
  statusCode: number;

  @ApiProperty({ 
    description: 'Mensagem de erro',
    example: 'CPF ou email já cadastrado.' 
  })
  message: string;

  @ApiProperty({ 
    description: 'Tipo do erro',
    example: 'Conflict' 
  })
  error: string;
}

export class PersonConflictCPFErrorResponseDto {
  @ApiProperty({ 
    description: 'Código de status HTTP',
    example: 409 
  })
  statusCode: number;

  @ApiProperty({ 
    description: 'Mensagem de erro',
    example: 'CPF já cadastrado.' 
  })
  message: string;

  @ApiProperty({ 
    description: 'Tipo do erro',
    example: 'Conflict' 
  })
  error: string;
}

export class PersonConflictEmailErrorResponseDto {
  @ApiProperty({ 
    description: 'Código de status HTTP',
    example: 409 
  })
  statusCode: number;

  @ApiProperty({ 
    description: 'Mensagem de erro',
    example: 'Email já cadastrado.' 
  })
  message: string;

  @ApiProperty({ 
    description: 'Tipo do erro',
    example: 'Conflict' 
  })
  error: string;
} 