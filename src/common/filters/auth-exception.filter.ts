import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';

@Catch(UnauthorizedException, ForbiddenException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException | ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    let errorCode = 'UNAUTHORIZED';
    let errorMessage = message;

    // Determinar o tipo específico de erro
    if (message.includes('jwt') || message.includes('token')) {
      errorCode = 'INVALID_TOKEN';
      errorMessage = 'Token inválido ou expirado';
    } else if (message.includes('Credenciais inválidas')) {
      errorCode = 'INVALID_CREDENTIALS';
      errorMessage = 'Email ou senha incorretos';
    } else if (exception instanceof ForbiddenException) {
      errorCode = 'FORBIDDEN';
      errorMessage = 'Acesso negado';
    } else {
      errorCode = 'UNAUTHORIZED';
      errorMessage = 'Não autorizado';
    }

    const errorResponse = {
      statusCode: status,
      message: [errorMessage], // Sempre em array
      error: errorCode,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
} 