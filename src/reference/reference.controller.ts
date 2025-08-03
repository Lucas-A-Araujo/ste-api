import { Controller, Get, Query, Version } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ReferenceService } from './reference.service';

@ApiTags('reference')
@Controller('reference')
export class ReferenceController {
  constructor(private readonly referenceService: ReferenceService) {}

  @Get('nationalities')
  @Version('1')
  @ApiOperation({ 
    summary: 'Listar nacionalidades',
    description: 'Retorna uma lista de nacionalidades disponíveis para popular campos de seleção. Aceita parâmetro de pesquisa opcional.'
  })
  @ApiQuery({ 
    name: 'q', 
    description: 'Termo de busca para filtrar nacionalidades (opcional)',
    required: false,
    type: String,
    example: 'Brasil'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de nacionalidades retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'string'
      },
      example: ['Brasileira', 'Americana', 'Canadense', 'Francesa', 'Alemã', 'Italiana', 'Espanhola', 'Portuguesa', 'Argentina', 'Chilena', 'Mexicana', 'Colombiana', 'Peruana', 'Venezuelana', 'Uruguaia', 'Paraguaia', 'Boliviana', 'Equatoriana', 'Guiana', 'Suriname', 'Guiana Francesa']
    }
  })
  getNationalities(@Query('q') searchTerm?: string) {
    if (searchTerm) {
      return this.referenceService.searchNacionalidades(searchTerm);
    }
    return this.referenceService.getAllNacionalidades();
  }

  @Get('birthplaces')
  @Version('1')
  @ApiOperation({ 
    summary: 'Listar naturalidades',
    description: 'Retorna uma lista de naturalidades (cidades/estados) disponíveis para popular campos de seleção. Aceita parâmetro de pesquisa opcional.'
  })
  @ApiQuery({ 
    name: 'q', 
    description: 'Termo de busca para filtrar naturalidades (opcional)',
    required: false,
    type: String,
    example: 'São Paulo'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de naturalidades retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'string'
      },
      example: ['São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG', 'Salvador, BA', 'Fortaleza, CE', 'Brasília, DF', 'Curitiba, PR', 'Recife, PE', 'Porto Alegre, RS', 'Manaus, AM']
    }
  })
  getBirthplaces(@Query('q') searchTerm?: string) {
    if (searchTerm) {
      return this.referenceService.searchNaturalidades(searchTerm);
    }
    return this.referenceService.getAllNaturalidades();
  }
} 