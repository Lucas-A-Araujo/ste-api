import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';

@Catch(UnauthorizedException)
export class JwtExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    const isJwtError = message.includes('jwt') || 
                      message.includes('token') || 
                      message.includes('Unauthorized') ||
                      message.includes('Credenciais inválidas');

    const errorResponse = {
      statusCode: status,
      message: isJwtError ? 'Token inválido ou expirado' : message,
      error: isJwtError ? 'UNAUTHORIZED' : 'UNAUTHORIZED',
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
} 