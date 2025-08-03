import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ERROR_CODES, ErrorCode } from '../constants/error-codes';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error: ErrorCode = ERROR_CODES.INTERNAL_SERVER_ERROR;
    let message = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const responseContent = exception.getResponse();

      if (
        typeof responseContent === 'object' &&
        responseContent !== null &&
        (responseContent as any).error &&
        (responseContent as any).statusCode
      ) {
        // Se já tem uma estrutura de erro, apenas garante que message seja array
        const errorResponse = responseContent as any;
        if (!Array.isArray(errorResponse.message)) {
          errorResponse.message = [errorResponse.message];
        }
        response.status(status).json(errorResponse);
        return;
      }

      if (
        status === HttpStatus.NOT_FOUND &&
        typeof responseContent === 'object' &&
        responseContent !== null &&
        (responseContent as any).message &&
        (responseContent as any).message.startsWith('Cannot ')
      ) {
        error = ERROR_CODES.ROUTE_NOT_FOUND;
        message = 'Rota não encontrada';
      } else {
        message =
          typeof responseContent === 'string'
            ? responseContent
            : (responseContent as any).message || message;
        
        if (status === HttpStatus.NOT_FOUND) {
          error = ERROR_CODES.RESOURCE_NOT_FOUND;
        } else if (status === HttpStatus.BAD_REQUEST) {
          error = ERROR_CODES.VALIDATION_ERROR;
        } else if (status === HttpStatus.CONFLICT) {
          error = ERROR_CODES.CONFLICT_ERROR;
        } else if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
          error = ERROR_CODES.INTERNAL_SERVER_ERROR;
        } else {
          error = ERROR_CODES.UNKNOWN_ERROR;
        }
      }
    }

    response.status(status).json({
      statusCode: status,
      error,
      message: [message], // Sempre em array
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
} 