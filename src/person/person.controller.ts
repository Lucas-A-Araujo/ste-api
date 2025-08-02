import { Body, Controller, Delete, Get, Param, Post, Put, Version } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { CreatePersonV2Dto } from './dto/create-person-v2.dto';
import { UpdatePersonV2Dto } from './dto/update-person-v2.dto';
import { Person } from './entities/person.entity';
import { GenericErrorResponseDto } from '../common/dto/error-response.dto';
import { 
  PersonValidationErrorResponseDto,
  PersonNotFoundErrorResponseDto,
  PersonConflictErrorResponseDto,
} from './dto/person-error-response.dto';

@ApiTags('people')
@Controller('people')
export class PersonController {
  constructor(private readonly service: PersonService) {}

  @Post()
  @Version('1')
  @ApiOperation({ 
    summary: 'Criar uma nova pessoa (v1)',
    description: 'Cria um novo registro de pessoa no sistema. Todos os campos obrigatórios devem ser preenchidos.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Pessoa criada com sucesso',
    type: Person 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos',
    type: PersonValidationErrorResponseDto
  })
  @ApiResponse({ 
    status: 409, 
    description: 'CPF ou email já cadastrado',
    type: PersonConflictErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Erro interno do servidor',
    type: GenericErrorResponseDto
  })
  create(@Body() dto: CreatePersonDto) {
    return this.service.create(dto);
  }

  @Post()
  @Version('2')
  @ApiOperation({ 
    summary: 'Criar uma nova pessoa (v2)',
    description: 'Cria um novo registro de pessoa no sistema (versão 2). Inclui validação mais rigorosa do CPF.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Pessoa criada com sucesso',
    type: Person 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos',
    type: PersonValidationErrorResponseDto
  })
  @ApiResponse({ 
    status: 409, 
    description: 'CPF ou email já cadastrado',
    type: PersonConflictErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Erro interno do servidor',
    type: GenericErrorResponseDto
  })
  createV2(@Body() dto: CreatePersonV2Dto) {
    return this.service.create(dto);
  }

  @Get()
  @Version('1')
  @ApiOperation({ 
    summary: 'Listar todas as pessoas (v1)',
    description: 'Retorna uma lista com todas as pessoas cadastradas no sistema.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de pessoas retornada com sucesso',
    type: [Person]
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Erro interno do servidor',
    type: GenericErrorResponseDto
  })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Version('1')
  @ApiOperation({ 
    summary: 'Buscar pessoa por ID (v1)',
    description: 'Busca uma pessoa específica pelo seu ID único.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único da pessoa',
    example: 1,
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Pessoa encontrada com sucesso',
    type: Person 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Pessoa não encontrada',
    type: PersonNotFoundErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Erro interno do servidor',
    type: GenericErrorResponseDto
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Put(':id')
  @Version('1')
  @ApiOperation({ 
    summary: 'Atualizar pessoa por ID (v1)',
    description: 'Atualiza os dados de uma pessoa existente. Apenas os campos enviados serão atualizados.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único da pessoa',
    example: 1,
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Pessoa atualizada com sucesso',
    type: Person 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Pessoa não encontrada',
    type: PersonNotFoundErrorResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos',
    type: PersonValidationErrorResponseDto
  })
  @ApiResponse({ 
    status: 409, 
    description: 'CPF já cadastrado ou Email já cadastrado',
    schema: {
      oneOf: [
        { $ref: '#/components/schemas/PersonConflictCPFErrorResponseDto' },
        { $ref: '#/components/schemas/PersonConflictEmailErrorResponseDto' }
      ]
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Erro interno do servidor',
    type: GenericErrorResponseDto
  })
  update(@Param('id') id: string, @Body() dto: UpdatePersonDto) {
    return this.service.update(+id, dto);
  }

  @Put(':id')
  @Version('2')
  @ApiOperation({ 
    summary: 'Atualizar pessoa por ID (v2)',
    description: 'Atualiza os dados de uma pessoa existente (versão 2). Inclui validação mais rigorosa.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único da pessoa',
    example: 1,
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Pessoa atualizada com sucesso',
    type: Person 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Pessoa não encontrada',
    type: PersonNotFoundErrorResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos',
    type: PersonValidationErrorResponseDto
  })
  @ApiResponse({ 
    status: 409, 
    description: 'CPF já cadastrado ou Email já cadastrado',
    schema: {
      oneOf: [
        { $ref: '#/components/schemas/PersonConflictCPFErrorResponseDto' },
        { $ref: '#/components/schemas/PersonConflictEmailErrorResponseDto' }
      ]
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Erro interno do servidor',
    type: GenericErrorResponseDto
  })
  updateV2(@Param('id') id: string, @Body() dto: UpdatePersonV2Dto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Version('1')
  @ApiOperation({ 
    summary: 'Remover pessoa por ID (v1)',
    description: 'Remove uma pessoa do sistema permanentemente.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único da pessoa',
    example: 1,
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Pessoa removida com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Pessoa removida com sucesso'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Pessoa não encontrada',
    type: PersonNotFoundErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Erro interno do servidor',
    type: GenericErrorResponseDto
  })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
