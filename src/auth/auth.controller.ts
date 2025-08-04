import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Version } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Fazer login na aplicação',
    description: 'Autentica um usuário usando email e senha. Retorna um token JWT válido para acessar endpoints protegidos da API.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login realizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        access_token: { 
          type: 'string',
          description: 'Token JWT para autenticação',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwic3ViIjoxLCJpYXQiOjE3NTQyNjIwNDQsImV4cCI6MTc1NDM0ODQ0NH0.EfFcNO7znziuX5Jl5mhItjmyd_MyPplRQmvD3Amr'
        },
        user: {
          type: 'object',
          description: 'Dados do usuário autenticado',
          properties: {
            id: { 
              type: 'number',
              description: 'ID único do usuário',
              example: 1
            },
            email: { 
              type: 'string',
              description: 'Email do usuário',
              example: 'admin@example.com'
            },
            name: { 
              type: 'string',
              description: 'Nome do usuário',
              example: 'Administrador'
            },
          },
        },
      },
    },
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['email deve ser um endereço de email válido', 'password deve ter pelo menos 6 caracteres']
        },
        error: { type: 'string', example: 'Bad Request' },
        timestamp: { type: 'string', example: '2025-08-03T22:45:14.957Z' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciais inválidas ou usuário inativo',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['Email ou senha incorretos']
        },
        error: { type: 'string', example: 'INVALID_CREDENTIALS' },
        timestamp: { type: 'string', example: '2025-08-03T22:45:14.957Z' }
      }
    }
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
} 