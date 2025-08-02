import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ERROR_CODES, ErrorCode } from '../constants/error-codes';

@Injectable()
export class ValidationErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        if (error instanceof BadRequestException) {
          const response = error.getResponse();
          
          if (typeof response === 'object' && response !== null && Array.isArray((response as any).message)) {
            let errorCode: ErrorCode = ERROR_CODES.VALIDATION_ERROR;
            const messages = (response as any).message as string[];
            
            if (messages.some(msg => msg.includes('CPF'))) {
              errorCode = ERROR_CODES.INVALID_CPF;
            } else if (messages.some(msg => msg.includes('email'))) {
              errorCode = ERROR_CODES.INVALID_EMAIL;
            }

            const request = context.switchToHttp().getRequest();
            
            return throwError(() => new BadRequestException({
              statusCode: 400,
              error: errorCode,
              message: messages,
              timestamp: new Date().toISOString(),
              path: request.url,
            }));
          }
        }
        
        return throwError(() => error);
      })
    );
  }
} 